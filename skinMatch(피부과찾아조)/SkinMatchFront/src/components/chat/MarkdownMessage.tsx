import React from 'react';

interface MarkdownMessageProps {
  content: string;
}

// Very small, safe-ish Markdown → HTML renderer focused on readability.
// - Escapes HTML first to avoid XSS
// - Supports: headings, paragraphs, links, bold/italic/strike, inline code, code fences, lists, blockquotes, line breaks
// - Uses Tailwind Typography (prose) for pleasant defaults
export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  // Remove zero-width and bidi control characters to avoid invisible/overlay tricks
  const stripInvisible = (str: string) =>
    str
      // zero-width spaces and joiners
      .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '')
      // bidi control chars (LRM/RLM/LRE/RLE/PDF/LRO/RLO) and isolates
      .replace(/[\u202A-\u202E\u2066-\u2069]/g, '');
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const renderMarkdownToHtml = (md: string) => {
    if (!md) return '';

    // Normalize newlines
    let text = stripInvisible(md).replace(/\r\n?/g, '\n');
    // Escape HTML first
    text = escapeHtml(text);

    // Extract fenced code blocks to placeholders
    const codeBlocks: string[] = [];
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, lang = '', code) => {
      const idx = codeBlocks.length;
      const safeCode = code.replace(/\n$/,'');
      const block = `<pre class=\"not-prose bg-gray-900 text-gray-100 p-3 rounded-lg overflow-auto text-sm\"><code class=\"language-${lang}\">${safeCode}</code></pre>`;
      codeBlocks.push(block);
      return `[[CODEBLOCK_${idx}]]`;
    });

    // Block-level processing by lines to build lists/quotes/headings
    const lines = text.split(/\n/);
    const htmlParts: string[] = [];
    let inUl = false;
    let inOl = false;
    let inBlockquote = false;
    const olRegex = /^\s*(\d+)[\.)]\s+(.*)$/;
    // Allow common bullet symbols: -, *, •, ∙, ·, ※, ✔
    const ulRegex = /^\s*[-*•∙·※✔]\s*(.*)$/;

    const closeLists = () => {
      if (inUl) { htmlParts.push('</ul>'); inUl = false; }
      if (inOl) { htmlParts.push('</ol>'); inOl = false; }
    };
    const closeQuote = () => {
      if (inBlockquote) { htmlParts.push('</blockquote>'); inBlockquote = false; }
    };

    const pushParagraph = (line: string) => {
      // Inline formatting within paragraph
      let l = line;
      // Special: bracketed source with trailing URL, e.g. [출처: 제목 - https://...]
      // Convert only the URL part to a hyperlink while keeping brackets/content
      l = l.replace(/\[(.*?-\s*)(https?:\/\/[^\s\]]+)\]/g, (_m, prefix, url) => {
        const a = `<a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"underline decoration-gray-300 text-black hover:text-gray-700 break-all\">${url}</a>`;
        return `[${prefix}${a}]`;
      });

      // Links (black styled, force wrapping for long tokens) — support http(s) and file://
      l = l.replace(/\[([^\]]+)\]\(((?:https?:|file:)\/\/[^\s)]+)\)/g, '<a href=\"$2\" target=\"_blank\" rel=\"noopener noreferrer nofollow\" class=\"underline decoration-gray-300 text-black hover:text-gray-700 break-all\">$1</a>');
      // Inline code (allow breaking for long paths/tokens)
      l = l.replace(/`([^`]+)`/g, '<code class=\"bg-gray-100 text-gray-900 px-1 py-0.5 rounded break-all\">$1</code>');
      // Bold
      l = l.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      // Strike
      l = l.replace(/~~([^~]+)~~/g, '<del>$1</del>');
      // Italic (basic)
      l = l.replace(/(^|\s)\*([^*\n]+)\*(?=\s|$)/g, '$1<em>$2</em>');
      htmlParts.push(`<p>${l}</p>`);
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '') {
        // 빈 줄이어도 다음 줄이 같은 리스트라면 리스트를 닫지 않음 (번호가 1로만 보이는 문제 방지)
        let nextIdx = i + 1;
        let nextLine = '';
        while (nextIdx < lines.length) {
          if (lines[nextIdx].trim() !== '') { nextLine = lines[nextIdx]; break; }
          nextIdx++;
        }
        const continuesOl = inOl && nextLine && olRegex.test(nextLine);
        const continuesUl = inUl && nextLine && ulRegex.test(nextLine);
        if (!(continuesOl || continuesUl)) {
          closeLists();
          closeQuote();
        }
        continue;
      }

      // Special: "출처" line (render as plain paragraph without list bullet)
      // Matches: "출처:", "출처 -", "*출처:", "- 출처:"
      const sourceMatch = line.match(/^\s*[-*]?\s*출처\s*[:：\-–—]?\s*(.*)$/i);
      if (sourceMatch) {
        closeLists();
        closeQuote();
        pushParagraph(`<span class=\"text-gray-600\">출처:</span> ${sourceMatch[1]}`);
        continue;
      }

      // Headings
      const heading = line.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        closeLists();
        closeQuote();
        const level = heading[1].length;
        const text = heading[2];
        htmlParts.push(`<h${level}>${text}</h${level}>`);
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        closeLists();
        if (!inBlockquote) { htmlParts.push('<blockquote class=\"border-l-2 pl-3 text-gray-700\">'); inBlockquote = true; }
        pushParagraph(line.replace(/^>\s+/, ''));
        continue;
      } else {
        closeQuote();
      }

      // Ordered list
      const ol = line.match(olRegex);
      if (ol) {
        if (!inOl) { closeLists(); htmlParts.push('<ol class=\"list-decimal ml-4 space-y-1\">'); inOl = true; }
        htmlParts.push(`<li>${ol[2]}</li>`);
        continue;
      }

      // Unordered list
      const ul = line.match(ulRegex);
      if (ul) {
        if (!inUl) { closeLists(); htmlParts.push('<ul class=\"list-disc ml-4 space-y-1\">'); inUl = true; }
        htmlParts.push(`<li>${ul[1]}</li>`);
        continue;
      }

      // Normal paragraph
      closeLists();
      pushParagraph(line);
    }

    closeLists();
    closeQuote();

    let html = htmlParts.join('\n');

    // Restore fenced code blocks
    html = html.replace(/\[\[CODEBLOCK_(\d+)\]\]/g, (_m, i) => codeBlocks[Number(i)] || '');

    return html;
  };

  const html = renderMarkdownToHtml(content);

  return (
    <div
      className="prose prose-sm max-w-none leading-relaxed break-words
                 prose-headings:mt-1 prose-headings:mb-1 prose-headings:font-medium
                 prose-h1:text-base prose-h2:text-base prose-h3:text-sm
                 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5
                 prose-a:text-black hover:prose-a:text-gray-700 prose-a:underline prose-a:decoration-gray-300 prose-a:break-all
                 prose-code:text-[0.95em] prose-code:bg-gray-200 prose-code:text-gray-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:break-all
                 prose-pre:my-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownMessage;
