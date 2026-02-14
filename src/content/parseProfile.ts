import type { ProfileContent } from '../types/content';

export function parseProfile(raw: string): ProfileContent {
  const lines = raw.split(/\r?\n/).map((line) => line.trim());

  const headingLine = lines.find((line) => line.startsWith('# '));
  if (!headingLine) {
    throw new Error('content/profile.md: first heading (# name) is required');
  }

  const name = headingLine.replace(/^#\s+/, '').trim();
  if (!name) {
    throw new Error('content/profile.md: name must not be empty');
  }

  const nonEmpty = lines.filter((line) => line.length > 0 && !line.startsWith('# '));
  const tagline = nonEmpty[0];

  const imageLine = lines.find((line) => /^!\[[^\]]*\]\(([^)]+)\)$/.test(line));
  const avatarPath = imageLine?.match(/^!\[[^\]]*\]\(([^)]+)\)$/)?.[1]?.trim();

  return {
    name,
    tagline,
    avatarPath
  };
}
