<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import FloatingMenu from './FloatingMenu.vue';
import { trackDockAction } from '../lib/analytics';
import type { ThemeMode, ThemePreference } from '../types/content';

const props = defineProps<{
  theme: ThemeMode;
  themePreference: ThemePreference;
}>();

const emit = defineEmits<{
  'set-theme-preference': [value: ThemePreference];
}>();

const visible = ref(false);
const themeOpen = ref(false);
const themeButtonEl = ref<HTMLButtonElement | null>(null);

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
  }
});

function toggleThemeMenu(): void {
  themeOpen.value = !themeOpen.value;
}

function scrollToTop(): void {
  trackDockAction('scroll_top');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectThemePreference(value: ThemePreference): void {
  trackDockAction(`theme_${value}`);
  emit('set-theme-preference', value);
}

const themeIcon = computed(() => (props.theme === 'dark' ? '☀︎' : '☾'));
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
  </nav>
</template>
