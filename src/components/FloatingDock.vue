<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { trackDockAction } from '../lib/analytics';
import type { ThemeMode } from '../types/content';

const props = defineProps<{
  theme: ThemeMode;
}>();

const emit = defineEmits<{
  'toggle-theme': [];
}>();

const visible = ref(false);

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

function handleThemeToggle(): void {
  trackDockAction('theme_toggle');
  emit('toggle-theme');
}

function scrollToTop(): void {
  trackDockAction('scroll_top');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const themeIcon = computed(() => (props.theme === 'dark' ? '☀︎' : '☾'));
const themeLabel = computed(() => (props.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'));
</script>

<template>
  <nav class="floating-dock" :class="{ 'is-visible': visible }" :inert="!visible" aria-label="クイック操作">
    <button type="button" class="dock-button" :aria-label="themeLabel" @click="handleThemeToggle">
      <span aria-hidden="true">{{ themeIcon }}</span>
    </button>

    <button type="button" class="dock-button" aria-label="トップに戻る" @click="scrollToTop">
      <span aria-hidden="true">↑</span>
    </button>
  </nav>
</template>
