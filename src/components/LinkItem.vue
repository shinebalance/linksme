<script setup lang="ts">
import type { LinkItem, ThemeMode } from '../types/content';

const props = defineProps<{
  item: LinkItem;
  theme: ThemeMode;
  iconPath: string;
}>();

const emit = defineEmits<{
  copied: [message: string];
}>();

async function copyUrl(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.item.url);
    emit('copied', `Copied: ${props.item.label}`);
  } catch {
    emit('copied', `Copy failed: ${props.item.label}`);
  }
}
</script>

<template>
  <li>
    <div class="link-card">
      <a class="link-main" :href="item.url" target="_blank" rel="noopener noreferrer">
        <img class="link-icon" :src="iconPath" :alt="`${item.label} icon`" />
        <span>{{ item.label }}</span>
      </a>
      <button class="copy-button" type="button" @click="copyUrl" :aria-label="`Copy ${item.label} URL`" title="Copy URL">
        ⧉
      </button>
    </div>
  </li>
</template>
