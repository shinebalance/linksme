import type { LinkGroup, LinkGroupStyle, LinkItem } from '../types/content';

const headingPattern = /^##\s+(.+?)\s*\{([^}]*)\}$/;
const linkPattern = /^-\s+\[([^\]]+)\]\((https:\/\/[^)]+)\)\s+\{\s*id=([a-zA-Z0-9_-]+)\s+icon=([a-zA-Z0-9_-]+)\s*\}$/;

function parseAttributes(raw: string, lineNumber: number): Record<string, string> {
  const attributes: Record<string, string> = {};
  for (const pair of raw.trim().split(/\s+/).filter((token) => token.length > 0)) {
    const separatorIndex = pair.indexOf('=');
    if (separatorIndex <= 0) {
      throw new Error(`content/links.md: invalid attribute "${pair}" at line ${lineNumber}`);
    }
    attributes[pair.slice(0, separatorIndex)] = pair.slice(separatorIndex + 1);
  }
  return attributes;
}

function parseGroupStyle(value: string | undefined, lineNumber: number): LinkGroupStyle {
  if (value === undefined || value === 'cards') {
    return 'cards';
  }
  if (value === 'icons') {
    return 'icons';
  }
  throw new Error(`content/links.md: unknown group style "${value}" at line ${lineNumber}`);
}

export function parseLinks(raw: string): LinkGroup[] {
  const lines = raw.split(/\r?\n/);
  const groups: LinkGroup[] = [];

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (line.length === 0) {
      return;
    }
    const lineNumber = index + 1;

    const headingMatch = line.match(headingPattern);
    if (headingMatch) {
      const [, title, rawAttributes] = headingMatch;
      const attributes = parseAttributes(rawAttributes, lineNumber);
      if (!attributes.id) {
        throw new Error(`content/links.md: group heading is missing id at line ${lineNumber}`);
      }
      groups.push({
        id: attributes.id,
        title,
        style: parseGroupStyle(attributes.style, lineNumber),
        showTitle: attributes.label !== 'hide',
        featured: attributes.feature === 'true',
        items: []
      });
      return;
    }

    const match = line.match(linkPattern);
    if (!match) {
      throw new Error(`content/links.md: invalid format at line ${lineNumber}: ${line}`);
    }

    const currentGroup = groups[groups.length - 1];
    if (!currentGroup) {
      throw new Error(`content/links.md: link before any "## Title {id=...}" heading at line ${lineNumber}`);
    }

    const [, label, url, id, icon] = match;
    currentGroup.items.push({ label, url, id, icon });
  });

  const groupIdSet = new Set<string>();
  const linkIdSet = new Set<string>();
  for (const group of groups) {
    if (groupIdSet.has(group.id)) {
      throw new Error(`content/links.md: duplicated group id detected: ${group.id}`);
    }
    groupIdSet.add(group.id);

    for (const item of group.items) {
      if (linkIdSet.has(item.id)) {
        throw new Error(`content/links.md: duplicated id detected: ${item.id}`);
      }
      linkIdSet.add(item.id);
    }
  }

  return groups;
}
