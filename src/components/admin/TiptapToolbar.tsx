import type { Editor } from '@tiptap/react';

interface TiptapToolbarProps {
  editor: Editor;
  onUploadImage: (file: File) => Promise<{ url: string | null; error: string | null }>;
}

const TiptapToolbar = ({ editor, onUploadImage }: TiptapToolbarProps) => {
  const btnClass = (active: boolean) =>
    `p-2 rounded text-sm transition-colors ${
      active
        ? 'text-primary bg-primary/10'
        : 'text-dark-text-secondary hover:text-white hover:bg-dark-border'
    }`;

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const result = await onUploadImage(file);
      if (result.url) {
        editor.chain().focus().setImage({ src: result.url }).run();
      }
    };
    input.click();
  };

  const handleSetLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL', previousUrl || '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  const isInTable = editor.isActive('table');

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-dark-border bg-dark-card rounded-t-lg">
      {/* Block type */}
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={btnClass(editor.isActive('paragraph') && !editor.isActive('heading'))}
        title="Paragraph"
      >
        P
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive('heading', { level: 3 }))}
        title="Heading 3"
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={btnClass(editor.isActive('heading', { level: 4 }))}
        title="Heading 4"
      >
        H4
      </button>

      <div className="w-px h-6 bg-dark-border mx-1" />

      {/* Text formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive('italic'))}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(editor.isActive('strike'))}
        title="Strikethrough"
      >
        <s>S</s>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={btnClass(editor.isActive('code'))}
        title="Inline Code"
      >
        <code>&lt;/&gt;</code>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={btnClass(editor.isActive('highlight'))}
        title="Highlight"
      >
        <span className="bg-yellow-400/40 px-0.5">H</span>
      </button>

      <div className="w-px h-6 bg-dark-border mx-1" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive('bulletList'))}
        title="Bullet List"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          <circle cx="1" cy="6" r="1" fill="currentColor" stroke="none" />
          <circle cx="1" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="1" cy="18" r="1" fill="currentColor" stroke="none" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive('orderedList'))}
        title="Ordered List"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13" />
          <text x="0" y="8" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">1</text>
          <text x="0" y="14" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">2</text>
          <text x="0" y="20" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">3</text>
        </svg>
      </button>

      <div className="w-px h-6 bg-dark-border mx-1" />

      {/* Insert */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive('blockquote'))}
        title="Blockquote"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeWidth={2} d="M3 6h4v4H3zM3 14h4v4H3zM13 6h4v4h-4zM13 14h4v4h-4z" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={btnClass(editor.isActive('codeBlock'))}
        title="Code Block"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btnClass(false)}
        title="Horizontal Rule"
      >
        ―
      </button>
      <button
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        className={btnClass(false)}
        title="Insert Table"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
          <path strokeWidth={2} d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </svg>
      </button>
      <button
        onClick={handleImageUpload}
        className={btnClass(false)}
        title="Upload Image"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
          <path strokeWidth={2} d="M21 15l-5-5L5 21" />
        </svg>
      </button>
      <button
        onClick={handleSetLink}
        className={btnClass(editor.isActive('link'))}
        title="Link"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </button>

      <div className="w-px h-6 bg-dark-border mx-1" />

      {/* History */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`${btnClass(false)} disabled:opacity-30`}
        title="Undo"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`${btnClass(false)} disabled:opacity-30`}
        title="Redo"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v2M21 10l-4-4M21 10l-4 4" />
        </svg>
      </button>

      {/* Table controls (conditional) */}
      {isInTable && (
        <>
          <div className="w-px h-6 bg-dark-border mx-1" />
          <span className="text-xs text-dark-text-muted mr-1">Table:</span>
          <button
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className={btnClass(false)}
            title="Add Row"
          >
            +Row
          </button>
          <button
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className={btnClass(false)}
            title="Add Column"
          >
            +Col
          </button>
          <button
            onClick={() => editor.chain().focus().deleteRow().run()}
            className={btnClass(false)}
            title="Delete Row"
          >
            -Row
          </button>
          <button
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className={btnClass(false)}
            title="Delete Column"
          >
            -Col
          </button>
          <button
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="p-2 rounded text-sm text-red-400 hover:bg-red-400/10 transition-colors"
            title="Delete Table"
          >
            Del Table
          </button>
        </>
      )}
    </div>
  );
};

export default TiptapToolbar;
