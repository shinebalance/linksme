import type { SeoContent } from '../types/content';

export function parseSeo(raw: string): SeoContent {
  const entries = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .map((line, index) => {
      const delimiterIndex = line.indexOf(':');
      if (delimiterIndex === -1) {
        throw new Error(`content/seo.md: invalid line ${index + 1} (missing ':')`);
      }
      const key = line.slice(0, delimiterIndex).trim();
      const value = line.slice(delimiterIndex + 1).trim();
      if (!key || !value) {
        throw new Error(`content/seo.md: invalid line ${index + 1} (empty key/value)`);
      }
      return [key, value] as const;
    });

  const record = Object.fromEntries(entries) as Record<string, string>;
  const requiredKeys: Array<keyof SeoContent> = ['title', 'description', 'ogImage', 'ogUrl'];

  for (const key of requiredKeys) {
    if (!record[key]) {
      throw new Error(`content/seo.md: missing required key ${key}`);
    }
  }

  return {
    title: record.title,
    description: record.description,
    ogImage: record.ogImage,
    ogUrl: record.ogUrl
  };
}
