<script setup lang="ts">
import FeaturedEmbed from './FeaturedEmbed.vue';
import LinkItemRow from './LinkItem.vue';
import { trackLinkClick } from '../lib/analytics';
import type { FeaturedContent, LinkGroup, LinkItem, ThemeMode } from '../types/content';

defineProps<{
  groups: LinkGroup[];
  feature: FeaturedContent[];
  theme: ThemeMode;
  resolveIconPath: (iconName: string, theme: ThemeMode) => string;
}>();

const emit = defineEmits<{
  copied: [message: string];
}>();

function trackIconClick(groupId: string, link: LinkItem): void {
  trackLinkClick({
    groupId,
    linkId: link.id,
    linkLabel: link.label,
    linkUrl: link.url,
    action: 'click'
  });
}
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

      <template v-if="group.featured">
        <FeaturedEmbed v-for="(item, index) in feature" :key="index" :feature="item" />
      </template>

      <ul v-if="group.style === 'icons'" class="icon-row" :class="{ 'icon-row--center': !group.showTitle }">
        <li v-for="link in group.items" :key="link.id">
          <a
            class="icon-button"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="link.label"
            :title="link.label"
            @click="trackIconClick(group.id, link)"
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
          :group-id="group.id"
          :theme="theme"
          :icon-path="resolveIconPath(link.icon, theme)"
          @copied="emit('copied', $event)"
        />
      </ul>
    </section>
  </div>
</template>
