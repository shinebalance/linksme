<script setup lang="ts">
import FeaturedEmbed from './FeaturedEmbed.vue';
import LinkItemRow from './LinkItem.vue';
import type { FeaturedContent, LinkGroup, ThemeMode } from '../types/content';

defineProps<{
  groups: LinkGroup[];
  feature: FeaturedContent;
  theme: ThemeMode;
  resolveIconPath: (iconName: string, theme: ThemeMode) => string;
}>();

const emit = defineEmits<{
  copied: [message: string];
}>();
</script>

<template>
  <div class="link-groups">
    <section
      v-for="group in groups"
      :key="group.id"
      class="link-group"
      :aria-label="group.title"
    >
      <h2 v-if="group.showTitle" class="group-title">{{ group.title }}</h2>

      <FeaturedEmbed v-if="group.featured" :feature="feature" />

      <ul v-if="group.style === 'icons'" class="icon-row" :class="{ 'icon-row--center': !group.showTitle }">
        <li v-for="link in group.items" :key="link.id">
          <a
            class="icon-button"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="link.label"
            :title="link.label"
          >
            <img class="link-icon" :src="resolveIconPath(link.icon, theme)" alt="" />
          </a>
        </li>
      </ul>

      <ul v-else class="link-list">
        <LinkItemRow
          v-for="link in group.items"
          :key="link.id"
          :item="link"
          :theme="theme"
          :icon-path="resolveIconPath(link.icon, theme)"
          @copied="emit('copied', $event)"
        />
      </ul>
    </section>
  </div>
</template>
