<script setup lang="ts">
import { ECharts } from "echarts";
import echarts from "/@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick, ref, watch } from "vue";
import { tryOnUnmounted } from "@vueuse/core";

let echartInstance: ECharts;

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  legend_data: {
    type: Array,
    default: () => []
  },
  legend_selected: {
    type: Object,
    default: () => {
      return {};
    }
  },
  series: {
    type: Array,
    default: () => []
  },
  dataset: {
    type: Array,
    default: () => []
  }
});
const index = ref(props.index),
  legend_data = ref(props.legend_data),
  legend_selected = ref(props.legend_selected),
  series_data = ref(props.series),
  dataset_data = ref(props.dataset);

watch(
  () => props.index,
  val => {
    index.value = val;
  }
);

watch(
  () => props.series,
  val => {
    if (val) {
      series_data.value = val;
      option.series = series_data.value;
      echartInstance.setOption(option);
    }
  },
  { deep: true }
);

watch(
  () => props.dataset,
  val => {
    if (val) {
      dataset_data.value = val;
      option.dataset.source = val;
      echartInstance.setOption(option);
    }
  },
  { deep: true }
);

watch(
  () => props.legend_selected,
  val => {
    if (val) {
      legend_selected.value = val;
      option.legend.selected = val;
      echartInstance.setOption(option);
    }
  },
  { deep: true }
);

function legend_toggle(value) {
  const bool = legend_selected[value];
  legend_selected[value] = !bool;
  option.legend.selected = legend_selected;
  echartInstance.setOption(option);
}

defineExpose({ legend_toggle });

const option = {
  tooltip: {
    trigger: "axis"
  },
  legend: {
    show: false,
    selected: legend_selected.value,
    data: legend_data.value
  },
  // color: ["#ff0000", "#00ff00", "#ffff00", "#ff00ff", "#00ffff", "#ee6666"],
  grid: {
    left: 15,
    right: 15,
    bottom: "2%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    type: "value",
    splitLine: {
      //网格线
      show: false
    }
  },
  series: series_data.value,
  dataset: {
    source: dataset_data.value
  }
};

function initEchartInstance() {
  const echartDom = document.querySelector(".line" + props.index);
  if (!echartDom) return;
  // @ts-ignore
  if (!echartInstance) echartInstance = echarts.init(echartDom);

  // echartInstance.clear(); //清除旧画布 重新渲染
  echartInstance.on("legendselectchanged", (obj: any) => {
    option.legend.selected = obj.selected;
  });
  echartInstance.setOption(option);
}

onBeforeMount(() => {
  nextTick(() => {
    initEchartInstance();
  });
});

onMounted(() => {
  nextTick(() => {
    new ResizeObserver(entries => {
      for (let entry of entries) {
        console.log(entry);
        echartInstance.resize();
      }
    });
  });
});

tryOnUnmounted(() => {
  if (!echartInstance) return;
  echartInstance.dispose();
  echartInstance = null;
});
</script>

<template>
  <div :class="'line' + props.index" style="width: 100%; height: 100%" />
</template>
