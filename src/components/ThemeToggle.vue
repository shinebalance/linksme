<script setup lang="ts">
import type { ThemeMode } from '../types/content';

defineProps<{
  theme: ThemeMode;
}>();

const emit = defineEmits<{
  toggle: [];
}>();
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    @click="emit('toggle')"
    :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="theme === 'dark' ? 'Light mode' : 'Dark mode'"
  >
    <span aria-hidden="true">{{ theme === 'dark' ? '☀︎' : '☾' }}</span>
  </button>
</template>
