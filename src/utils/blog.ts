import type { BlogContent, EditorJSData, TiptapNode } from '../types';
import { isEditorJSContent, isTiptapContent } from './blogContent';

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calculateReadTime(content: BlogContent): number {
  if (isEditorJSContent(content)) {
    return calculateReadTimeEditorJS(content);
  }
  if (isTiptapContent(content)) {
    return calculateReadTimeTiptap(content.content);
  }
  return 1;
}

function calculateReadTimeEditorJS(content: EditorJSData): number {
  let wordCount = 0;
  let imageCount = 0;
  let codeBlockCount = 0;

  for (const block of content.blocks) {
    switch (block.type) {
      case 'paragraph':
      case 'header':
      case 'quote': {
        const text = String(block.data.text || '').replace(/<[^>]*>/g, '');
        wordCount += text.split(/\s+/).filter(Boolean).length;
        break;
      }
      case 'list': {
        const items = (block.data.items as unknown[]) || [];
        for (const item of items) {
          const raw = typeof item === 'string'
            ? item
            : (item && typeof item === 'object' && 'content' in item)
              ? String((item as { content: string }).content)
              : String(item);
          const text = raw.replace(/<[^>]*>/g, '');
          wordCount += text.split(/\s+/).filter(Boolean).length;
        }
        break;
      }
      case 'code':
        codeBlockCount++;
        break;
      case 'image':
        imageCount++;
        break;
    }
  }

  const minutes = wordCount / 200 + (imageCount * 10) / 60 + (codeBlockCount * 30) / 60;
  return Math.max(1, Math.round(minutes));
}

function calculateReadTimeTiptap(nodes: TiptapNode[]): number {
  let wordCount = 0;
  let imageCount = 0;
  let codeBlockCount = 0;

  function walk(nodeList: TiptapNode[]) {
    for (const node of nodeList) {
      if (node.type === 'image') {
        imageCount++;
      } else if (node.type === 'codeBlock') {
        codeBlockCount++;
      } else if (node.text) {
        wordCount += node.text.split(/\s+/).filter(Boolean).length;
      }
      if (node.content) {
        walk(node.content);
      }
    }
  }

  walk(nodes);
  const minutes = wordCount / 200 + (imageCount * 10) / 60 + (codeBlockCount * 30) / 60;
  return Math.max(1, Math.round(minutes));
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractTableOfContents(content: BlogContent): TocItem[] {
  if (isEditorJSContent(content)) {
    return content.blocks
      .filter((block) => block.type === 'header')
      .map((block) => {
        const text = String(block.data.text || '').replace(/<[^>]*>/g, '');
        const level = (block.data.level as number) || 2;
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        return { id, text, level };
      });
  }

  if (isTiptapContent(content)) {
    const items: TocItem[] = [];
    function walk(nodes: TiptapNode[]) {
      for (const node of nodes) {
        if (node.type === 'heading') {
          const text = getPlainText([node]);
          const level = (node.attrs?.level as number) || 2;
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
          items.push({ id, text, level });
        }
        if (node.content) {
          walk(node.content);
        }
      }
    }
    walk(content.content);
    return items;
  }

  return [];
}

export function getPlainText(nodes: TiptapNode[]): string {
  let text = '';
  for (const node of nodes) {
    if (node.text) text += node.text;
    if (node.content) text += getPlainText(node.content);
  }
  return text;
}

export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
