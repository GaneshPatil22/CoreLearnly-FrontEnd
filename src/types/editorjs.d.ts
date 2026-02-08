declare module '@editorjs/editorjs' {
  interface BlockToolConstructable {
    new (config: unknown): unknown;
  }

  interface EditorConfig {
    holder?: HTMLElement | string;
    placeholder?: string;
    data?: unknown;
    tools?: Record<string, unknown>;
    onReady?: () => void;
  }

  export default class EditorJS {
    constructor(config: EditorConfig);
    save(): Promise<unknown>;
    destroy(): void;
    isReady: Promise<void>;
    static BlockToolConstructable: BlockToolConstructable;
  }
}

declare module '@editorjs/header' {
  const Header: unknown;
  export default Header;
}

declare module '@editorjs/list' {
  const List: unknown;
  export default List;
}

declare module '@editorjs/image' {
  const ImageTool: unknown;
  export default ImageTool;
}

declare module '@editorjs/code' {
  const CodeTool: unknown;
  export default CodeTool;
}

declare module '@editorjs/quote' {
  const Quote: unknown;
  export default Quote;
}

declare module '@editorjs/delimiter' {
  const Delimiter: unknown;
  export default Delimiter;
}

declare module '@editorjs/inline-code' {
  const InlineCode: unknown;
  export default InlineCode;
}

declare module '@editorjs/marker' {
  const Marker: unknown;
  export default Marker;
}
