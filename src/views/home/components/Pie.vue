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
  const echartDom = document.querySelector(".pie" + props.index);
  if (!echartDom) return;
  // @ts-ignore
  echartInstance = echarts.init(echartDom);
  echartInstance.clear(); //清除旧画布 重新渲染
  const option = {
    title: [
      {
        text: "设备安装分布情况"
      },
      {
        subtext: "数据传输",
        left: "35%",
        top: "5%",
        textAlign: "center",
        subtextStyle: {
          fontSize: 16
        }
      },
      {
        subtext: "视频传输",
        left: "75%",
        top: "5%",
        textAlign: "center",
        subtextStyle: {
          fontSize: 16
        }
      }
    ],
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: "vertical",
      top: "center",
      left: 0,
      data: [
        "兴隆台项目部",
        "欢喜岭项目部",
        "苏里格项目部",
        "长庆项目部",
        "西南项目部",
        "海外管理保障中心",
        "其他"
      ]
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        saveAsImage: { show: true, title: "保存为图片" }
      }
    },
    series: [
      {
        name: "数据传输",
        type: "pie",
        radius: [20, 140],
        center: ["35%", "65%"],
        roseType: "radius",
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: true,
          formatter: "{c}",
          position: "inside"
        },
        data: [
          { value: 40, name: "兴隆台项目部" },
          { value: 33, name: "欢喜岭项目部" },
          { value: 28, name: "苏里格项目部" },
          { value: 22, name: "长庆项目部" },
          { value: 20, name: "西南项目部" },
          { value: 15, name: "海外管理保障中心" },
          { value: 12, name: "其他" }
        ]
      },
      {
        name: "视频传输",
        type: "pie",
        radius: [20, 140],
        center: ["75%", "65%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 5
        },
        label: {
          show: true,
          formatter: "{c}",
          position: "inside"
        },
        data: [
          { value: 30, name: "兴隆台项目部" },
          { value: 28, name: "欢喜岭项目部" },
          { value: 26, name: "苏里格项目部" },
          { value: 24, name: "长庆项目部" },
          { value: 22, name: "西南项目部" },
          { value: 20, name: "海外管理保障中心" },
          { value: 18, name: "其他" }
        ]
      }
    ]
  };
  echartInstance.setOption(option);
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
  <div :class="'pie' + props.index" style="width: 100%; height: 35vh" />
</template>
