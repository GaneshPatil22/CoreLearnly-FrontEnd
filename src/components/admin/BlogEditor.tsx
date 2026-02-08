import { useEffect, useRef, useCallback } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import CodeTool from '@editorjs/code';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import Marker from '@editorjs/marker';
import type { EditorJSData } from '../../types';

interface BlogEditorProps {
  initialData?: EditorJSData;
  onReady?: () => void;
  onUploadImage: (file: File) => Promise<{ url: string | null; error: string | null }>;
  editorRef: React.MutableRefObject<EditorJS | null>;
}

const BlogEditor = ({ initialData, onReady, onUploadImage, editorRef }: BlogEditorProps) => {
  const holderRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  const initEditor = useCallback(() => {
    if (!holderRef.current || isInitialized.current) return;
    isInitialized.current = true;

    const editor = new EditorJS({
      holder: holderRef.current,
      placeholder: 'Start writing your blog post...',
      data: initialData || { blocks: [] },
      tools: {
        header: {
          class: Header,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 2,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                const result = await onUploadImage(file);
                if (result.url) {
                  return { success: 1, file: { url: result.url } };
                }
                return { success: 0, file: { url: '' } };
              },
            },
          },
        },
        code: CodeTool,
        quote: {
          class: Quote,
          inlineToolbar: true,
        },
        delimiter: Delimiter,
        inlineCode: InlineCode,
        marker: Marker,
      },
      onReady: () => {
        onReady?.();
      },
    });

    editorRef.current = editor;
  }, [initialData, onUploadImage, onReady, editorRef]);

  useEffect(() => {
    initEditor();

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
        editorRef.current = null;
        isInitialized.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="blog-editor-wrapper">
      <div
        ref={holderRef}
        className="min-h-[400px] bg-dark-bg border border-dark-border rounded-lg p-4"
      />
    </div>
  );
};

export default BlogEditor;
