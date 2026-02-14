import { createElement } from 'react';
import { common, createLowlight } from 'lowlight';
import type { TiptapDoc, TiptapNode, TiptapMark } from '../../types';

const lowlight = createLowlight(common);

interface TiptapContentRendererProps {
  content: TiptapDoc;
}

const TiptapContentRenderer = ({ content }: TiptapContentRendererProps) => {
  return (
    <div className="blog-content space-y-6 max-w-prose">
      {content.content.map((node, i) => (
        <RenderNode key={i} node={node} />
      ))}
    </div>
  );
};

function RenderNode({ node }: { node: TiptapNode }) {
  switch (node.type) {
    case 'heading':
      return <HeadingNode node={node} />;

    case 'paragraph':
      return (
        <p className="text-dark-text-secondary leading-[1.8] text-lg">
          <InlineContent content={node.content} />
        </p>
      );

    case 'bulletList':
      return (
        <ul className="list-disc list-inside space-y-2">
          {node.content?.map((item, i) => (
            <ListItemNode key={i} node={item} style="unordered" />
          ))}
        </ul>
      );

    case 'orderedList':
      return (
        <ol className="list-decimal list-inside space-y-2">
          {node.content?.map((item, i) => (
            <ListItemNode key={i} node={item} style="ordered" />
          ))}
        </ol>
      );

    case 'listItem':
      return <ListItemNode node={node} style="unordered" />;

    case 'codeBlock': {
      const code = getPlainTextFromNode(node);
      const language = (node.attrs?.language as string) || null;
      return <HighlightedCodeBlock code={code} language={language} />;
    }

    case 'blockquote':
      return (
        <blockquote className="border-l-4 border-primary pl-4 py-2">
          {node.content?.map((child, i) => (
            <RenderNode key={i} node={child} />
          ))}
        </blockquote>
      );

    case 'horizontalRule':
      return <hr className="border-none border-t border-dark-border my-6" />;

    case 'table':
      return (
        <div className="overflow-x-auto my-6">
          <table className="w-full border-collapse border border-dark-border">
            <tbody>
              {node.content?.map((row, i) => (
                <RenderTableRow key={i} node={row} isFirst={i === 0} />
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'image': {
      const src = node.attrs?.src as string;
      const alt = (node.attrs?.alt as string) || '';
      return (
        <figure className="my-8">
          <img src={src} alt={alt} className="w-full rounded-lg" />
          {alt && (
            <figcaption className="text-dark-text-muted text-sm text-center mt-2">
              {alt}
            </figcaption>
          )}
        </figure>
      );
    }

    default:
      return null;
  }
}

// Syntax-highlighted code block using lowlight (same as editor)
function HighlightedCodeBlock({ code, language }: { code: string; language: string | null }) {
  let highlighted: React.ReactNode;
  try {
    const tree = language
      ? lowlight.highlight(language, code)
      : lowlight.highlightAuto(code);
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

// Convert hast (HTML AST) nodes from lowlight into React elements
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

function HeadingNode({ node }: { node: TiptapNode }) {
  const level = (node.attrs?.level as number) || 2;
  const text = getPlainTextFromNode(node);
  const id = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  const className = {
    2: 'text-3xl font-bold text-white mt-12 mb-4',
    3: 'text-2xl font-semibold text-white mt-8 mb-3',
    4: 'text-xl font-semibold text-white mt-6 mb-2',
  }[level] || 'text-xl font-semibold text-white mt-6 mb-2';

  const Tag = `h${level}` as 'h2' | 'h3' | 'h4';
  return (
    <Tag id={id} className={className}>
      <InlineContent content={node.content} />
    </Tag>
  );
}

function ListItemNode({ node, style }: { node: TiptapNode; style: string }) {
  const paragraphs: TiptapNode[] = [];
  const nestedLists: TiptapNode[] = [];

  for (const child of node.content || []) {
    if (child.type === 'bulletList' || child.type === 'orderedList') {
      nestedLists.push(child);
    } else {
      paragraphs.push(child);
    }
  }

  return (
    <li className="text-dark-text-secondary text-lg">
      {paragraphs.map((p, i) => (
        <span key={i}>
          <InlineContent content={p.content} />
        </span>
      ))}
      {nestedLists.map((list, i) => (
        <RenderNode key={`nested-${i}`} node={{ ...list, type: style === 'ordered' ? 'orderedList' : list.type }} />
      ))}
    </li>
  );
}

function RenderTableRow({ node, isFirst }: { node: TiptapNode; isFirst: boolean }) {
  return (
    <tr>
      {node.content?.map((cell, i) => {
        const CellTag = isFirst || cell.type === 'tableHeader' ? 'th' : 'td';
        return (
          <CellTag
            key={i}
            className={`border border-dark-border p-3 text-left ${
              isFirst || cell.type === 'tableHeader'
                ? 'bg-dark-card font-semibold text-white'
                : 'text-dark-text-secondary'
            }`}
          >
            {cell.content?.map((child, j) => (
              <RenderNode key={j} node={child} />
            ))}
          </CellTag>
        );
      })}
    </tr>
  );
}

function InlineContent({ content }: { content?: TiptapNode[] }) {
  if (!content) return null;

  return (
    <>
      {content.map((node, i) => {
        if (node.type === 'text') {
          return <TextWithMarks key={i} text={node.text || ''} marks={node.marks} />;
        }
        if (node.type === 'hardBreak') {
          return <br key={i} />;
        }
        return null;
      })}
    </>
  );
}

function TextWithMarks({ text, marks }: { text: string; marks?: TiptapMark[] }) {
  if (!marks || marks.length === 0) return <>{text}</>;

  let result: React.ReactNode = text;

  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':
        result = <strong>{result}</strong>;
        break;
      case 'italic':
        result = <em>{result}</em>;
        break;
      case 'code':
        result = <code>{result}</code>;
        break;
      case 'highlight':
        result = <mark>{result}</mark>;
        break;
      case 'strike':
        result = <s>{result}</s>;
        break;
      case 'link': {
        const href = mark.attrs?.href as string;
        result = (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {result}
          </a>
        );
        break;
      }
    }
  }

  return <>{result}</>;
}

function getPlainTextFromNode(node: TiptapNode): string {
  if (node.text) return node.text;
  if (!node.content) return '';
  return node.content.map(getPlainTextFromNode).join('');
}

export default TiptapContentRenderer;
