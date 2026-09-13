export function createPersianSlug(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\u200c/g, ' ')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
