import { createElement } from 'react';
import { common, createLowlight } from 'lowlight';
import type { EditorJSData, EditorJSBlock } from '../../types';

const lowlight = createLowlight(common);

interface BlogContentRendererProps {
  content: EditorJSData;
}

const BlogContentRenderer = ({ content }: BlogContentRendererProps) => {
  return (
    <div className="blog-content space-y-6 max-w-prose">
      {content.blocks.map((block, index) => (
        <Block key={block.id || index} block={block} />
      ))}
    </div>
  );
};

function Block({ block }: { block: EditorJSBlock }) {
  switch (block.type) {
    case 'header':
      return <HeaderBlock level={block.data.level as number} text={block.data.text as string} />;
    case 'paragraph':
      return (
        <p
          className="text-dark-text-secondary leading-[1.8] text-lg"
          dangerouslySetInnerHTML={{ __html: block.data.text as string }}
        />
      );
    case 'list':
      return <ListBlock items={block.data.items as unknown[]} style={block.data.style as string} />;
    case 'code':
      return <HighlightedCodeBlock code={String(block.data.code || '')} />;
    case 'quote':
      return (
        <blockquote className="border-l-4 border-primary pl-4 py-2">
          <p
            className="text-dark-text-secondary italic text-lg"
            dangerouslySetInnerHTML={{ __html: block.data.text as string }}
          />
          {block.data.caption ? (
            <cite className="text-dark-text-muted text-sm mt-2 block">
              — {String(block.data.caption)}
            </cite>
          ) : null}
        </blockquote>
      );
    case 'delimiter':
      return <hr className="border-none border-t border-dark-border my-6" />;
    case 'image': {
      const fileData = block.data.file as { url: string } | undefined;
      const imageUrl = fileData?.url || (block.data.url as string) || '';
      const caption = block.data.caption as string | undefined;
      return (
        <figure className="my-8">
          <img
            src={imageUrl}
            alt={caption || ''}
            className="w-full rounded-lg"
          />
          {caption ? (
            <figcaption className="text-dark-text-muted text-sm text-center mt-2">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    default:
      return null;
  }
}

function HighlightedCodeBlock({ code }: { code: string }) {
  let highlighted: React.ReactNode;
  try {
    const tree = lowlight.highlightAuto(code);
    highlighted = hastChildrenToReact(tree.children as unknown as HastNode[]);
  } catch {
    highlighted = code;
  }

  return (
    <pre className="bg-[#111113] border border-dark-border rounded-lg p-4 overflow-x-auto">
      <code className="text-sm font-mono">{highlighted}</code>
    </pre>
  );
}

interface HastText { type: 'text'; value: string }
interface HastElement {
  type: 'element';
  tagName: string;
  properties?: { className?: string[] };
  children?: HastNode[];
}
type HastNode = HastText | HastElement;

function hastChildrenToReact(children: HastNode[]): React.ReactNode[] {
  return children.map((node, i) => {
    if (node.type === 'text') return node.value;
    if (node.type === 'element') {
      const className = node.properties?.className?.join(' ');
      return createElement(
        node.tagName,
        { key: i, className },
        node.children ? hastChildrenToReact(node.children) : undefined,
      );
    }
    return null;
  });
}

function HeaderBlock({ level, text }: { level: number; text: string }) {
  const id = text
    .replace(/<[^>]*>/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  const className = {
    2: 'text-3xl font-bold text-white mt-12 mb-4',
    3: 'text-2xl font-semibold text-white mt-8 mb-3',
    4: 'text-xl font-semibold text-white mt-6 mb-2',
  }[level] || 'text-xl font-semibold text-white mt-6 mb-2';

  if (level === 2) return <h2 id={id} className={className} dangerouslySetInnerHTML={{ __html: text }} />;
  if (level === 3) return <h3 id={id} className={className} dangerouslySetInnerHTML={{ __html: text }} />;
  return <h4 id={id} className={className} dangerouslySetInnerHTML={{ __html: text }} />;
}

// Editor.js List v2+ returns items as { content: string, items: [] } objects
// Older versions return plain strings. Handle both.
function getListItemText(item: unknown): string {
  if (typeof item === 'string') return item;
  if (item && typeof item === 'object' && 'content' in item) {
    return String((item as { content: string }).content);
  }
  return String(item);
}

function getListItemChildren(item: unknown): unknown[] {
  if (item && typeof item === 'object' && 'items' in item) {
    return (item as { items: unknown[] }).items || [];
  }
  return [];
}

function ListBlock({ items, style }: { items: unknown[]; style: string }) {
  const Tag = style === 'ordered' ? 'ol' : 'ul';
  const listClass = style === 'ordered'
    ? 'list-decimal list-inside space-y-2'
    : 'list-disc list-inside space-y-2';

  return (
    <Tag className={listClass}>
      {items.map((item, i) => {
        const text = getListItemText(item);
        const children = getListItemChildren(item);
        return (
          <li key={i} className="text-dark-text-secondary text-lg">
            <span dangerouslySetInnerHTML={{ __html: text }} />
            {children.length > 0 && (
              <ListBlock items={children} style={style} />
            )}
          </li>
        );
      })}
    </Tag>
  );
}

export default BlogContentRenderer;
