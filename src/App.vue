<script setup lang="ts">
import { computed, ref } from 'vue';
import FloatingDock from './components/FloatingDock.vue';
import LinkList from './components/LinkList.vue';
import ProfileHeader from './components/ProfileHeader.vue';
import ThemeToggle from './components/ThemeToggle.vue';
import Toast from './components/Toast.vue';
import { loadFeatureContent, loadLinksContent, loadProfileContent } from './content/loadContent';
import type { ThemeMode } from './types/content';

const THEME_KEY = 'linksme-theme';

const profile = loadProfileContent();
const links = loadLinksContent();
const feature = loadFeatureContent();

function getInitialTheme(): ThemeMode {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const theme = ref<ThemeMode>(getInitialTheme());
const toastVisible = ref(false);
const toastMessage = ref('');
let toastTimer: ReturnType<typeof setTimeout> | undefined;

document.documentElement.setAttribute('data-theme', theme.value);

function toggleTheme(): void {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, theme.value);
  document.documentElement.setAttribute('data-theme', theme.value);
}

const lightIcons = import.meta.glob('./assets/icons/light/*.svg', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const darkIcons = import.meta.glob('./assets/icons/dark/*.svg', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

function pickIcon(icons: Record<string, string>, iconName: string): string | undefined {
  return Object.entries(icons).find(([path]) => path.endsWith(`/${iconName}.svg`))?.[1];
}

function resolveIconPath(iconName: string, mode: ThemeMode): string {
  const primary = mode === 'dark' ? darkIcons : lightIcons;
  const fallback = mode === 'dark' ? lightIcons : darkIcons;

  const icon = pickIcon(primary, iconName) ?? pickIcon(fallback, iconName);
  if (!icon) {
    throw new Error(`Missing icon asset for: ${iconName}`);
  }
  return icon;
}

function showToast(message: string): void {
  toastMessage.value = message;
  toastVisible.value = true;

  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(() => {
    toastVisible.value = false;
  }, 1800);
}

const currentThemeLabel = computed(() => (theme.value === 'dark' ? 'Dark' : 'Light'));
</script>

<template>
  <svg
    class="bg-loops"
    aria-hidden="true"
    viewBox="0 0 1200 800"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="loop-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1F3A93" />
        <stop offset="1" stop-color="#8A51FF" />
      </linearGradient>
    </defs>
    <circle cx="1110" cy="30" r="300" fill="none" stroke="url(#loop-gradient)" stroke-width="64" />
    <circle cx="60" cy="790" r="360" fill="none" stroke="url(#loop-gradient)" stroke-width="80" />
  </svg>

  <main class="container">
    <div class="top-row">
      <span class="theme-label" aria-hidden="true">{{ currentThemeLabel }}</span>
      <ThemeToggle :theme="theme" @toggle="toggleTheme" />
    </div>

    <ProfileHeader
      :name="profile.name"
      :tagline="profile.tagline"
      :avatar-path="profile.avatarPath"
      :theme="theme"
    />

    <LinkList
      :groups="links"
      :feature="feature"
      :theme="theme"
      :resolve-icon-path="resolveIconPath"
      @copied="showToast"
    />

    <Toast :visible="toastVisible" :message="toastMessage" />

    <FloatingDock :theme="theme" @toggle-theme="toggleTheme" />
  </main>
</template>
