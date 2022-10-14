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
  chartData: {
    type: Array,
    default: () => {
      return [];
    }
  }
});

const legend_selected = {
  混浆密度: true,
  施工压力: true,
  合并瞬时排量: true,
  泵替瞬时流量: true,
  合并累计排量: true,
  泵替累计流量: true
};

const legend_data = [
  { name: "混浆密度" },
  { name: "施工压力" },
  { name: "合并瞬时排量" },
  { name: "泵替瞬时流量" },
  { name: "合并累计排量" },
  { name: "泵替累计流量" }
];

const dataset_dimensions = [
  "sj",
  "md",
  "Abyl",
  "Zssll",
  "AbDcll",
  "Zlj",
  "AbDclllj"
];

const index = ref(props.index);
watch(
  () => props.index,
  val => {
    index.value = val;
  }
);

const option = {
  tooltip: {
    show: true,
    trigger: "axis"
  },
  axisPointer: {
    snap: true,
    label: {
      backgroundColor: "#777"
    },
    link: [
      {
        xAxisIndex: "all"
        // seriesIndex: "all"
      }
    ]
  },
  legend: {
    show: false,
    top: "15%",
    right: 0,
    orient: "vertical",
    selected: legend_selected,
    data: legend_data,
    itemStyle: {
      color: "inherit"
    }
  },
  color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#fac858", "#ee6666"],
  grid: [
    {
      left: 50,
      top: "5%",
      right: 10,
      height: "17%",
      containLabel: false
    },
    {
      left: 50,
      top: "29%",
      right: 10,
      height: "17%",
      containLabel: false
    },
    {
      left: 50,
      top: "55%",
      right: 10,
      height: "17%",
      containLabel: false
    },
    {
      left: 50,
      top: "78%",
      right: 10,
      height: "17%",
      containLabel: false
    }
  ],
  xAxis: [
    {
      show: true,
      gridIndex: 0,
      type: "category",
      boundaryGap: false,
      axisTick: { inside: true },
      axisLabel: { show: false },
      axisLine: { onZero: false },
      min: "dataMin",
      max: "dataMax"
    },
    {
      show: true,
      gridIndex: 1,
      type: "category",
      axisTick: { inside: true },
      axisLabel: { show: true },
      axisLine: { onZero: false },
      min: "dataMin",
      max: "dataMax",
      boundaryGap: false
    },
    {
      show: true,
      gridIndex: 2,
      type: "category",
      axisTick: { inside: true },
      axisLabel: { show: false },
      axisLine: { onZero: false },
      min: "dataMin",
      max: "dataMax",
      boundaryGap: false
    },
    {
      show: true,
      gridIndex: 3,
      type: "category",
      axisTick: { inside: true },
      axisLabel: { show: false },
      axisLine: { onZero: false },
      min: "dataMin",
      max: "dataMax",
      boundaryGap: false
    }
  ],
  yAxis: [
    {
      show: true,
      gridIndex: 0,
      name: "密度(g/cm³)",
      nameLocation: "end",
      nameTextStyle: {
        align: "left"
      },
      scale: true,
      min: 0,
      splitArea: {
        show: true
      },
      axisLine: {
        show: true
      },
      splitLine: {
        show: true,
        interval: 1
      }
    },
    {
      show: true,
      gridIndex: 1,
      name: "压力(MPa)",
      nameLocation: "end",
      nameTextStyle: {
        align: "left"
      },
      scale: true,
      min: 0,
      splitArea: {
        show: true
      },
      axisLine: {
        show: true
      },
      splitLine: {
        show: true,
        interval: 1
      }
    },
    {
      show: true,
      gridIndex: 2,
      name: "瞬时排量(m³/min)",
      nameLocation: "end",
      nameTextStyle: {
        align: "left"
      },
      scale: true,
      min: 0,
      axisLine: {
        show: true
      },
      splitLine: {
        show: true,
        interval: 1
      }
    },
    {
      show: true,
      gridIndex: 3,
      name: "累计排量(m³)",
      nameLocation: "end",
      nameTextStyle: {
        align: "left"
      },
      scale: true,
      min: 0,
      splitArea: {
        show: true
      },
      axisLine: {
        show: true
      },
      splitLine: {
        show: true,
        interval: 1
      }
    }
  ],
  series: [
    {
      name: "混浆密度",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 0,
      yAxisIndex: 0
    },
    {
      name: "施工压力",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 1,
      yAxisIndex: 1
    },
    {
      name: "合并瞬时排量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 2,
      yAxisIndex: 2
    },
    {
      name: "泵替瞬时流量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 2,
      yAxisIndex: 2
    },
    {
      name: "合并累计排量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 3,
      yAxisIndex: 3
    },
    {
      name: "泵替累计流量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 3,
      yAxisIndex: 3
    }
  ],
  dataZoom: [
    {
      type: "inside",
      xAxisIndex: [0, 1, 2, 3]
    },
    {
      show: true,
      xAxisIndex: [0, 1, 2, 3],
      type: "slider",
      top: "95%"
    }
  ],
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  dataset: {
    dimensions: dataset_dimensions,
    source: props.chartData
  }
};

function initEchartInstance() {
  const echartDom = document.querySelector(".live-line" + props.index);
  if (!echartDom) return;
  // @ts-ignore
  if (!echartInstance) echartInstance = echarts.init(echartDom);

  // echartInstance.clear(); //清除旧画布 重新渲染
  echartInstance.on("legendselectchanged", (obj: any) => {
    console.log("legendselectchanged");
    option.legend.selected = obj.selected;
  });
  echartInstance.setOption(option);
}

watch(
  () => props.chartData,
  val => {
    option.dataset.source = val;
    initEchartInstance();
  },
  { deep: true }
);

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

function legend_toggle(value) {
  const bool = legend_selected[value];
  legend_selected[value] = !bool;
  option.legend.selected = legend_selected;
  console.log(option);
  initEchartInstance();
}

defineExpose({ legend_toggle });
</script>

<template>
  <div :class="'live-line' + props.index" style="width: 100%; height: 65vh" />
</template>
