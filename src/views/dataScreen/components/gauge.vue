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
  data1: {
    type: Number,
    default: 0
  },
  data2: {
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

const data1 = ref(props.data1);
watch(
  () => props.data1,
  val => {
    data1.value = val;
    option.series[0].data[0].value = val;
    echartInstance.setOption(option);
  }
);

const data2 = ref(props.data2);
watch(
  () => props.data2,
  val => {
    data2.value = val;
    option.series[1].data[0].value = val;
    echartInstance.setOption(option);
  }
);

const option = {
  tooltip: {
    formatter: "{a} : {c}"
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  series: [
    // left
    {
      name: "台上转速",
      type: "gauge",
      min: 0,
      max: 2200,
      z: 10,
      startAngle: -30,
      endAngle: -315,
      splitNumber: 11,
      radius: "80%",
      center: ["25%", "45%"],
      progress: {
        show: true,
        width: 5
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 0,
          color: [
            [0.909, "#fff"],
            [1, "#f00"]
          ]
        }
      },
      splitLine: {
        distance: 5,
        length: 10,
        lineStyle: {
          color: "auto",
          width: 2,
          shadowColor: "rgba(255, 255, 255, 0.5)",
          shadowBlur: 15,
          shadowOffsetY: -10
        }
      },
      axisTick: {
        distance: 5,
        length: 5,
        lineStyle: {
          color: "auto",
          width: 1,
          shadowColor: "rgba(255, 255, 255)",
          shadowBlur: 10,
          shadowOffsetY: -10
        }
      },
      axisLabel: {
        distance: 5,
        fontSize: 12,
        fontFamily: "Arial",
        color: "#fff"
      },
      anchor: {},
      pointer: {
        offsetCenter: [0, "-10%"],
        itemStyle: {
          color: "#67c23a",
          shadowColor: "#67c23a",
          shadowBlur: 5,
          shadowOffsetY: 3
        }
      },
      title: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Arial",
        offsetCenter: [0, "115%"]
      },
      data: [
        {
          value: data1.value
          // name: "台上转速"
        }
      ],
      detail: {
        valueAnimation: true,
        width: "40%",
        lineHeight: 15,
        borderRadius: 5,
        borderColor: "#ffffff",
        borderWidth: 1,
        offsetCenter: [0, "30%"],
        fontSize: 16,
        fontWeight: "bolder",
        formatter: "{value}",
        color: "inherit"
      }
    },
    // right
    {
      name: "底盘转速",
      type: "gauge",
      min: 0,
      max: 2200,
      z: 11,
      startAngle: 210,
      endAngle: 135,
      clockwise: false,
      splitNumber: 11,
      radius: "80%",
      center: ["75%", "45%"],
      progress: {
        show: true,
        width: 5
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 0,
          color: [
            [0.909, "#fff"],
            [1, "#f00"]
          ]
        }
      },
      splitLine: {
        distance: 5,
        length: 10,
        lineStyle: {
          color: "auto",
          width: 2,
          shadowColor: "rgba(255, 255, 255, 0.5)",
          shadowBlur: 15,
          shadowOffsetY: -10
        }
      },
      axisTick: {
        distance: 5,
        length: 5,
        lineStyle: {
          color: "auto",
          width: 1,
          shadowColor: "rgba(255, 255, 255)",
          shadowBlur: 10,
          shadowOffsetY: -10
        }
      },
      axisLabel: {
        distance: 5,
        fontSize: 12,
        fontFamily: "Arial",
        color: "#fff"
      },
      anchor: {},
      pointer: {
        offsetCenter: [0, "-10%"],
        itemStyle: {
          color: "#67c23a",
          shadowColor: "#67c23a",
          shadowBlur: 5,
          shadowOffsetY: 3
        }
      },
      title: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Arial",
        offsetCenter: [0, "115%"]
      },
      data: [
        {
          value: data2.value
          // name: "底盘转速"
        }
      ],
      detail: {
        valueAnimation: true,
        width: "40%",
        lineHeight: 15,
        borderRadius: 5,
        borderColor: "#ffffff",
        borderWidth: 1,
        offsetCenter: [0, "30%"],
        fontSize: 16,
        fontWeight: "bolder",
        formatter: "{value}",
        color: "inherit"
      }
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
  <div :class="'gauge' + props.index" style="width: 100%; height: 100%" />
</template>
