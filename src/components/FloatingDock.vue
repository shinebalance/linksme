<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import FloatingMenu from './FloatingMenu.vue';
import { trackDockAction } from '../lib/analytics';
import type { ThemeMode, ThemePreference } from '../types/content';

const props = defineProps<{
  theme: ThemeMode;
  themePreference: ThemePreference;
  shareTitle: string;
  shareUrl: string;
}>();

const emit = defineEmits<{
  'set-theme-preference': [value: ThemePreference];
  copied: [message: string];
}>();

const visible = ref(false);
const themeOpen = ref(false);
const shareOpen = ref(false);
const themeButtonEl = ref<HTMLButtonElement | null>(null);
const shareButtonEl = ref<HTMLButtonElement | null>(null);

let ticking = false;

function handleScroll(): void {
  if (ticking) {
    return;
  }
  ticking = true;
  requestAnimationFrame(() => {
    visible.value = window.scrollY > 200;
    ticking = false;
  });
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

watch(visible, (isVisible) => {
  if (!isVisible) {
    themeOpen.value = false;
    shareOpen.value = false;
  }
});

function toggleThemeMenu(): void {
  shareOpen.value = false;
  themeOpen.value = !themeOpen.value;
}

function toggleShareMenu(): void {
  themeOpen.value = false;
  const opening = !shareOpen.value;
  shareOpen.value = opening;
  if (opening) {
    trackDockAction('share_open');
  }
}

function scrollToTop(): void {
  trackDockAction('scroll_top');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function handleShareClick(): Promise<void> {
  if (navigator.share) {
    try {
      await navigator.share({ title: props.shareTitle, url: props.shareUrl });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      toggleShareMenu();
    }
    return;
  }
  toggleShareMenu();
}

function selectThemePreference(value: ThemePreference): void {
  trackDockAction(`theme_${value}`);
  emit('set-theme-preference', value);
}

async function copyShareUrl(): Promise<void> {
  trackDockAction('share_copy');
  try {
    await navigator.clipboard.writeText(props.shareUrl);
    emit('copied', 'URLをコピーしました');
  } catch {
    emit('copied', 'コピーに失敗しました');
  }
}

const themeIcon = computed(() => (props.theme === 'dark' ? '☀︎' : '☾'));
const shareIntentUrl = computed(
  () =>
    `https://x.com/intent/tweet?url=${encodeURIComponent(props.shareUrl)}&text=${encodeURIComponent(props.shareTitle)}`
);
</script>

<template>
  <nav class="floating-dock" :class="{ 'is-visible': visible }" :inert="!visible" aria-label="クイック操作">
    <button
      ref="themeButtonEl"
      type="button"
      class="dock-button"
      aria-haspopup="menu"
      :aria-expanded="themeOpen"
      aria-label="テーマを切り替え"
      @click="toggleThemeMenu"
    >
      <span aria-hidden="true">{{ themeIcon }}</span>
    </button>

    <button
      ref="shareButtonEl"
      type="button"
      class="dock-button"
      aria-haspopup="menu"
      :aria-expanded="shareOpen"
      aria-label="このページを共有"
      @click="handleShareClick"
    >
      <span aria-hidden="true">↗</span>
    </button>

    <button type="button" class="dock-button" aria-label="トップに戻る" @click="scrollToTop">
      <span aria-hidden="true">↑</span>
    </button>

    <FloatingMenu :open="themeOpen" :anchor="themeButtonEl" label="テーマ選択" @update:open="themeOpen = $event">
      <template #default="{ close }">
        <button
          type="button"
          class="floating-menu-item"
          role="menuitemradio"
          :aria-checked="themePreference === 'light'"
          @click="
            selectThemePreference('light');
            close();
          "
        >
          Light
        </button>
        <button
          type="button"
          class="floating-menu-item"
          role="menuitemradio"
          :aria-checked="themePreference === 'dark'"
          @click="
            selectThemePreference('dark');
            close();
          "
        >
          Dark
        </button>
        <button
          type="button"
          class="floating-menu-item"
          role="menuitemradio"
          :aria-checked="themePreference === 'system'"
          @click="
            selectThemePreference('system');
            close();
          "
        >
          System
        </button>
      </template>
    </FloatingMenu>

    <FloatingMenu :open="shareOpen" :anchor="shareButtonEl" label="共有メニュー" @update:open="shareOpen = $event">
      <template #default="{ close }">
        <a
          class="floating-menu-item"
          role="menuitem"
          :href="shareIntentUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click="
            trackDockAction('share_x');
            close();
          "
        >
          Xで共有
        </a>
        <button
          type="button"
          class="floating-menu-item"
          role="menuitem"
          @click="
            copyShareUrl();
            close();
          "
        >
          URLをコピー
        </button>
      </template>
    </FloatingMenu>
  </nav>
</template>
