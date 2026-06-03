<script setup lang="ts">
import type { FeaturedContent } from '../types/content';

defineProps<{
  feature: FeaturedContent;
}>();
</script>

<template>
  <section class="feature-section" aria-label="Featured track">
    <details class="feature-details">
      <summary class="feature-summary">💡 {{ feature.summary }}</summary>
      <div class="feature-content">
        <p class="feature-title">{{ feature.title }}</p>
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
        <a
          v-if="feature.sourceUrl"
          class="feature-source"
          :href="feature.sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          元リンクを開く
        </a>
      </div>
    </details>
  </section>
</template>
