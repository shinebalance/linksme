<script setup lang="ts">
import type { FeaturedContent } from '../types/content';
import { trackLinkClick } from '../lib/analytics';

const props = defineProps<{
  feature: FeaturedContent;
}>();

function trackSourceClick(): void {
  if (!props.feature.sourceUrl) return;
  trackLinkClick({
    groupId: 'feature',
    linkId: 'feature-source',
    linkLabel: props.feature.title,
    linkUrl: props.feature.sourceUrl,
    action: 'click'
  });
}
</script>

<template>
  <section class="feature-card" aria-label="Featured track">
    <p class="feature-label">{{ feature.summary }}</p>
    <div class="feature-embed-wrap">
      <iframe
        class="feature-embed"
        :src="feature.embedUrl"
        :title="feature.title"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      />
    </div>
    <div class="feature-meta">
      <p class="feature-title">{{ feature.title }}</p>
      <a
        v-if="feature.sourceUrl"
        class="feature-source"
        :href="feature.sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        @click="trackSourceClick"
      >
        ↗
      </a>
    </div>
  </section>
</template>
