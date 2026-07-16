export function slugify(input: string, options: { maxLength?: number } = {}): string {
  const maxLength = options.maxLength ?? 100;
  const base = (input ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (base.length <= maxLength) return base;
  const trimmed = base.slice(0, maxLength).replace(/-+$/g, '');

  const match = trimmed.match(/-[a-z0-9]+$/);
  if (match) {
    return trimmed.slice(0, trimmed.length - match[0].length).replace(/-+$/g, '');
  }
  return trimmed;
}

export function sanitizeSlug(input: string): string {
  return slugify(input, { maxLength: 256 });
}

export function isSlugAvailable(
  slug: string,
  existing: { slug: string; id: string }[],
  ignoreId?: string
): boolean {
  const target = slugify(slug);
  return !existing.some((item) => item.slug === target && item.id !== ignoreId);
}
