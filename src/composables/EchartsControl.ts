import {ref, onMounted, onUnmounted} from 'vue';
import * as echarts from 'echarts';
import {debounce} from 'lodash-es';

const addCommonConfig = (getOptions: () => echarts.EChartsOption) => {
  const option = getOptions();
  // 添加通用配置
  return option;
};

export default function (
  getOptions: () => echarts.EChartsOption,
  renderer: 'canvas' | 'svg' = 'svg'
) {
  const chartBox = ref(document.createElement('canvas'));
  const chartInstance: Ref<echarts.EChartsType | undefined> =
    shallowRef(undefined);

  const resize = debounce(() => {
    chartInstance.value?.resize();
  }, 100);
  const resizeObserver = new ResizeObserver(resize);

  const draw = debounce(() => {
    chartInstance.value?.resize();
    const option = addCommonConfig(getOptions);
    chartInstance.value?.setOption(option, {
      notMerge: true,
    });
  }, 100);

  onMounted(() => {
    chartInstance.value = echarts.init(chartBox.value, {}, {renderer});
    if (!document.addEventListener) return;
    resizeObserver.observe(chartBox.value);
    draw();
  });

  onUnmounted(() => {
    resizeObserver.disconnect();
    chartInstance.value?.dispose();
    chartInstance.value = undefined;
  });

  watchEffect(() => {
    draw();
  });

  return {
    chartBox,
    chart: chartInstance,
    draw,
  };
}
