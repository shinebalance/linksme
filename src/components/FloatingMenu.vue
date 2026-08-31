<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  open: boolean;
  anchor: HTMLElement | null;
  label: string;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const menuEl = ref<HTMLElement | null>(null);

function close(): void {
  emit('update:open', false);
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    close();
  }
}

function handlePointerDown(event: PointerEvent): void {
  const target = event.target as Node;
  if (menuEl.value?.contains(target) || props.anchor?.contains(target)) {
    return;
  }
  close();
}

function addOutsideListeners(): void {
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('pointerdown', handlePointerDown);
}

function removeOutsideListeners(): void {
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('pointerdown', handlePointerDown);
}

watch(
  () => props.open,
  (isOpen, wasOpen) => {
    if (isOpen) {
      addOutsideListeners();
    } else {
      removeOutsideListeners();
      if (wasOpen) {
        const anchorEl = props.anchor;
        setTimeout(() => {
          if (anchorEl && !anchorEl.closest('[inert]')) {
            anchorEl.focus();
          }
        }, 0);
      }
    }
  }
);

onUnmounted(removeOutsideListeners);
</script>

<template>
  <div v-if="open" ref="menuEl" class="floating-menu" role="menu" :aria-label="label">
    <div class="floating-menu-arrow" />
    <slot :close="close" />
  </div>
</template>
