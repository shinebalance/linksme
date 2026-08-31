<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue';
import type { Placement } from '@floating-ui/vue';

const props = withDefaults(
  defineProps<{
    open: boolean;
    anchor: HTMLElement | null;
    label: string;
    placement?: Placement;
  }>(),
  {
    placement: 'top'
  }
);

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const referenceEl = computed(() => props.anchor);
const floatingEl = ref<HTMLElement | null>(null);
const arrowEl = ref<HTMLElement | null>(null);

const { floatingStyles, placement, middlewareData } = useFloating(referenceEl, floatingEl, {
  placement: props.placement,
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [offset(12), flip(), shift({ padding: 8 }), arrow({ element: arrowEl, padding: 10 })]
});

const arrowStyle = computed(() => {
  const data = middlewareData.value.arrow;
  const staticSide = (
    { top: 'bottom', right: 'left', bottom: 'top', left: 'right' } as const
  )[placement.value.split('-')[0] as 'top' | 'right' | 'bottom' | 'left'];

  return {
    left: data?.x != null ? `${data.x}px` : '',
    top: data?.y != null ? `${data.y}px` : '',
    [staticSide]: '-4px'
  };
});

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
  if (floatingEl.value?.contains(target) || props.anchor?.contains(target)) {
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
        props.anchor?.focus();
      }
    }
  }
);

onUnmounted(removeOutsideListeners);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="floatingEl"
      class="floating-menu"
      role="menu"
      :aria-label="label"
      :style="floatingStyles"
    >
      <div ref="arrowEl" class="floating-menu-arrow" :style="arrowStyle" />
      <slot :close="close" />
    </div>
  </Teleport>
</template>
