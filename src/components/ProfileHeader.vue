<script setup lang="ts">
import type { ThemeMode } from '../types/content';

defineProps<{
  name: string;
  tagline?: string;
  theme: ThemeMode;
  avatarPath?: string;
}>();

function resolveAvatar(theme: ThemeMode, avatarPath?: string): string {
  if (avatarPath) {
    return avatarPath;
  }
  return theme === 'dark' ? '/avatar-dark.svg' : '/avatar-light.svg';
}
</script>

<template>
  <header class="profile-header">
    <img class="avatar" :src="resolveAvatar(theme, avatarPath)" :alt="`${name} avatar`" />
    <h1 class="name">{{ name }}</h1>
    <p v-if="tagline" class="tagline">{{ tagline }}</p>
  </header>
</template>
