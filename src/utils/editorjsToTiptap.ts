import type { EditorJSData, EditorJSBlock, TiptapDoc, TiptapNode, TiptapMark } from '../types';

export function convertEditorJSToTiptap(data: EditorJSData): TiptapDoc {
  const content: TiptapNode[] = [];

  for (const block of data.blocks) {
    const node = convertBlock(block);
    if (node) {
      if (Array.isArray(node)) {
        content.push(...node);
      } else {
        content.push(node);
      }
    }
  }

  return { type: 'doc', content };
}

function convertBlock(block: EditorJSBlock): TiptapNode | TiptapNode[] | null {
  switch (block.type) {
    case 'paragraph':
      return {
        type: 'paragraph',
        content: parseInlineHTML(String(block.data.text || '')),
      };

    case 'header':
      return {
        type: 'heading',
        attrs: { level: (block.data.level as number) || 2 },
        content: parseInlineHTML(String(block.data.text || '')),
      };

    case 'list': {
      const style = block.data.style as string;
      const listType = style === 'ordered' ? 'orderedList' : 'bulletList';
      const items = (block.data.items as unknown[]) || [];
      return {
        type: listType,
        content: items.map((item) => convertListItem(item, listType)),
      };
    }

    case 'code':
      return {
        type: 'codeBlock',
        attrs: { language: null },
        content: [{ type: 'text', text: String(block.data.code || '') }],
      };

    case 'quote': {
      const nodes: TiptapNode[] = [
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: parseInlineHTML(String(block.data.text || '')),
            },
          ],
        },
      ];
      if (block.data.caption) {
        nodes.push({
          type: 'paragraph',
          content: [
            { type: 'text', text: `— ${String(block.data.caption)}`, marks: [{ type: 'italic' }] },
          ],
        });
      }
      return nodes;
    }

    case 'delimiter':
      return { type: 'horizontalRule' };

    case 'image': {
      const fileData = block.data.file as { url: string } | undefined;
      const src = fileData?.url || (block.data.url as string) || '';
      return {
        type: 'image',
        attrs: {
          src,
          alt: (block.data.caption as string) || null,
          title: null,
        },
      };
    }

    default:
      return null;
  }
}

function convertListItem(item: unknown, parentType: string): TiptapNode {
  let text: string;
  let children: unknown[] = [];

  if (typeof item === 'string') {
    text = item;
  } else if (item && typeof item === 'object' && 'content' in item) {
    text = String((item as { content: string }).content);
    children = ((item as { items?: unknown[] }).items) || [];
  } else {
    text = String(item);
  }

  const listItem: TiptapNode = {
    type: 'listItem',
    content: [
      {
        type: 'paragraph',
        content: parseInlineHTML(text),
      },
    ],
  };

  if (children.length > 0) {
    listItem.content!.push({
      type: parentType,
      content: children.map((child) => convertListItem(child, parentType)),
    });
  }

  return listItem;
}

function parseInlineHTML(html: string): TiptapNode[] {
  if (!html || !html.trim()) return [];

  // If no HTML tags, return plain text
  if (!/<[^>]+>/.test(html)) {
    return [{ type: 'text', text: html }];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${html}</body>`, 'text/html');
  const nodes: TiptapNode[] = [];
  walkDOM(doc.body, [], nodes);
  return nodes;
}

function walkDOM(node: Node, marks: TiptapMark[], result: TiptapNode[]): void {
  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];

    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent || '';
      if (text) {
        const textNode: TiptapNode = { type: 'text', text };
        if (marks.length > 0) {
          textNode.marks = [...marks];
        }
        result.push(textNode);
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const newMarks = [...marks];

      switch (tag) {
        case 'b':
        case 'strong':
          newMarks.push({ type: 'bold' });
          break;
        case 'i':
        case 'em':
          newMarks.push({ type: 'italic' });
          break;
        case 'code':
          newMarks.push({ type: 'code' });
          break;
        case 'mark':
          newMarks.push({ type: 'highlight' });
          break;
        case 's':
        case 'strike':
        case 'del':
          newMarks.push({ type: 'strike' });
          break;
        case 'a': {
          const href = el.getAttribute('href');
          if (href) {
            newMarks.push({
              type: 'link',
              attrs: { href, target: '_blank', rel: 'noopener noreferrer nofollow' },
            });
          }
          break;
        }
      }

      walkDOM(el, newMarks, result);
    }
  }
}
