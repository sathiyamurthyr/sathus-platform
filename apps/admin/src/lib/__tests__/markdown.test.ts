import { describe, expect, it } from 'vitest';
import { renderMarkdown, sanitizeHtml, renderRichText, estimateReadTime, toPlainText } from '../markdown';

describe('renderMarkdown', () => {
  it('renders headings', () => {
    expect(renderMarkdown('# Title')).toBe('<h1>Title</h1>');
  });

  it('renders bold and italic', () => {
    expect(renderMarkdown('**bold** and *em*')).toContain('<strong>bold</strong>');
    expect(renderMarkdown('**bold** and *em*')).toContain('<em>em</em>');
  });

  it('renders links with safe protocols only', () => {
    const safe = renderMarkdown('[x](https://example.com)');
    expect(safe).toContain('href="https://example.com"');
    expect(safe).toContain('rel="noopener noreferrer"');
    const unsafe = renderMarkdown('[x](javascript:alert(1))');
    expect(unsafe).toContain('href="#"');
  });

  it('renders lists', () => {
    const out = renderMarkdown('- one\n- two');
    expect(out).toContain('<ul>');
    expect(out).toContain('<li>one</li>');
  });

  it('escapes raw HTML to prevent injection', () => {
    const out = renderMarkdown('<script>alert(1)</script>');
    expect(out).not.toContain('<script>');
  });

  it('estimates read time', () => {
    const text = Array.from({ length: 400 }, () => 'word').join(' ');
    expect(estimateReadTime(text)).toBe(2);
  });
});

describe('sanitizeHtml', () => {
  it('keeps allowed tags', () => {
    expect(sanitizeHtml('<p>hi</p>')).toContain('<p>hi</p>');
  });

  it('strips script and style', () => {
    const out = sanitizeHtml('<p>ok</p><script>evil()</script>');
    expect(out).not.toContain('script');
  });

  it('removes event handlers and javascript urls', () => {
    const out = sanitizeHtml('<a href="javascript:evil()" onclick="x()">link</a>');
    expect(out).not.toContain('onclick');
    expect(out).not.toContain('javascript:');
  });
});

describe('renderRichText', () => {
  it('renders markdown when no html tags present', () => {
    expect(renderRichText('# Hi')).toBe('<h1>Hi</h1>');
  });

  it('sanitizes html when tags present', () => {
    const out = renderRichText('<p>safe</p><script>x</script>');
    expect(out).toContain('<p>safe</p>');
    expect(out).not.toContain('script');
  });
});

describe('toPlainText', () => {
  it('strips tags', () => {
    expect(toPlainText('<p>hello <b>world</b></p>')).toBe('hello world');
  });
});
