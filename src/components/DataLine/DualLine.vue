<script setup lang="ts">
import { ECharts } from "echarts";
import echarts from "/@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick, ref, watch } from "vue";
import { useEventListener, tryOnUnmounted, useTimeoutFn } from "@vueuse/core";
import { getHistoryReal } from "/@/api/well";

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
  }
});

const legend_selected = {
  混浆密度: true,
  A泵压力: true,
  B泵压力: true,
  A泵瞬时排量: true,
  B泵瞬时排量: true,
  双泵瞬时排量: true,
  清水瞬时流量: true,
  A泵泵替瞬时排量: true,
  B泵泵替瞬时排量: true,
  A泵累计排量: true,
  B泵累计排量: true,
  双泵累计排量: true,
  清水累计排量: true,
  A泵泵替累计流量: true,
  B泵泵替累计流量: true
};

const legend_data = [
  { name: "混浆密度" },
  { name: "A泵压力" },
  { name: "B泵压力" },
  { name: "A泵瞬时排量" },
  { name: "B泵瞬时排量" },
  { name: "双泵瞬时排量" },
  { name: "清水瞬时流量" },
  { name: "A泵泵替瞬时排量" },
  { name: "B泵泵替瞬时排量" },
  { name: "A泵累计排量" },
  { name: "B泵累计排量" },
  { name: "双泵累计排量" },
  { name: "清水累计排量" },
  { name: "A泵泵替累计流量" },
  { name: "B泵泵替累计流量" }
];

const dataset_dimensions = [
  "time",
  "md",
  "abyl",
  "bbyl",
  "abll",
  "bbll",
  "zssll",
  "qsll",
  "abdcll",
  "bbdcll",
  "ablj",
  "bblj",
  "zlj",
  "qslj",
  "abdclllj",
  "bbdclllj"
];

const index = ref(props.index);
watch(
  () => props.index,
  val => {
    index.value = val;
  }
);

let chartData = [];

const option = {
  tooltip: {
    show: true,
    trigger: "axis",
    confine: true
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
  color: [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#91cc75",
    "#fac858",
    "#9a60b4",
    "#ea7ccc",
    "#ee6666",
    "#73c0de",
    "#91cc75",
    "#fac858",
    "#9a60b4",
    "#ea7ccc"
  ],
  grid: [
    {
      left: 50,
      top: "7%",
      right: 25,
      height: "16.5%",
      containLabel: false
    },
    {
      left: 50,
      top: "29.5%",
      right: 25,
      height: "16.5%",
      containLabel: false
    },
    {
      left: 50,
      top: "56%",
      right: 25,
      height: "16.5%",
      containLabel: false
    },
    {
      left: 50,
      top: "78%",
      right: 25,
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
      name: "A泵压力",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 1,
      yAxisIndex: 1
    },
    {
      name: "B泵压力",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 1,
      yAxisIndex: 1
    },
    {
      name: "A泵瞬时排量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 2,
      yAxisIndex: 2
    },
    {
      name: "B泵瞬时排量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 2,
      yAxisIndex: 2
    },
    {
      name: "双泵瞬时排量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 2,
      yAxisIndex: 2
    },
    {
      name: "清水瞬时流量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 2,
      yAxisIndex: 2
    },
    {
      name: "A泵泵替瞬时排量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 2,
      yAxisIndex: 2
    },
    {
      name: "B泵泵替瞬时排量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 2,
      yAxisIndex: 2
    },
    {
      name: "A泵累计排量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 3,
      yAxisIndex: 3
    },
    {
      name: "B泵累计排量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 3,
      yAxisIndex: 3
    },
    {
      name: "双泵累计排量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 3,
      yAxisIndex: 3
    },
    {
      name: "清水累计排量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 3,
      yAxisIndex: 3
    },
    {
      name: "A泵泵替累计流量",
      type: "line",
      symbol: "none",
      smooth: true,
      xAxisIndex: 3,
      yAxisIndex: 3
    },
    {
      name: "B泵泵替累计流量",
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
      saveAsImage: {
        show: true
      },
      dataView: {
        show: true,
        optionToContent: function (opt) {
          var dataset = opt.dataset[0].source;
          var series = opt.series;
          var table = `<table style="width:100%;text-align:center;">
            <thead>
              <tr>
                <th>时间</th>
                <th>${series[0].name}</th>
                <th>${series[1].name}</th>
                <th>${series[2].name}</th>
                <th>${series[3].name}</th>
                <th>${series[4].name}</th>
                <th>${series[5].name}</th>
                <th>${series[6].name}</th>
                <th>${series[7].name}</th>
                <th>${series[8].name}</th>
                <th>${series[9].name}</th>
                <th>${series[10].name}</th>
                <th>${series[11].name}</th>
                <th>${series[12].name}</th>
                <th>${series[13].name}</th>
                <th>${series[14].name}</th>
              </tr>
            </thead>`;
          table += `<tbody>`;
          for (var i = 0, l = dataset.length; i < l; i++) {
            table += `<tr>
                <td>${dataset[i].time}</td>
                <td>${dataset[i].md}</td>
                <td>${dataset[i].abyl}</td>
                <td>${dataset[i].bbyl}</td>
                <td>${dataset[i].abll}</td>
                <td>${dataset[i].bbll}</td>
                <td>${dataset[i].zssll}</td>
                <td>${dataset[i].qsll}</td>
                <td>${dataset[i].abdcll}</td>
                <td>${dataset[i].bbdcll}</td>
                <td>${dataset[i].ablj}</td>
                <td>${dataset[i].bblj}</td>
                <td>${dataset[i].zlj}</td>
                <td>${dataset[i].qslj}</td>
                <td>${dataset[i].abdclllj}</td>
                <td>${dataset[i].bbdclllj}</td>
              </tr>`;
          }
          table += "</tbody></table>";
          return table;
        }
      },

      myTool1: {
        show: true,
        title: "获取历史数据",
        icon: "path://M269.05,407.27Q415.66,347.84,477.1,232.91l41.61,9.91q13.83,2-2,11.89l-4,7.92q99.06,95.12,204.09,124.83L701,439q-134.76-53.5-210-148.61-53.5,69.38-101.05,101.05h210V435H376v-31.7Q326.5,437,288.86,450.86Zm340.8,61.43,35.67,23.77q7.89,7.95-5.95,9.91Q598,623.27,564.28,684.67l-47.56-19.82q41.61-73.27,67.37-142.66H330.47V478.6H603.91Z",
        onclick: function () {
          let endTime = "";
          if (chartData.length > 0) {
            endTime = chartData[0].sj;
          }
          getHistoryReal({
            plateNum: props.plateNum,
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
  dataset: {
    dimensions: dataset_dimensions,
    source: chartData
  }
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
  let { data } = await getHistoryReal({
    plateNum: props.plateNum,
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
      option.dataset.source = chartData;
      initEchartInstance();
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
  initEchartInstance();
}

defineExpose({ legend_toggle });
</script>

<template>
  <div :class="'live-line' + props.index" style="width: 100%; height: 65vh" />
</template>
