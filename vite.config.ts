import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

type SeoContent = {
  title: string;
  description: string;
  ogImage: string;
  ogUrl: string;
};

function validateProfileStrict(raw: string): void {
  const lines = raw.split(/\r?\n/).map((line) => line.trim());
  const headingLine = lines.find((line) => line.startsWith('# '));

  if (!headingLine) {
    throw new Error('content/profile.md: first heading (# name) is required');
  }

  const name = headingLine.replace(/^#\s+/, '').trim();
  if (!name) {
    throw new Error('content/profile.md: name must not be empty');
  }
}

function validateLinksStrict(raw: string): void {
  const headingPattern = /^##\s+.+?\s*\{([^}]*)\}$/;
  const linkPattern = /^-\s+\[[^\]]+\]\((https:\/\/[^)]+)\)\s+\{\s*id=([a-zA-Z0-9_-]+)\s+icon=([a-zA-Z0-9_-]+)\s*\}$/;
  const lines = raw.split(/\r?\n/);

  const groupIdSet = new Set<string>();
  const idSet = new Set<string>();
  let hasGroup = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line.length === 0) {
      continue;
    }
    const lineNumber = index + 1;

    const headingMatch = line.match(headingPattern);
    if (headingMatch) {
      const groupId = headingMatch[1].match(/(?:^|\s)id=([a-zA-Z0-9_-]+)(?:\s|$)/)?.[1];
      if (!groupId) {
        throw new Error(`content/links.md: group heading is missing id at line ${lineNumber}`);
      }
      if (groupIdSet.has(groupId)) {
        throw new Error(`content/links.md: duplicated group id detected: ${groupId}`);
      }
      groupIdSet.add(groupId);
      hasGroup = true;
      continue;
    }

    const match = line.match(linkPattern);
    if (!match) {
      throw new Error(`content/links.md: invalid format at line ${lineNumber}: ${line}`);
    }
    if (!hasGroup) {
      throw new Error(`content/links.md: link before any "## Title {id=...}" heading at line ${lineNumber}`);
    }

    const id = match[2];
    if (idSet.has(id)) {
      throw new Error(`content/links.md: duplicated id detected: ${id}`);
    }
    idSet.add(id);
  }
}

function parseSeoStrict(raw: string): SeoContent {
  const entries = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .map((line) => {
      const delimiterIndex = line.indexOf(':');
      if (delimiterIndex === -1) {
        throw new Error(`Invalid seo.md line (missing ':'): ${line}`);
      }
      const key = line.slice(0, delimiterIndex).trim();
      const value = line.slice(delimiterIndex + 1).trim();
      if (!key || !value) {
        throw new Error(`Invalid seo.md line (empty key/value): ${line}`);
      }
      return [key, value] as const;
    });

  const record = Object.fromEntries(entries) as Record<string, string>;
  const requiredKeys: Array<keyof SeoContent> = ['title', 'description', 'ogImage', 'ogUrl'];

  for (const key of requiredKeys) {
    if (!record[key]) {
      throw new Error(`Missing required key in content/seo.md: ${key}`);
    }
  }

  return {
    title: record.title,
    description: record.description,
    ogImage: record.ogImage,
    ogUrl: record.ogUrl
  };
}

function buildMetaTags(seo: SeoContent): string {
  return [
    `<title>${seo.title}</title>`,
    `<meta name=\"description\" content=\"${seo.description}\" />`,
    `<meta property=\"og:title\" content=\"${seo.title}\" />`,
    `<meta property=\"og:description\" content=\"${seo.description}\" />`,
    `<meta property=\"og:image\" content=\"${seo.ogImage}\" />`,
    `<meta property=\"og:url\" content=\"${seo.ogUrl}\" />`,
    `<meta property=\"og:type\" content=\"website\" />`,
    `<meta name=\"twitter:card\" content=\"summary_large_image\" />`,
    `<meta name=\"twitter:title\" content=\"${seo.title}\" />`,
    `<meta name=\"twitter:description\" content=\"${seo.description}\" />`,
    `<meta name=\"twitter:image\" content=\"${seo.ogImage}\" />`
  ].join('\n    ');
}

export default defineConfig(() => {
  const rootDir = process.cwd();
  const profilePath = resolve(rootDir, 'content/profile.md');
  const linksPath = resolve(rootDir, 'content/links.md');
  const seoPath = resolve(rootDir, 'content/seo.md');

  validateProfileStrict(readFileSync(profilePath, 'utf-8'));
  validateLinksStrict(readFileSync(linksPath, 'utf-8'));

  const seoRaw = readFileSync(seoPath, 'utf-8');
  const seo = parseSeoStrict(seoRaw);

  return {
    plugins: [
      vue(),
      {
        name: 'inject-seo-meta',
        transformIndexHtml(html: string) {
          const tags = buildMetaTags(seo);
          return html.replace('<!-- SEO_META_PLACEHOLDER -->', tags);
        }
      }
    ]
  };
});
