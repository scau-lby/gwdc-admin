<script setup lang="ts">
import { getPreview } from "/@/api/truck";

import { ECharts } from "echarts";
import echarts from "/@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick } from "vue";
import { useEventListener, tryOnUnmounted, useTimeoutFn } from "@vueuse/core";

let echartInstance: ECharts;

const option = {
  title: {
    text: "近期作业情况"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
    // formatter: "{b}：{c} hr"
  },
  toolbox: {
    feature: {
      saveAsImage: {
        show: true,
        title: "保存为图片",
        name: "近期作业情况"
      },
      myTool1: {
        show: true,
        title: "当日",
        icon: "path://M269.05,407.27Q415.66,347.84,477.1,232.91l41.61,9.91q13.83,2-2,11.89l-4,7.92q99.06,95.12,204.09,124.83L701,439q-134.76-53.5-210-148.61-53.5,69.38-101.05,101.05h210V435H376v-31.7Q326.5,437,288.86,450.86Zm340.8,61.43,35.67,23.77q7.89,7.95-5.95,9.91Q598,623.27,564.28,684.67l-47.56-19.82q41.61-73.27,67.37-142.66H330.47V478.6H603.91Z",
        onclick: function () {
          getPreviewData(0);
        }
      },
      myTool2: {
        show: true,
        title: "最近一周",
        icon: "path://M314.62,248.76H685.14V645q0,35.67-35.66,35.67H601.92L596,643.06h43.59c4,0,5.95-2,5.95-5.95V286.41H354.25v223.9q0,105-55.48,174.36L265.09,653q49.5-49.51,49.53-158.52ZM382,381.52V343.87h97.09V298.3h37.64q15.84,2,2,11.88v33.69h101v37.65h-101v41.6h107v37.65H378V423.12H479.08v-41.6ZM409.73,651V494.45H592V629.19H449.36V651Zm39.63-59.44h103V532.1h-103Z",
        onclick: function () {
          getPreviewData(7);
        }
      },
      myTool3: {
        show: true,
        title: "最近一月",
        icon: "path://M599.94,524.17H411.71q0,85.23-87.18,160.5L290.85,647q81.21-51.49,81.23-154.55V250.74H639.57V641.08q0,31.67-33.68,31.7H558.33l-7.92-43.59H592c5.26,0,7.92-2.63,7.92-7.93ZM411.71,365.66H599.94V294.33H411.71Zm0,114.92H599.94V409.25H411.71Z",
        onclick: function () {
          getPreviewData(30);
        }
      },
      myTool4: {
        show: true,
        title: "本年度",
        icon: "path://M306.7,439,279,403.31q81.23-59.44,111-172.38l45.57,11.89q7.89,7.94-5.95,9.9l-15.85,39.63H693.07V330H548.43v67.37H667.31V435H548.43v89.16H714.86v37.65H548.43V680.71H508.8V561.82H280.94V524.17H370.1V397.37H508.8V330h-109Q362.16,395.39,306.7,439Zm103,85.19H508.8V435H409.73Z",
        onclick: function () {
          const now = new Date().getTime(),
            year = new Date().getFullYear(),
            start = new Date(`${year}-01-01 00:00:00`).getTime();
          const offset = parseInt((now - start) / 1000 / 24 / 60 / 60);
          console.log(offset);
          getPreviewData(offset);
        }
      }
    }
  },
  grid: {
    top: "22%",
    bottom: "2%",
    left: "2%",
    right: "2%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    axisLabel: {
      rotate: 45
    },
    data: null
  },
  yAxis: {
    name: "hr",
    type: "value"
  },
  series: [
    {
      name: "近期作业情况",
      type: "bar",
      data: null
    }
  ]
};

function initechartInstance() {
  const echartDom = document.querySelector(".bar");
  if (!echartDom) return;
  // @ts-ignore
  if (!echartInstance) echartInstance = echarts.init(echartDom);
  echartInstance.clear(); //清除旧画布 重新渲染

  echartInstance.setOption(option);
}

onBeforeMount(() => {
  nextTick(() => {
    initechartInstance();
  });
});

async function getPreviewData(offset) {
  let { data } = await getPreview(offset);
  const xAxis = Object.keys(data.workView);
  const series = xAxis.map(item => data.workView[item]);

  option.xAxis.data = xAxis;
  option.series[0].data = series;
  initechartInstance();
}

onMounted(() => {
  getPreviewData(0);
  nextTick(() => {
    useEventListener("resize", () => {
      if (!echartInstance) return;
      useTimeoutFn(() => {
        echartInstance.resize();
      }, 180);
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
  <div class="bar" style="width: 100%; height: 26vh" />
</template>
