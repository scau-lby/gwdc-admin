<script setup lang="ts">
import { ECharts } from "echarts";
import echarts from "/@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick, ref, watch } from "vue";
import { useEventListener, tryOnUnmounted, useTimeoutFn } from "@vueuse/core";

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
  xAxis_data: {
    type: String,
    default: ""
  },
  series_data: {
    type: Array,
    default: () => []
  }
});

const index = ref(props.index);
watch(
  () => props.index,
  val => {
    index.value = val;
  }
);

watch(
  () => props.xAxis_data,
  val => {
    if (val) {
      console.log(val);
      xAxis_data.value.push(val);
      option.xAxis.data = xAxis_data.value;
      // chartData.push(val);
      // option.dataset[0].source = chartData;
      initEchartInstance();
    }
  },
  { deep: true }
);
watch(
  () => props.series_data,
  val => {
    if (val) {
      console.log(val);
      series_data.value.push(val);
      option.series = xAxis_data.value;
      // chartData.push(val);
      // option.dataset[0].source = chartData;
      initEchartInstance();
    }
  },
  { deep: true }
);

let legend_data = ref(props.legend_data),
  legend_selected = ref(props.legend_selected),
  xAxis_data = ref([]),
  series_data = ref([]);

const option = {
  tooltip: {
    trigger: "axis"
  },
  legend: {
    show: true,
    selected: legend_selected.value,
    data: legend_data.value
  },
  color: ["#ff0000", "#00ff00", "#ffff00", "#ff00ff", "#00ffff", "#ee6666"],
  grid: {
    left: 0,
    right: "5%",
    bottom: "2%",
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: "value"
  },
  series: []
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
    useEventListener("resize", () => {
      if (!echartInstance) return;
      useTimeoutFn(() => {
        echartInstance.resize();
      }, 150);
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
  <div
    :class="'line' + props.index"
    style="width: 100%; height: calc(100% - 80px)"
  />
</template>
