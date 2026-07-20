<script setup lang="ts">
import type { LinkItem, ThemeMode } from '../types/content';
import { trackLinkClick } from '../lib/analytics';

const props = defineProps<{
  item: LinkItem;
  groupId: string;
  theme: ThemeMode;
  iconPath: string;
}>();

const emit = defineEmits<{
  copied: [message: string];
}>();

function trackClick(action: 'click' | 'copy'): void {
  trackLinkClick({
    groupId: props.groupId,
    linkId: props.item.id,
    linkLabel: props.item.label,
    linkUrl: props.item.url,
    action
  });
}

async function copyUrl(): Promise<void> {
  trackClick('copy');
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
      <a class="link-main" :href="item.url" target="_blank" rel="noopener noreferrer" @click="trackClick('click')">
        <img class="link-icon" :src="iconPath" :alt="`${item.label} icon`" />
        <span>{{ item.label }}</span>
      </a>
      <button class="copy-button" type="button" @click="copyUrl" :aria-label="`Copy ${item.label} URL`" title="Copy URL">
        ⧉
      </button>
    </div>
  </li>
</template>
