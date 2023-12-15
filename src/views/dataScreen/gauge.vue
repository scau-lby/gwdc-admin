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
  data: {
    type: Number,
    default: 0
  }
});

const index = ref(props.index);
watch(
  () => props.index,
  val => {
    index.value = val;
  }
);

const data = ref(props.data);
watch(
  () => props.data,
  val => {
    data.value = val;
    console.log(val);
    option.series[0].data[0].value.value = val;
    initEchartInstance();
  }
);

const option = {
  series: [
    {
      type: "gauge",
      center: ["50%", "60%"],
      min: 0,
      max: 2200,
      itemStyle: {
        color: "#67c23a"
      },
      progress: {
        show: true,
        width: 8
      },
      pointer: {
        show: false
      },
      axisLine: {
        lineStyle: {
          width: 8
        }
      },
      splitNumber: 11,
      axisTick: {
        distance: -16,
        splitNumber: 5,
        lineStyle: {
          width: 1,
          color: "#999"
        }
      },
      splitLine: {
        distance: -20,
        length: 6,
        lineStyle: {
          width: 1,
          color: "#999"
        }
      },
      axisLabel: {
        distance: -18,
        color: "#999",
        fontSize: 12
      },
      anchor: {
        show: false
      },
      title: {
        show: false
      },
      detail: {
        valueAnimation: true,
        width: "50%",
        lineHeight: 20,
        borderRadius: 8,
        // backgroundColor: "#ffffff",
        borderColor: "#ffffff",
        borderWidth: 1,
        offsetCenter: [0, "70%"],
        fontSize: 16,
        fontWeight: "bolder",
        formatter: "{value}",
        color: "inherit"
      },
      data: [
        {
          value: data.value
        }
      ]
    }
  ]
};

function initEchartInstance() {
  const echartDom = document.querySelector(".gauge" + props.index);
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
    :class="'gauge' + props.index"
    style="width: 100%; height: calc(100% - 80px)"
  />
</template>
