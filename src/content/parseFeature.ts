import type { FeaturedContent } from '../types/content';

function extractValue(line: string, prefix: string): string | undefined {
  if (!line.startsWith(prefix)) {
    return undefined;
  }
  const value = line.slice(prefix.length).trim();
  return value.length > 0 ? value : undefined;
}

function ensureHttpsUrl(value: string, fieldName: string): string {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') {
      throw new Error();
    }
    return url.toString();
  } catch {
    throw new Error(`content/feature.md: ${fieldName} must be a valid https URL`);
  }
}

function parseFeatureBlock(rawBlock: string): FeaturedContent {
  const lines = rawBlock
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const summaryLine = lines.find((line) => line.startsWith('summary:'));
  const titleLine = lines.find((line) => line.startsWith('title:'));
  const embedLine = lines.find((line) => line.startsWith('embed:'));
  const sourceLine = lines.find((line) => line.startsWith('source:'));

  const summary = summaryLine ? extractValue(summaryLine, 'summary:') : undefined;
  const title = titleLine ? extractValue(titleLine, 'title:') : undefined;
  const embedUrl = embedLine ? extractValue(embedLine, 'embed:') : undefined;
  const sourceUrl = sourceLine ? extractValue(sourceLine, 'source:') : undefined;

  if (!summary) {
    throw new Error('content/feature.md: summary is required');
  }
  if (!title) {
    throw new Error('content/feature.md: title is required');
  }
  if (!embedUrl) {
    throw new Error('content/feature.md: embed is required');
  }

  return {
    summary,
    title,
    embedUrl: ensureHttpsUrl(embedUrl, 'embed'),
    sourceUrl: sourceUrl ? ensureHttpsUrl(sourceUrl, 'source') : undefined
  };
}

function splitBlocks(raw: string): string[] {
  const lines = raw.split(/\r?\n/);
  const blocks: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (line.trim() === '---') {
      blocks.push(current.join('\n'));
      current = [];
      continue;
    }
    current.push(line);
  }
  blocks.push(current.join('\n'));

  return blocks.map((block) => block.trim()).filter((block) => block.length > 0);
}

export function parseFeature(raw: string): FeaturedContent[] {
  const blocks = splitBlocks(raw);
  const entries = blocks.map((block) => parseFeatureBlock(block));

  if (entries.length === 0) {
    throw new Error('content/feature.md: at least one entry is required');
  }

  return entries;
}
