import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        'prose prose-invert max-w-none',
        'prose-headings:font-bold prose-headings:text-foreground',
        'prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8',
        'prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6',
        'prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4',
        'prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-foreground prose-strong:font-bold',
        'prose-ul:list-disc prose-ul:mr-6 prose-ul:text-muted-foreground',
        'prose-ol:list-decimal prose-ol:mr-6 prose-ol:text-muted-foreground',
        'prose-li:mb-2',
        'prose-code:bg-surface-glass prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm',
        'prose-pre:bg-surface-glass prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto',
        'prose-blockquote:border-r-4 prose-blockquote:border-primary prose-blockquote:pr-4 prose-blockquote:italic',
        'prose-img:rounded-lg prose-img:shadow-lg',
        'prose-table:border prose-table:border-white/10',
        'prose-th:border prose-th:border-white/10 prose-th:p-2 prose-th:bg-surface-glass',
        'prose-td:border prose-td:border-white/10 prose-td:p-2',
        '[&>*:first-child]:mt-0',
        className
      )}
      dir="rtl"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Extract headings from markdown content for TOC
export function extractHeadings(markdown: string): Array<{ level: number; text: string; id: string }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; id: string }> = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '') // Keep Arabic/Persian, English, numbers, spaces, and hyphens
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    headings.push({ level, text, id });
  }

  return headings;
}

