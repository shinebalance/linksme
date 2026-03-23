import { parseFeature } from './parseFeature';
import { parseLinks } from './parseLinks';
import { parseProfile } from './parseProfile';
import { parseSeo } from './parseSeo';
import type { FeaturedContent, LinkItem, ProfileContent, SeoContent } from '../types/content';

type RawModule = {
  default: string;
};

const mdModules = import.meta.glob('../../content/*.md', {
  eager: true,
  import: 'default',
  query: '?raw'
}) as Record<string, string>;

function getRawContent(fileName: string): string {
  const matchedEntry = Object.entries(mdModules).find(([filePath]) => filePath.endsWith(`/${fileName}`));
  if (!matchedEntry) {
    throw new Error(`Missing content file: content/${fileName}`);
  }
  return matchedEntry[1];
}

export function loadProfileContent(): ProfileContent {
  return parseProfile(getRawContent('profile.md'));
}

export function loadLinksContent(): LinkItem[] {
  return parseLinks(getRawContent('links.md'));
}

export function loadSeoContent(): SeoContent {
  return parseSeo(getRawContent('seo.md'));
}


export function loadFeatureContent(): FeaturedContent {
  return parseFeature(getRawContent('feature.md'));
}
