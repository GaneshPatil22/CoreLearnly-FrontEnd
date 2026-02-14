import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import TiptapToolbar from './TiptapToolbar';
import type { TiptapDoc } from '../../types';

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  initialContent?: TiptapDoc;
  onReady?: () => void;
  onUploadImage: (file: File) => Promise<{ url: string | null; error: string | null }>;
  editorRef: React.MutableRefObject<Editor | null>;
}

const TiptapEditor = ({ initialContent, onReady, onUploadImage, editorRef }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Image,
      Placeholder.configure({ placeholder: 'Start writing your blog post...' }),
      Highlight,
      Link.configure({ openOnClick: false }),
    ],
    content: initialContent || { type: 'doc', content: [{ type: 'paragraph' }] },
    editorProps: {
      attributes: {
        class: 'prose-dark min-h-[400px] outline-none p-4',
      },
    },
    onCreate: () => {
      onReady?.();
    },
  });

  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
    return () => {
      editorRef.current = null;
    };
  }, [editor, editorRef]);

  if (!editor) return null;

  return (
    <div className="blog-editor-wrapper border border-dark-border rounded-lg bg-dark-bg overflow-hidden">
      <TiptapToolbar editor={editor} onUploadImage={onUploadImage} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
