function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInline(text: string): string {
  let out = escapeHtml(text);

  out = out.replace(/`([^`]+)`/g, (_m, code) => `<code>${code}</code>`);

  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, href) => {
    const safeHref = /^(https?:\/\/|\/|#|mailto:)/i.test(href) ? href : '#';
    return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });

  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');

  return out;
}

export function renderMarkdown(source: string): string {
  if (!source) return '';

  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let inList = false;
  let inCode = false;
  let codeBuffer: string[] = [];

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');

    if (line.startsWith('```')) {
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
        codeBuffer = [];
        inCode = false;
      } else {
        closeList();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    if (line.trim() === '') {
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    if (line.startsWith('> ')) {
      closeList();
      html.push(`<blockquote>${renderInline(line.slice(2))}</blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${renderInline(line.replace(/^[-*]\s+/, ''))}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${renderInline(line)}</p>`);
  }

  if (inCode && codeBuffer.length) {
    html.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
  }

  closeList();
  return html.join('\n');
}

export function estimateReadTime(source: string, wordsPerMinute = 200): number {
  const words = (source ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

const ALLOWED_TAGS = new Set([
  'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'a', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'span', 'hr',
]);

interface ParsedTag {
  name: string;
  attrs: { name: string; value: string }[];
}

function parseTag(inner: string): ParsedTag {
  const tokens = inner.match(/[a-zA-Z-]+(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/g) ?? [];
  const name = (tokens.shift() ?? '').toLowerCase();
  const attrs = tokens.map((tok) => {
    const eq = tok.indexOf('=');
    if (eq === -1) return { name: tok.toLowerCase(), value: '' };
    const n = tok.slice(0, eq).toLowerCase();
    let v = tok.slice(eq + 1);
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    return { name: n, value: v };
  });
  return { name, attrs };
}

function sanitizeOpeningTag(tag: string): string {
  const inner = tag.slice(1, -1).trim();
  const { name, attrs } = parseTag(inner);
  const kept = attrs
    .filter((a) => {
      if (a.name.startsWith('on')) return false;
      const v = a.value.toLowerCase();
      return !v.includes('javascript:') && !v.includes('data:');
    })
    .map((a) => (a.value ? `${a.name}="${a.value.replace(/"/g, '&quot;')}"` : a.name));

  if (name === 'a') {
    return `<a target="_blank" rel="noopener noreferrer"${kept.map((a) => ` ${a}`).join('')}>`;
  }
  return `<${name}${kept.length ? ` ${kept.join(' ')}` : ''}>`;
}

export function sanitizeHtml(input: string): string {
  if (!input) return '';
  return input.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (tag) => {
    const isClosing = tag.startsWith('</');
    const inner = tag.slice(isClosing ? 2 : 1, -1).trim();
    const name = (inner.match(/^[a-zA-Z][a-zA-Z0-9]*/)?.[0] ?? '').toLowerCase();
    if (!ALLOWED_TAGS.has(name)) return '';
    if (isClosing) return `</${name}>`;
    return sanitizeOpeningTag(tag);
  });
}

const HTML_TAG_PATTERN = /<([a-z][a-z0-9]*)\b[^>]*>/i;

export function renderRichText(source: string): string {
  if (!source) return '';
  if (HTML_TAG_PATTERN.test(source)) {
    return sanitizeHtml(source);
  }
  return renderMarkdown(source);
}

export function toPlainText(source: string): string {
  return sanitizeHtml(source)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
