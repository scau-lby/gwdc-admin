<script setup lang="ts">
import { ECharts } from "echarts";
import echarts from "/@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick, ref, watch } from "vue";
import { tryOnUnmounted } from "@vueuse/core";
import { getFixedHistoryReal } from "/@/api/well";

const pageSize = 500;

let echartInstance: ECharts;

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  plateNum: {
    type: String,
    default: ""
  },
  wellName: {
    type: String,
    default: ""
  },
  wellType: {
    type: String,
    default: ""
  },
  data: {
    type: Object,
    default: () => {
      return {};
    }
  },
  dataList: {
    type: Array,
    default: () => {
      return [];
    }
  },
  simulateData: {
    type: Array,
    default: () => {
      return [];
    }
  },
  legendVisible: {
    type: Boolean,
    default: false
  },
  myTool1Visible: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ""
  },
  subtitle: {
    type: String,
    default: ""
  },
  height: {
    type: Number,
    default: 80
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

let chartData = [];
let simulateData = [];

const index = ref(props.index);
watch(
  () => props.index,
  val => {
    index.value = val;
    chartData = [];
    simulateData = [];
  }
);

const title = ref(props.title);
watch(
  () => props.title,
  val => {
    title.value = val;
    option.title.text = val;
  }
);
const subtitle = ref(props.subtitle);
watch(
  () => props.subtitle,
  val => {
    subtitle.value = val;
    option.title.subtext = val;
  }
);

const legendVisible = ref(props.legendVisible);
watch(
  () => props.legendVisible,
  val => {
    legendVisible.value = val;
  }
);

const myTool1Visible = ref(props.myTool1Visible);
watch(
  () => props.myTool1Visible,
  val => {
    myTool1Visible.value = val;
  }
);

const height = ref(props.height);
watch(
  () => props.height,
  val => {
    height.value = val;
    echartInstance.resize();
  }
);

const option = {
  title: {
    show: true,
    text: title.value + " - 施工监控曲线",
    subtext: subtitle.value ? "作业日期：" + subtitle.value : "",
    left: "center",
    textStyle: {
      color: "#d53e42"
    },
    subtextStyle: {
      color: "#f00"
    }
  },
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
    show: legendVisible.value,
    top: "15%",
    right: 0,
    orient: "vertical",
    selected: legend_selected,
    data: legend_data,
    itemStyle: {
      color: "inherit"
    }
  },
  color: [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#fac858",
    "#ee6666",
    "#999999",
    "#999999",
    "#999999"
  ],
  grid: [
    {
      left: 50,
      top: "8%",
      right: legendVisible.value ? 150 : 25,
      height: "16.5%",
      containLabel: false
    },
    {
      left: 50,
      top: "29.5%",
      right: legendVisible.value ? 150 : 25,
      height: "16.5%",
      containLabel: false
    },
    {
      left: 50,
      top: "56%",
      right: legendVisible.value ? 150 : 25,
      height: "16.5%",
      containLabel: false
    },
    {
      left: 50,
      top: "78%",
      right: legendVisible.value ? 150 : 25,
      height: "16.5%",
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
    },
    {
      name: "混浆密度（模拟）",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 0,
      yAxisIndex: 0,
      datasetIndex: 1
    },
    {
      name: "流量（模拟）",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 2,
      yAxisIndex: 2,
      datasetIndex: 1
    },
    {
      name: "累计流量（模拟）",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 3,
      yAxisIndex: 3,
      datasetIndex: 1
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
      saveAsImage: {},
      dataView: {
        show: true,
        lang: ["数据视图", "关闭", "导出为excel"],
        contentToOption: function () {
          $("#mixedTable").table2excel({
            exclude: ".noExl",
            name: "Excel Document Name",
            filename: title.value + subtitle.value,
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true
          });
        },
        optionToContent: function (opt) {
          var dataset = opt.dataset[0].source;
          var series = opt.series;
          var table = `<table id="mixedTable" style="width:100%;text-align:center;">
            <thead>
              <tr>
                <th>时间</th>
                <th>${series[0].name}</th>
                <th>${series[1].name}</th>
                <th>${series[2].name}</th>
                <th>${series[3].name}</th>
                <th>${series[4].name}</th>
                <th>${series[5].name}</th>
              </tr>
            </thead>`;
          table += `<tbody>`;
          for (var i = 0, l = dataset.length; i < l; i++) {
            table += `<tr>
                <td>${dataset[i].time}</td>
                <td>${dataset[i].md}</td>
                <td>${dataset[i].abyl}</td>
                <td>${dataset[i].zssll}</td>
                <td>${dataset[i].abdcll}</td>
                <td>${dataset[i].zlj}</td>
                <td>${dataset[i].abdclllj}</td>
              </tr>`;
          }
          table += "</tbody></table>";
          return table;
        }
      },

      myTool1: {
        show: myTool1Visible.value,
        title: "获取历史数据",
        icon: "path://M269.05,407.27Q415.66,347.84,477.1,232.91l41.61,9.91q13.83,2-2,11.89l-4,7.92q99.06,95.12,204.09,124.83L701,439q-134.76-53.5-210-148.61-53.5,69.38-101.05,101.05h210V435H376v-31.7Q326.5,437,288.86,450.86Zm340.8,61.43,35.67,23.77q7.89,7.95-5.95,9.91Q598,623.27,564.28,684.67l-47.56-19.82q41.61-73.27,67.37-142.66H330.47V478.6H603.91Z",
        onclick: function () {
          let endTime = "";
          if (chartData.length > 0) {
            endTime = chartData[0].sj;
          }
          getFixedHistoryReal({
            plateNums: props.plateNum.split("/").join(","),
            wellName: props.wellName,
            wellType: props.wellType,
            endTime: endTime,
            pageNum: 1,
            pageSize
          }).then(({ data }) => {
            const { pages } = data;
            let pageNum = pages;
            getMoreRecords(pageNum, endTime);

            const timer = setInterval(() => {
              if (pageNum > 1) {
                pageNum = pageNum - 1;
                getMoreRecords(pageNum, endTime);
              } else {
                clearInterval(timer);
              }
            }, 2000);
          });
        }
      }
    }
  },
  dataset: [
    {
      dimensions: ["time", "md", "abyl", "zssll", "abdcll", "zlj", "abdclllj"],
      source: chartData
    },
    {
      dimensions: ["time", "mnmd", "mnabll", "mnabljll"],
      source: simulateData
    }
  ]
};

