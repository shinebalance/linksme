import type { LinkItem } from '../types/content';

const linkPattern = /^-\s+\[([^\]]+)\]\((https:\/\/[^)]+)\)\s+\{\s*id=([a-zA-Z0-9_-]+)\s+icon=([a-zA-Z0-9_-]+)\s*\}$/;

export function parseLinks(raw: string): LinkItem[] {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const items = lines.map((line, index) => {
    const match = line.match(linkPattern);
    if (!match) {
      throw new Error(`content/links.md: invalid format at line ${index + 1}: ${line}`);
    }

    const [, label, url, id, icon] = match;
    return { label, url, id, icon };
  });

  const idSet = new Set<string>();
  for (const item of items) {
    if (idSet.has(item.id)) {
      throw new Error(`content/links.md: duplicated id detected: ${item.id}`);
    }
    idSet.add(item.id);
  }

  return items;
}
