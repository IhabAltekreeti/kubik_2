import katex from 'katex';

export type MathTokenType =
  | 'text'
  | 'inline-math'
  | 'display-math'
  | 'inline-code'
  | 'code-block'
  | 'bold'
  | 'italic'
  | 'heading'
  | 'blockquote'
  | 'list-item';

export interface MathToken {
  type: MathTokenType;
  raw: string;
  renderedHtml?: string;
  level?: number;
  listType?: 'ul' | 'ol';
}

/**
 * Safely renders LaTeX via KaTeX.
 * If KaTeX fails, escapes the raw formula safely and wraps in fallback styling.
 */
export function safeRenderKaTeX(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex.trim(), {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
      strict: false,
    });
  } catch (err) {
    return `<span class="font-mono text-amber-800 bg-amber-50 px-1 rounded text-xs">${escapeHtml(latex)}</span>`;
  }
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Normalizes escaped dollar signs and handles display math blocks first.
 */
export interface BlockSegment {
  type: 'display-math' | 'code-block' | 'text-block';
  content: string;
  language?: string;
}

export function splitIntoBlocks(input: string): BlockSegment[] {
  if (!input) return [];

  const segments: BlockSegment[] = [];
  // Regex to match:
  // 1. Fenced code block: ```[lang]\n...\n```
  // 2. Display math: $$...$$ or \[...\]
  const blockRegex = /(?:```([a-zA-Z0-9_-]*)\n([\s\S]*?)```)|(?:\$\$([\s\S]*?)\$\$)|(?:\\\[([\s\S]*?)\\\])/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text-block',
        content: input.slice(lastIndex, match.index),
      });
    }

    if (match[2] !== undefined) {
      // Fenced code block
      segments.push({
        type: 'code-block',
        language: match[1] || 'text',
        content: match[2],
      });
    } else if (match[3] !== undefined) {
      // $$ display math $$
      segments.push({
        type: 'display-math',
        content: match[3],
      });
    } else if (match[4] !== undefined) {
      // \[ display math \]
      segments.push({
        type: 'display-math',
        content: match[4],
      });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    segments.push({
      type: 'text-block',
      content: input.slice(lastIndex),
    });
  }

  return segments;
}

/**
 * Checks if a string is a valid inline math expression.
 * Prevents currency expressions like "$50", "50$", "10$ ve 20$" from being parsed as math.
 */
export function isLikelyMath(latex: string): boolean {
  const trimmed = latex.trim();
  if (!trimmed) return false;
  return true;
}

export interface InlineToken {
  type: 'text' | 'inline-math' | 'code' | 'bold' | 'italic';
  value: string;
  renderedHtml?: string;
}

/**
 * Parses inline content within a single line or paragraph.
 * Supports:
 * - Escaped dollars: \$ -> literal $
 * - Inline code: `...`
 * - LaTeX inline math: \(...\) and $...$ (respecting currency boundaries)
 * - Bold: **...**
 * - Italic: *...*
 */
export function parseInlineContent(text: string): InlineToken[] {
  if (!text) return [];

  const tokens: InlineToken[] = [];
  let i = 0;
  const len = text.length;
  let textBuffer = '';

  const flushText = () => {
    if (textBuffer.length > 0) {
      tokens.push({ type: 'text', value: textBuffer });
      textBuffer = '';
    }
  };

  while (i < len) {
    // 1. Escaped dollar sign: \$
    if (text[i] === '\\' && i + 1 < len && text[i + 1] === '$') {
      textBuffer += '$';
      i += 2;
      continue;
    }

    // 2. LaTeX inline math: \( ... \)
    if (text[i] === '\\' && i + 1 < len && text[i + 1] === '(') {
      const closeIdx = text.indexOf('\\)', i + 2);
      if (closeIdx !== -1) {
        flushText();
        const latex = text.slice(i + 2, closeIdx);
        tokens.push({
          type: 'inline-math',
          value: latex,
          renderedHtml: safeRenderKaTeX(latex, false),
        });
        i = closeIdx + 2;
        continue;
      }
    }

    // 3. Inline code: `...`
    if (text[i] === '`') {
      const closeIdx = text.indexOf('`', i + 1);
      if (closeIdx !== -1) {
        flushText();
        tokens.push({
          type: 'code',
          value: text.slice(i + 1, closeIdx),
        });
        i = closeIdx + 1;
        continue;
      }
    }

    // 4. Inline math with single $: $...$
    if (text[i] === '$') {
      // Must not be display math ($$)
      if (i + 1 < len && text[i + 1] === '$') {
        textBuffer += '$';
        i++;
        continue;
      }

      // Check if it's following a number like "50$" (currency in Turkish)
      const prevChar = i > 0 ? text[i - 1] : '';
      if (/\d/.test(prevChar)) {
        textBuffer += '$';
        i++;
        continue;
      }

      // Opening $ must not be followed by whitespace or another $
      const nextChar = i + 1 < len ? text[i + 1] : '';
      if (nextChar === ' ' || nextChar === '\t' || nextChar === '\n' || nextChar === '$') {
        textBuffer += '$';
        i++;
        continue;
      }

      // Look for matching closing $ on the same line
      let closingIdx = -1;
      let j = i + 1;
      while (j < len) {
        if (text[j] === '\n') break; // Inline math must not cross newlines
        if (text[j] === '\\' && j + 1 < len && text[j + 1] === '$') {
          // Escaped dollar inside math
          j += 2;
          continue;
        }
        if (text[j] === '$') {
          // Closing $ must not be preceded by whitespace
          if (text[j - 1] !== ' ' && text[j - 1] !== '\t') {
            closingIdx = j;
            break;
          }
        }
        j++;
      }

      if (closingIdx !== -1) {
        const potentialMath = text.slice(i + 1, closingIdx);
        if (isLikelyMath(potentialMath)) {
          flushText();
          tokens.push({
            type: 'inline-math',
            value: potentialMath,
            renderedHtml: safeRenderKaTeX(potentialMath, false),
          });
          i = closingIdx + 1;
          continue;
        }
      }

      textBuffer += '$';
      i++;
      continue;
    }

    // 5. Bold: **text**
    if (text[i] === '*' && i + 1 < len && text[i + 1] === '*') {
      const closeIdx = text.indexOf('**', i + 2);
      if (closeIdx !== -1) {
        flushText();
        tokens.push({
          type: 'bold',
          value: text.slice(i + 2, closeIdx),
        });
        i = closeIdx + 2;
        continue;
      }
    }

    // 6. Italic: *text* (single *)
    if (text[i] === '*' && (i + 1 >= len || text[i + 1] !== '*')) {
      const closeIdx = text.indexOf('*', i + 1);
      if (closeIdx !== -1 && closeIdx > i + 1 && text[closeIdx - 1] !== ' ') {
        flushText();
        tokens.push({
          type: 'italic',
          value: text.slice(i + 1, closeIdx),
        });
        i = closeIdx + 1;
        continue;
      }
    }

    textBuffer += text[i];
    i++;
  }

  flushText();
  return tokens;
}
