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
let restoreFocusOnClose = true;

function close(restoreFocus = true): void {
  restoreFocusOnClose = restoreFocus;
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
  close(false);
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
      restoreFocusOnClose = true;
      addOutsideListeners();
    } else {
      removeOutsideListeners();
      if (wasOpen && restoreFocusOnClose && props.anchor && !props.anchor.closest('[inert]')) {
        props.anchor.focus();
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
