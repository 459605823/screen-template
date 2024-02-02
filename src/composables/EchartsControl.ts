import {ref, onMounted, onUnmounted, onUpdated} from 'vue';
import * as echarts from 'echarts';
import {debounce} from 'lodash-es';

export default function (
  getOptions: () => echarts.EChartsCoreOption,
  renderer: 'canvas' | 'svg' = 'svg',
  manualUpdate = false
) {
  const chartBox = ref(document.createElement('canvas'));
  let chartInstance: echarts.EChartsType;

  const resize = debounce(() => {
    draw(getOptions());
    chartInstance?.resize();
  }, 500);
  const resizeObserver = new ResizeObserver(resize);

  const draw = (options: echarts.EChartsCoreOption) => {
    chartInstance?.setOption(options);
  };

  onMounted(() => {
    chartInstance = echarts.init(chartBox.value, {}, {renderer});
    if (!document.addEventListener) return;
    resizeObserver.observe(chartBox.value);
    // window.addEventListener(resizeEvt, resize, false);

    draw(getOptions());
  });

  onUnmounted(() => {
    if (!document.removeEventListener) return;
    resizeObserver.disconnect();
    // window.removeEventListener(resizeEvt, resize, false);
    chartInstance?.dispose();
  });

  onUpdated(() => {
    if (manualUpdate) return;
    chartInstance?.clear();
    chartInstance?.resize();
    setTimeout(() => {
      draw(getOptions());
    }, 100);
  });

  return {
    chartBox,
    draw,
  };
}
