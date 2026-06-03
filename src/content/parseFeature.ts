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

export function parseFeature(raw: string): FeaturedContent {
  const lines = raw
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
