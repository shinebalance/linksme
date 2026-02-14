<script setup lang="ts">
defineProps<{
  message: string;
  visible: boolean;
}>();
</script>

<template>
  <div v-if="visible" class="toast" role="status" aria-live="polite">
    {{ message }}
  </div>
</template>
