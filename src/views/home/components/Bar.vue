<script setup lang="ts">
import { ECharts } from "echarts";
import echarts from "/@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick } from "vue";
import { useEventListener, tryOnUnmounted, useTimeoutFn } from "@vueuse/core";

let echartInstance: ECharts;

const props = defineProps({
  index: {
    type: Number,
    default: 0
  }
});

function initechartInstance() {
  const echartDom = document.querySelector(".bar" + props.index);
  if (!echartDom) return;
  // @ts-ignore
  echartInstance = echarts.init(echartDom);
  echartInstance.clear(); //清除旧画布 重新渲染

  echartInstance.setOption({
    title: {
      text: "近期作业情况"
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    toolbox: {
      feature: {
        saveAsImage: {
          show: true,
          title: "保存为图片",
          name: "近期作业情况"
        },
        dataZoom: {
          show: true
        },
        today: {
          show: true,
          title: "当日",
          icon: "当日",
          onclick: function () {
            alert("111");
          }
        }
      }
    },
    grid: {
      top: "20%",
      bottom: "2%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        axisLabel: {
          rotate: 45
        },
        data: [
          "辽LA6506",
          "辽LA7059",
          "辽LA7878",
          "辽LA9031",
          "辽LA9506",
          "辽LA9527",
          "辽LA9556",
          "辽L29341",
          "辽L29357",
          "辽L31310",
          "辽L31668",
          "辽L32577",
          "辽L32583",
          "辽LA3007",
          "辽LA4700",
          "辽LA5255",
          "辽LA5266",
          "辽L18730",
          "辽L19280",
          "辽L20819",
          "辽L20831",
          "辽L20838",
          "辽L21563",
          "辽L22835",
          "辽L22866",
          "辽L23008",
          "辽L29137",
          "GJQ102",
          "GJQ208",
          "JRCS",
          "SWCS",
          "辽L11568",
          "辽L11569",
          "辽L13567",
          "辽L15128",
          "辽L15649",
          "辽L18710"
        ]
      }
    ],
    yAxis: [
      {
        name: "hr",
        type: "value"
      }
    ],
    series: [
      {
        name: "GitHub信息",
        type: "bar",
        data: [3, 204, 1079, 1079]
      }
    ]
  });
}

onBeforeMount(() => {
  nextTick(() => {
    initechartInstance();
  });
});

onMounted(() => {
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
  <div :class="'bar' + props.index" style="width: 100%; height: 35vh" />
</template>
