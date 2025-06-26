/* eslint-disable ts/no-use-before-define */
import type {Ref} from 'vue';
import {ref} from 'vue';

export function useScroll(scrollRef: Ref<HTMLElement | undefined>, speed = 1) {
  let ani: Animation | undefined;
  let startTime = 0;
  let duration = 0;
  const currentProgress = ref(0); // 当前滚动进度 (0-1)
  const isManualControl = ref(false); // 是否处于手动控制状态
  const isMouseInside = ref(false); // 记录鼠标是否在容器内
  const dataLength = ref(0);

  const initScroll = (startProgress = 0, length?: number) => {
    if (!scrollRef.value)
      return;
    cancelScroll();
    ani = undefined;
    currentProgress.value = startProgress;
    isManualControl.value = false;
    dataLength.value = length || dataLength.value;

    const scrollRefDom = scrollRef.value;
    const scrollRefHeight = scrollRefDom.clientHeight;
    const scrollWrapRefHeight = scrollRefDom.parentElement!.clientHeight;
    if (scrollRefHeight <= scrollWrapRefHeight)
      return;

    // 从指定位置开始动画
    const startTransform = `translateY(-${startProgress * 50}%)`;
    const endTransform = `translateY(-50%)`;

    duration = (dataLength.value * 1000) / speed * (1 - startProgress);
    startTime = performance.now();

    ani = scrollRefDom.animate(
      [
        {transform: startTransform},
        {transform: endTransform},
      ],
      {
        duration,
        iterations: Infinity,
      },
    );

    // 使用 requestAnimationFrame 来跟踪进度
    const updateProgress = () => {
      if (ani && !ani.playState.includes('paused') && !isManualControl.value) {
        const elapsed = performance.now() - startTime;
        currentProgress.value = (elapsed / duration) % 1;
        requestAnimationFrame(updateProgress);
      }
    };
    requestAnimationFrame(updateProgress);
  };

  // 暂停滑动
  const pauseScroll = () => {
    ani?.pause();
  };

  // 开始滑动
  const resumeScroll = () => {
    if (isManualControl.value) {
      // 如果是从手动控制恢复，需要重新初始化动画
      isManualControl.value = false;
      // 如果进度为1，重置为0开始滚动
      const startProgress = currentProgress.value >= 1 ? 0 : currentProgress.value;
      initScroll(startProgress); // 重新初始化动画
    } else {
      ani?.play();
    }
  };

  // 取消滑动
  const cancelScroll = () => {
    ani?.cancel();
    ani = undefined;
  };

  // 处理鼠标进入事件
  const handleMouseEnter = () => {
    isMouseInside.value = true;
    pauseScroll();
  };

  // 处理鼠标离开事件
  const handleMouseLeave = () => {
    isMouseInside.value = false;
    resumeScroll();
  };

  // 处理鼠标滚轮事件
  const handleWheel = (e: WheelEvent, scrollStep = 0.1) => {
    if (!isMouseInside.value || !scrollRef.value)
      return;
    if (ani) {
      // 取消当前动画
      cancelScroll();
    }
    isManualControl.value = true;

    e.preventDefault(); // 阻止默认滚动行为

    // 获取当前进度
    let newProgress: number;

    if (e.deltaY > 0) {
      // 向下滚动（内容向上移动）
      newProgress = Math.min(1, currentProgress.value + scrollStep);
    } else {
      // 向上滚动（内容向下移动）
      newProgress = Math.max(0, currentProgress.value - scrollStep);
    }
    currentProgress.value = newProgress;
    // 直接设置样式
    const transform = `translateY(-${newProgress * 50}%)`;
    scrollRef.value.style.transform = transform;
  };

  const dispose = () => {
    cancelScroll();
    ani = undefined;
  };

  return {
    initScroll,
    handleMouseEnter,
    handleMouseLeave,
    handleWheel,
    dispose,
  };
}
