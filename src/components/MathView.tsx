import React, { useMemo } from 'react';
import {
  splitIntoBlocks,
  parseInlineContent,
  safeRenderKaTeX,
  InlineToken,
} from '../utils/mathParser';

interface MathViewProps {
  content: string;
  className?: string;
  as?: 'div' | 'span';
}

function renderInlineTokens(tokens: InlineToken[], keyPrefix: string): React.ReactNode[] {
  return tokens.map((token, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (token.type === 'inline-math' && token.renderedHtml) {
      return (
        <span
          key={key}
          className="inline-math px-0.5 select-text"
          dangerouslySetInnerHTML={{ __html: token.renderedHtml }}
        />
      );
    }
    if (token.type === 'bold') {
      return (
        <strong key={key} className="font-semibold text-slate-900">
          {token.value}
        </strong>
      );
    }
    if (token.type === 'italic') {
      return (
        <em key={key} className="italic text-slate-800">
          {token.value}
        </em>
      );
    }
    if (token.type === 'code') {
      return (
        <code
          key={key}
          className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs text-indigo-700 border border-slate-200"
        >
          {token.value}
        </code>
      );
    }
    return <React.Fragment key={key}>{token.value}</React.Fragment>;
  });
}

export const MathView: React.FC<MathViewProps> = ({ content, className = '', as = 'div' }) => {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    const blocks = splitIntoBlocks(content);

    return blocks.map((block, bIdx) => {
      // 1. Display Math Block
      if (block.type === 'display-math') {
        const html = safeRenderKaTeX(block.content, true);
        if (as === 'span') {
          return (
            <span
              key={`dm-${bIdx}`}
              className="block my-2 py-1 px-2 overflow-x-auto text-center"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
        return (
          <div
            key={`dm-${bIdx}`}
            className="my-3 py-2 px-3 overflow-x-auto bg-slate-50/80 rounded-xl border border-slate-200/70 text-center shadow-2xs"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }

      // 2. Fenced Code Block
      if (block.type === 'code-block') {
        return (
          <pre
            key={`cb-${bIdx}`}
            className="my-3 p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800"
          >
            <code>{block.content}</code>
          </pre>
        );
      }

      // 3. Regular Text Block (Process lines)
      const rawLines = block.content.split('\n');
      const renderedLines: React.ReactNode[] = [];

      let inList = false;
      let listItems: React.ReactNode[] = [];
      let listType: 'ul' | 'ol' = 'ul';

      const flushList = () => {
        if (inList && listItems.length > 0) {
          if (listType === 'ol') {
            renderedLines.push(
              <ol
                key={`ol-${renderedLines.length}`}
                className="my-2 ml-5 list-decimal space-y-1.5 text-slate-800"
              >
                {listItems}
              </ol>
            );
          } else {
            renderedLines.push(
              <ul
                key={`ul-${renderedLines.length}`}
                className="my-2 ml-5 list-disc space-y-1 text-slate-800"
              >
                {listItems}
              </ul>
            );
          }
          listItems = [];
          inList = false;
        }
      };

      rawLines.forEach((line, lIdx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          flushList();
          renderedLines.push(<div key={`sp-${lIdx}`} className="h-1.5" />);
          return;
        }

        // Horizontal rule: ---
        if (/^---+$/.test(trimmed)) {
          flushList();
          renderedLines.push(<hr key={`hr-${lIdx}`} className="my-3 border-slate-200" />);
          return;
        }

        // Heading 3: ###
        if (trimmed.startsWith('### ')) {
          flushList();
          const tokens = parseInlineContent(trimmed.slice(4));
          renderedLines.push(
            <h4 key={`h3-${lIdx}`} className="font-semibold text-slate-900 text-base mt-3 mb-1">
              {renderInlineTokens(tokens, `h3-${lIdx}`)}
            </h4>
          );
          return;
        }

        // Heading 2: ##
        if (trimmed.startsWith('## ')) {
          flushList();
          const tokens = parseInlineContent(trimmed.slice(3));
          renderedLines.push(
            <h3
              key={`h2-${lIdx}`}
              className="font-bold text-slate-900 text-lg mt-3.5 mb-1.5 border-b border-slate-100 pb-1"
            >
              {renderInlineTokens(tokens, `h2-${lIdx}`)}
            </h3>
          );
          return;
        }

        // Heading 1: #
        if (trimmed.startsWith('# ')) {
          flushList();
          const tokens = parseInlineContent(trimmed.slice(2));
          renderedLines.push(
            <h2
              key={`h1-${lIdx}`}
              className="font-bold text-slate-900 text-xl mt-4 mb-2 border-b border-slate-200 pb-1"
            >
              {renderInlineTokens(tokens, `h1-${lIdx}`)}
            </h2>
          );
          return;
        }

        // Unordered list item: - item or * item
        if (/^[-*]\s+/.test(trimmed)) {
          if (!inList || listType !== 'ul') {
            flushList();
            inList = true;
            listType = 'ul';
          }
          const itemText = trimmed.replace(/^[-*]\s+/, '');
          const tokens = parseInlineContent(itemText);
          listItems.push(
            <li key={`li-${lIdx}`} className="pl-1 leading-relaxed">
              {renderInlineTokens(tokens, `li-${lIdx}`)}
            </li>
          );
          return;
        }

        // Ordered list item: 1. item
        if (/^\d+\.\s+/.test(trimmed)) {
          if (!inList || listType !== 'ol') {
            flushList();
            inList = true;
            listType = 'ol';
          }
          const itemText = trimmed.replace(/^\d+\.\s+/, '');
          const tokens = parseInlineContent(itemText);
          listItems.push(
            <li key={`li-${lIdx}`} className="pl-1 leading-relaxed">
              {renderInlineTokens(tokens, `li-${lIdx}`)}
            </li>
          );
          return;
        }

        // Blockquote: > text
        if (trimmed.startsWith('> ')) {
          flushList();
          const tokens = parseInlineContent(trimmed.slice(2));
          renderedLines.push(
            <div
              key={`bq-${lIdx}`}
              className="my-2 border-l-4 border-indigo-500 bg-indigo-50/60 px-3.5 py-2 rounded-r-xl text-slate-700 italic text-xs leading-relaxed"
            >
              {renderInlineTokens(tokens, `bq-${lIdx}`)}
            </div>
          );
          return;
        }

        // Regular paragraph line
        flushList();
        const tokens = parseInlineContent(line);
        if (as === 'span') {
          renderedLines.push(
            <span key={`p-${lIdx}`} className="leading-relaxed inline">
              {renderInlineTokens(tokens, `p-${lIdx}`)}
            </span>
          );
        } else {
          renderedLines.push(
            <p key={`p-${lIdx}`} className="leading-relaxed my-1">
              {renderInlineTokens(tokens, `p-${lIdx}`)}
            </p>
          );
        }
      });

      flushList();

      if (as === 'span') {
        return <span key={`tb-${bIdx}`}>{renderedLines}</span>;
      }
      return <div key={`tb-${bIdx}`}>{renderedLines}</div>;
    });
  }, [content, as]);

  if (as === 'span') {
    return <span className={`math-rendered ${className}`}>{renderedElements}</span>;
  }

  return <div className={`math-rendered ${className || 'text-slate-800'}`}>{renderedElements}</div>;
};

export default MathView;