function getResult(params: object) {
  const res = {};
  for (var i in params) {
    if (params[i] != 0 && ["jd", "wd", "sj"].indexOf(i) === -1) {
      res[i] = parseFloat(params[i]).toFixed(3);
      if (i === "md" && parseFloat(params[i]) < 0) {
        res[i] = 0;
      }
    } else {
      res[i] = params[i];
    }
  }
  res.time =
    params.sj.slice(8, 10) +
    ":" +
    params.sj.slice(10, 12) +
    ":" +
    params.sj.slice(12, 14);
  return res;
}

async function getMoreRecords(pageNum, endTime) {
  let { data } = await getFixedHistoryReal({
    plateNums: props.plateNum.split("/").join(","),
    wellName: props.wellName,
    wellType: props.wellType,
    endTime: endTime,
    pageNum: pageNum,
    pageSize
  });

  const records = data.records.map(item => getResult(item));
  chartData = records.concat(chartData);
}

function initEchartInstance() {
  const echartDom = document.querySelector(".live-line" + props.index);
  if (!echartDom) return;
  // @ts-ignore
  if (!echartInstance) echartInstance = echarts.init(echartDom);

  // echartInstance.clear(); //清除旧画布 重新渲染
  echartInstance.on("legendselectchanged", (obj: any) => {
    option.legend.selected = obj.selected;
  });
  echartInstance.setOption(option);
}

watch(
  () => props.data,
  val => {
    if (val) {
      chartData.push(val);
      option.dataset[0].source = chartData;
      echartInstance.setOption(option);
    }
  },
  { deep: true }
);

watch(
  () => props.dataList,
  val => {
    if (val.length > 0) {
      chartData = chartData.concat(val);
      option.dataset[0].source = chartData;
      echartInstance.setOption(option);
    }
  },
  { deep: true }
);

watch(
  () => props.simulateData,
  val => {
    if (val.length > 0) {
      simulateData = simulateData.concat(val);
      option.dataset[1].source = simulateData;
      echartInstance.setOption(option);
    }
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
    const echartDom = document.querySelector(".live-line" + props.index);
    var ro = new ResizeObserver(entries => {
      for (let entry of entries) {
        console.log(entry);
        echartInstance.resize();
      }
    });

    // 观察一个或多个元素
    ro.observe(echartDom);
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
  echartInstance.setOption(option);
}

defineExpose({ legend_toggle });
</script>

<template>
  <div
    :class="'live-line' + props.index"
    :style="{ width: '100%', height: height + 'vh' }"
  />
</template>
