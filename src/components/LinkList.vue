<script setup lang="ts">
import LinkItemRow from './LinkItem.vue';
import type { LinkItem, ThemeMode } from '../types/content';

defineProps<{
  links: LinkItem[];
  theme: ThemeMode;
  resolveIconPath: (iconName: string, theme: ThemeMode) => string;
}>();

const emit = defineEmits<{
  copied: [message: string];
}>();
</script>

<template>
  <ul class="link-list">
    <LinkItemRow
      v-for="link in links"
      :key="link.id"
      :item="link"
      :theme="theme"
      :icon-path="resolveIconPath(link.icon, theme)"
      @copied="emit('copied', $event)"
    />
  </ul>
</template>
