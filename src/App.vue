<script setup lang="ts">
import { computed, ref } from 'vue';
import LinkList from './components/LinkList.vue';
import ProfileHeader from './components/ProfileHeader.vue';
import ThemeToggle from './components/ThemeToggle.vue';
import Toast from './components/Toast.vue';
import { loadLinksContent, loadProfileContent } from './content/loadContent';
import type { ThemeMode } from './types/content';

const THEME_KEY = 'linksme-theme';

const profile = loadProfileContent();
const links = loadLinksContent();

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

    <LinkList :links="links" :theme="theme" :resolve-icon-path="resolveIconPath" @copied="showToast" />

    <Toast :visible="toastVisible" :message="toastMessage" />
  </main>
</template>
