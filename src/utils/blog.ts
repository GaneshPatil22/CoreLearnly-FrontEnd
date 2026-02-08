import type { EditorJSData } from '../types';

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calculateReadTime(content: EditorJSData): number {
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
          // Handle both string items and { content: string, items: [] } objects
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

  // 200 words per minute + 10s per image + 30s per code block
  const minutes = wordCount / 200 + (imageCount * 10) / 60 + (codeBlockCount * 30) / 60;
  return Math.max(1, Math.round(minutes));
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractTableOfContents(content: EditorJSData): TocItem[] {
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

export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
