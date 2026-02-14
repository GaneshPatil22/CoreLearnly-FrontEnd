import type { BlogContent, EditorJSData, TiptapDoc } from '../types';

export function isEditorJSContent(content: BlogContent): content is EditorJSData {
  return 'blocks' in content && Array.isArray((content as EditorJSData).blocks);
}

export function isTiptapContent(content: BlogContent): content is TiptapDoc {
  return (content as TiptapDoc).type === 'doc' && Array.isArray((content as TiptapDoc).content);
}
