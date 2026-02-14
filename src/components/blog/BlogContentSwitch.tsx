import { isEditorJSContent, isTiptapContent } from '../../utils/blogContent';
import BlogContentRenderer from './BlogContentRenderer';
import TiptapContentRenderer from './TiptapContentRenderer';
import type { BlogContent, EditorJSData, TiptapDoc } from '../../types';

interface BlogContentSwitchProps {
  content: BlogContent;
}

const BlogContentSwitch = ({ content }: BlogContentSwitchProps) => {
  if (isTiptapContent(content)) {
    return <TiptapContentRenderer content={content as TiptapDoc} />;
  }
  if (isEditorJSContent(content)) {
    return <BlogContentRenderer content={content as EditorJSData} />;
  }
  return null;
};

export default BlogContentSwitch;
