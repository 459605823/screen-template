<template>
  <div class="scroll-container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @wheel="(e) => handleWheel(e, 0.1)">
    <div ref="scrollRef" class="scroll-area">
      <slot />
      <template v-if="needScroll">
        <slot />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Ref} from 'vue';
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {useScroll} from '@/composables/infinityScroll';

const props = withDefaults(
  defineProps<{
    data: any[];
    limitScrollNum?: number;
    speed?: number;
  }>(),
  {
    data: () => [],
    limitScrollNum: 0,
    speed: 1,
  },
);
const scrollRef: Ref<HTMLElement | undefined> = ref();

const {
  initScroll,
  handleMouseEnter,
  handleMouseLeave,
  handleWheel,
  dispose,
} = useScroll(scrollRef, props.speed);

const needScroll = computed(() => {
  return props.data.length > props.limitScrollNum;
});

onMounted(() => {
  watch(
    () => props.data,
    (data) => {
      if (needScroll.value) {
        initScroll(0, data.length);
      }
    },
    {
      flush: 'post',
    },
  );
});

onUnmounted(() => {
  dispose();
});
</script>

<style scoped>
.scroll-container {
  height: 100%;
  overflow: hidden;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
