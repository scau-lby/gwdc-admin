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
  name1: {
    type: String,
    default: ""
  },
  data2: {
    type: Number,
    default: 0
  },
  name2: {
    type: String,
    default: ""
  },
  data3: {
    type: Number,
    default: 0
  },
  name3: {
    type: String,
    default: ""
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

const name1 = ref(props.name1);
watch(
  () => props.name1,
  val => {
    name1.value = val;
    option.series[0].data[0].name = val;
    echartInstance.setOption(option);
  }
);

const data2 = ref(props.data2);
watch(
  () => props.data2,
  val => {
    data2.value = val;
    option.series[0].data[1].value = val;
    echartInstance.setOption(option);
  }
);

const name2 = ref(props.name2);
watch(
  () => props.name2,
  val => {
    name2.value = val;
    option.series[0].data[1].name = val;
    echartInstance.setOption(option);
  }
);

const data3 = ref(props.data3);
watch(
  () => props.data3,
  val => {
    data3.value = val;
    option.series[0].data[2].value = val;
    echartInstance.setOption(option);
  }
);

const name3 = ref(props.name3);
watch(
  () => props.name3,
  val => {
    name3.value = val;
    option.series[0].data[2].name = val;
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
    {
      type: "gauge",
      axisLine: {
        lineStyle: {
          width: 8,
          color: [
            [0.3, "#67e0e3"],
            [0.7, "#37a2da"],
            [1, "#fd666d"]
          ]
        }
      },
      pointer: {
        itemStyle: {
          color: "auto"
        }
      },
      axisTick: {
        distance: -7,
        length: 4,
        lineStyle: {
          color: "#fff",
          width: 1
        }
      },
      splitLine: {
        distance: -7,
        length: 7,
        lineStyle: {
          color: "#fff",
          width: 2
        }
      },
      axisLabel: {
        color: "inherit",
        distance: 16,
        fontSize: 10
      },
      detail: {
        show: false
      },
      title: {
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "Arial",
        offsetCenter: [0, "35%"]
      },
      data: [
        {
          value: data1.value,
          name: name1.value
        }
      ],
      radius: "55%",
      center: ["18%", "50%"]
    },
    {
      type: "gauge",
      axisLine: {
        lineStyle: {
          width: 8,
          color: [
            [0.3, "#67e0e3"],
            [0.7, "#37a2da"],
            [1, "#fd666d"]
          ]
        }
      },
      pointer: {
        itemStyle: {
          color: "auto"
        }
      },
      axisTick: {
        distance: -7,
        length: 4,
        lineStyle: {
          color: "#fff",
          width: 1
        }
      },
      splitLine: {
        distance: -7,
        length: 7,
        lineStyle: {
          color: "#fff",
          width: 2
        }
      },
      axisLabel: {
        color: "inherit",
        distance: 16,
        fontSize: 10
      },
      detail: {
        show: false
      },
      title: {
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "Arial",
        offsetCenter: [0, "35%"]
      },
      data: [
        {
          value: data2.value,
          name: name2.value
        }
      ],
      radius: "55%",
      center: ["50%", "50%"]
    },
    {
      type: "gauge",
      axisLine: {
        lineStyle: {
          width: 8,
          color: [
            [0.3, "#67e0e3"],
            [0.7, "#37a2da"],
            [1, "#fd666d"]
          ]
        }
      },
      pointer: {
        itemStyle: {
          color: "auto"
        }
      },
      axisTick: {
        distance: -7,
        length: 4,
        lineStyle: {
          color: "#fff",
          width: 1
        }
      },
      splitLine: {
        distance: -7,
        length: 7,
        lineStyle: {
          color: "#fff",
          width: 2
        }
      },
      axisLabel: {
        color: "inherit",
        distance: 16,
        fontSize: 10
      },
      detail: {
        show: false
      },
      title: {
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "Arial",
        offsetCenter: [0, "35%"]
      },
      data: [
        {
          value: data3.value,
          name: name3.value
        }
      ],
      radius: "55%",
      center: ["82%", "50%"]
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
