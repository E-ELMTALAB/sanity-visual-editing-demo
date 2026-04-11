import React from 'react';

// Enhanced Markdown Renderer with heading IDs for table of contents
const EnhancedMarkdownRenderer = ({ content }) => {
  // Ensure content is a string
  if (!content || typeof content !== 'string') {
    return null;
  }

  // Trim whitespace and check if empty
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    return null;
  }

  // Helper to parse inline markdown like **bold**, *italic*, `code`, [links], and images
  const renderInlineMarkdown = (text) => {
    if (!text || typeof text !== 'string') return '';
    
    // Split text by markdown delimiters, keeping the delimiters
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\)|!\[.*?\]\(.*?\))/g);

    return parts.filter(Boolean).map((part, index) => {
      // Bold text: **text**
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      // Italic text: *text*
      if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        return <em key={index} className="italic text-gray-200">{part.slice(1, -1)}</em>;
      }
      // Inline code: `code`
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="bg-gray-800 text-green-400 px-2 py-1 rounded text-sm font-mono">{part.slice(1, -1)}</code>;
      }
      // Links: [text](url)
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          const [, linkText, url] = match;
          return (
            <a 
              key={index} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-electric-blue hover:text-amber-400 underline transition-colors"
            >
              {linkText}
            </a>
          );
        }
      }
      // Images: ![alt](url)
      if (part.startsWith('![') && part.includes('](') && part.endsWith(')')) {
        const match = part.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
          const [, altText, imageUrl] = match;
          return (
            <img 
              key={index} 
              src={imageUrl} 
              alt={altText} 
              className="max-w-full h-auto rounded-lg shadow-lg my-4"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                console.warn(`Failed to load inline image: ${imageUrl}`);
              }}
            />
          );
        }
      }
      return part; // Return plain text part
    });
  };

  // Generate heading ID from text
  const generateHeadingId = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Process content into blocks
  const blocks = [];
  const lines = trimmedContent.split('\n');
  let currentList = [];
  let currentOrderedList = [];
  let currentCodeBlock = [];
  let inCodeBlock = false;
  let inTable = false;
  let tableRows = [];
  let tableHeaders = [];
  const existingIds = new Set();

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: 'ul', items: [...currentList] });
      currentList = [];
    }
    if (currentOrderedList.length > 0) {
      blocks.push({ type: 'ol', items: [...currentOrderedList] });
      currentOrderedList = [];
    }
  };

  const flushCodeBlock = () => {
    if (currentCodeBlock.length > 0) {
      blocks.push({ type: 'code', content: currentCodeBlock.join('\n') });
      currentCodeBlock = [];
      inCodeBlock = false;
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      blocks.push({ type: 'table', headers: tableHeaders, rows: [...tableRows] });
      tableRows = [];
      tableHeaders = [];
      inTable = false;
    }
  };

  lines.forEach((line, index) => {
    // Handle code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        flushList();
        flushTable();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      currentCodeBlock.push(line);
      return;
    }

    // Handle tables
    if (line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (!inTable) {
        flushList();
        inTable = true;
        // Parse headers
        tableHeaders = line.split('|').slice(1, -1).map(cell => cell.trim());
      } else {
        // Parse data rows
        const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
        if (cells.length === tableHeaders.length) {
          tableRows.push(cells);
        }
      }
      return;
    }

    if (inTable) {
      flushTable();
    }

    // Handle headings with IDs
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const level = headingMatch[1].length;
      let text = headingMatch[2].trim();
      // Remove markdown formatting from text for ID generation
      const cleanText = text.replace(/\*\*|__|\*|_|`/g, '').trim();
      // Generate ID from text (slugify)
      let baseId = cleanText
        .toLowerCase()
        .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // Ensure uniqueness
      let uniqueId = baseId;
      let counter = 1;
      while (existingIds.has(uniqueId)) {
        uniqueId = `${baseId}-${counter}`;
        counter++;
      }
      existingIds.add(uniqueId);
      
      blocks.push({ 
        type: 'heading', 
        level, 
        text, 
        id: uniqueId,
        className: level === 1 ? 'text-3xl font-bold text-white mb-6 mt-8' :
                   level === 2 ? 'text-2xl font-bold text-white mb-4 mt-6' :
                   level === 3 ? 'text-xl font-semibold text-white mb-3 mt-5' :
                   level === 4 ? 'text-lg font-semibold text-gray-200 mb-2 mt-4' :
                   'text-base font-medium text-gray-200 mb-2 mt-3'
      });
      return;
    }

    // Handle horizontal rules
    if (line.match(/^[-*_]{3,}$/)) {
      flushList();
      blocks.push({ type: 'hr' });
      return;
    }

    // Handle blockquotes
    if (line.startsWith('> ')) {
      flushList();
      const quoteText = line.substring(2);
      blocks.push({ type: 'blockquote', text: quoteText });
      return;
    }

    // Handle unordered lists
    if (line.match(/^[-*+]\s+/)) {
      flushCodeBlock();
      const itemText = line.replace(/^[-*+]\s+/, '');
      currentList.push(itemText);
      return;
    }

    // Handle ordered lists
    if (line.match(/^\d+\.\s+/)) {
      flushCodeBlock();
      const itemText = line.replace(/^\d+\.\s+/, '');
      currentOrderedList.push(itemText);
      return;
    }

    // Handle regular paragraphs
    if (line.trim()) {
      flushList();
      flushCodeBlock();
      blocks.push({ type: 'paragraph', text: line });
    }
  });

  // Flush any remaining content
  flushList();
  flushCodeBlock();
  flushTable();

  // Render blocks
  return (
    <div className="prose prose-invert max-w-none" dir="rtl">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            const HeadingTag = `h${block.level}`;
            return (
              <HeadingTag
                key={index}
                id={block.id}
                className={`${block.className} scroll-mt-[100px]`}
              >
                {renderInlineMarkdown(block.text)}
              </HeadingTag>
            );

          case 'paragraph':
            return (
              <p key={index} className="text-gray-300 leading-relaxed mb-4 text-right" dir="rtl">
                {renderInlineMarkdown(block.text)}
              </p>
            );

          case 'ul':
            return (
              <ul key={index} className="list-disc list-inside text-gray-300 mb-4 space-y-1 text-right" dir="rtl">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="leading-relaxed">
                    {renderInlineMarkdown(item)}
                  </li>
                ))}
              </ul>
            );

          case 'ol':
            return (
              <ol key={index} className="list-decimal list-inside text-gray-300 mb-4 space-y-1 text-right" dir="rtl">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="leading-relaxed">
                    {renderInlineMarkdown(item)}
                  </li>
                ))}
              </ol>
            );

          case 'code':
            return (
              <pre key={index} className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
                <code>{block.content}</code>
              </pre>
            );

          case 'blockquote':
            return (
              <blockquote key={index} className="border-r-4 border-electric-blue bg-gray-800 p-4 rounded-lg mb-4 italic text-gray-200 text-right" dir="rtl">
                {renderInlineMarkdown(block.text)}
              </blockquote>
            );

          case 'hr':
            return <hr key={index} className="border-gray-700 my-6" />;

          case 'table':
            return (
              <div key={index} className="overflow-x-auto mb-6">
                <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                  <thead>
                    <tr>
                      {block.headers.map((header, headerIndex) => (
                        <th key={headerIndex} className="px-4 py-3 text-right text-white font-semibold border-b border-gray-700">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3 text-gray-300 border-b border-gray-700">
                            {renderInlineMarkdown(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default EnhancedMarkdownRenderer; 