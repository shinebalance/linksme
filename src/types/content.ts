export type ThemeMode = 'light' | 'dark';

export type ThemePreference = 'light' | 'dark' | 'system';

export type ProfileContent = {
  name: string;
  tagline?: string;
  avatarPath?: string;
};

export type LinkItem = {
  id: string;
  label: string;
  url: string;
  icon: string;
};

export type LinkGroupStyle = 'cards' | 'icons';

export type LinkGroup = {
  id: string;
  title: string;
  style: LinkGroupStyle;
  showTitle: boolean;
  featured: boolean;
  items: LinkItem[];
};

export type FeaturedContent = {
  summary: string;
  title: string;
  embedUrl: string;
  sourceUrl?: string;
};

export type SeoContent = {
  title: string;
  description: string;
  ogImage: string;
  ogUrl: string;
};
