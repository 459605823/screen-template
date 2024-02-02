import {isRef, onMounted, onUnmounted, type Ref} from 'vue';

export interface AutoScrollOptions {
  scrollDisabled?: boolean;
  speed?: number;
}

const defaultOptions: AutoScrollOptions = {
  scrollDisabled: false,
};

export function useAutoScroll(
  scrollEl: Ref<HTMLElement | null> | (() => HTMLElement | null),
  options?: AutoScrollOptions
) {
  onMounted(() => {
    startAutoScroll();
    const ele = getEl();
    ele?.addEventListener('mouseover', mouseHandler);
    ele?.addEventListener('mouseout', mouseHandler);
  });
  onUnmounted(() => {
    cancelAutoScroll();
    const ele = getEl();
    ele?.removeEventListener('mouseover', mouseHandler);
    ele?.removeEventListener('mouseout', mouseHandler);
  });

  const mouseHandler = (e: Event) => {
    if (e.type == 'mouseover') {
      cancelAutoScroll();
    } else if (e.type == 'mouseout') {
      startAutoScroll();
    }
  };

  const getEl = (): HTMLElement | null => {
    let ele;
    if (isRef(scrollEl)) {
      ele = scrollEl.value;
    } else {
      ele = scrollEl();
    }
    return ele;
  };

  let animationId: number | null;
  let startTime: number | null;
  let scrollDistance: number | null;
  let currentScrollTop: number;
  const speed = options?.speed || 0.015;
  const step = (timestamp: number) => {
    const ele = getEl();
    if (ele) {
      if (ele.scrollHeight - ele.clientHeight == 0) {
        cancelAutoScroll();
        return;
      }
      if (scrollDistance == null) {
        scrollDistance = ele.scrollHeight - ele.clientHeight;
      }
      animationId = requestAnimationFrame(step);
      if (startTime == null) {
        startTime = timestamp;
        return;
      }
      const elapsed = timestamp - startTime;
      if (ele.scrollTop >= ele.scrollHeight / 2) {
        cancelAutoScroll();
        ele.scrollTop = 0;
        startAutoScroll();
        return;
      }
      ele.scrollTop = (currentScrollTop + speed * elapsed) % scrollDistance;
      // console.log('ele.scrollTop:', ele.scrollTop);
    }
  };

  const startAutoScroll = () => {
    if (options?.scrollDisabled ?? defaultOptions.scrollDisabled) return;
    let ele;
    if (isRef(scrollEl)) {
      ele = scrollEl.value;
    } else {
      ele = scrollEl();
    }
    currentScrollTop = ele?.scrollTop ?? 0;
    animationId = requestAnimationFrame(step);
  };
  const cancelAutoScroll = () => {
    if (animationId != null) {
      cancelAnimationFrame(animationId);
      startTime = null;
      scrollDistance = null;
      animationId = null;
    }
  };

  return {
    startAutoScroll,
    cancelAutoScroll,
  };
}
