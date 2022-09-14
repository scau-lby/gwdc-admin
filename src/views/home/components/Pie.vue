<script setup lang="ts">
import { ECharts } from "echarts";
import echarts from "/@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick, watch } from "vue";
import { useEventListener, tryOnUnmounted, useTimeoutFn } from "@vueuse/core";

let echartInstance: ECharts;

const props = defineProps({
  pieLegend: {
    type: Array,
    default: () => {
      return [];
    }
  },
  pieData: {
    type: Array,
    default: () => {
      return [];
    }
  }
});

const option = {
  title: [
    {
      text: "设备安装分布情况"
    },
    {
      subtext: "数据传输",
      left: "42%",
      top: "5%",
      textAlign: "center",
      subtextStyle: {
        fontSize: 16
      }
    },
    {
      subtext: "视频传输",
      left: "78%",
      top: "5%",
      textAlign: "center",
      subtextStyle: {
        fontSize: 16
      }
    }
  ],
  tooltip: {
    trigger: "item"
    // formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: "vertical",
    top: "center",
    left: 0,
    data: props.pieLegend
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
      center: ["42%", "65%"],
      roseType: "radius",
      itemStyle: {
        borderRadius: 5
      },
      label: {
        show: true,
        formatter: "{@product}：{@[1]}",
        position: "inside"
      },
      encode: {
        itemName: "product",
        value: "数据传输"
      }
    },
    {
      name: "视频传输",
      type: "pie",
      radius: [20, 140],
      center: ["78%", "65%"],
      roseType: "area",
      itemStyle: {
        borderRadius: 5
      },
      label: {
        show: true,
        formatter: "{@product}：{@[2]}",
        position: "inside"
      },
      encode: {
        itemName: "product",
        value: "视频传输"
      }
    }
  ],
  dataset: {
    source: props.pieData
  }
};

function initechartInstance() {
  const echartDom = document.querySelector(".hpie");
  if (!echartDom) return;
  // @ts-ignore
  if (!echartInstance) echartInstance = echarts.init(echartDom);
  echartInstance.clear(); //清除旧画布 重新渲染

  echartInstance.setOption(option);
}

watch(
  () => props.pieLegend,
  val => {
    option.legend.data = val;
  },
  { deep: true }
);

watch(
  () => props.pieData,
  val => {
    option.dataset.source = val;
    initechartInstance();
  },
  { deep: true, immediate: true }
);

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
  <div class="hpie" style="width: 100%; height: 35vh" />
</template>
