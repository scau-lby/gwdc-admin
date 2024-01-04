<script setup lang="ts">
import { ECharts } from "echarts";
import echarts from "/@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick, ref, watch } from "vue";
import { tryOnUnmounted } from "@vueuse/core";

// interface TableColumn {
//   label: string;
//   key: string;
//   show: boolean;
//   color: string;
//   value: Number;
// }

let echartInstance: ECharts;

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: ""
  },
  data: {
    type: Array,
    default: () => []
  },
  dataset: {
    type: Array,
    default: () => {
      return [];
    }
  }
});

const index = ref(props.index),
  title = ref(props.title),
  data = ref(props.data),
  tableData = ref([]),
  checked = ref([]),
  color_data = ref([]),
  legend_data = ref([]),
  legend_selected = ref({}),
  series_data = ref([]),
  dataset_data = ref([]);

watch(
  () => props.index,
  val => {
    index.value = val;
  }
);

watch(
  () => props.title,
  val => {
    title.value = val;
  }
);

function rdmRgbaColor(index) {
  const rgbaList = [
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [1, 0, 1, 1],
    [0, 1, 1, 1],
    [1, 1, 0, 1],
    [0, 0, 1, 1]
  ];
  let r = rgbaList[index][0];
  let g = rgbaList[index][1];
  let b = rgbaList[index][2];
  let a = rgbaList[index][3];
  var rgb = 155;
  var c = Math.floor(Math.random() * (255 - rgb) + rgb);
  if (r * g * b == 1) {
    r = Math.floor(Math.random() * 255);
    g = Math.floor(Math.random() * 255);
    b = Math.floor(Math.random() * 255);
  } else if (r + g + b == 0) {
    var t = Math.floor(Math.random() * 255);
    r = t;
    g = t;
    b = t;
  } else {
    r =
      r == 1
        ? Math.floor(Math.random() * (255 - rgb) + rgb)
        : Math.floor(Math.random() * (c / 2));
    g =
      g == 1
        ? Math.floor(Math.random() * (255 - rgb) + rgb)
        : Math.floor(Math.random() * (c / 2));
    b =
      b == 1
        ? Math.floor(Math.random() * (255 - rgb) + rgb)
        : Math.floor(Math.random() * (c / 2));
  }
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

watch(
  () => props.data,
  val => {
    if (val) {
      data.value = val;

      sj_list = [];
      tableData.value = [];
      checked.value = [];
      color_data.value = [];
      legend_data.value = [];
      legend_selected.value = {};
      series_data.value = [];
      dataset_data.value = [];
      option.dataset.source = [];
      echartInstance.setOption(option);

      val.forEach((item, index) => {
        const color = rdmRgbaColor(index);
        tableData.value.push({
          label: item,
          show: ["井口监测", "合并"].indexOf(item) > -1 ? false : true,
          color,
          value: 0
        });
        color_data.value.push(color);
        legend_data.value.push({ name: item });
        if (["井口监测", "合并"].indexOf(item) > -1) {
          legend_selected.value[item] = false;
        } else {
          checked.value.push(item);
          legend_selected.value[item] = true;
        }
        series_data.value.push({
          name: item,
          type: "line",
          seriesLayoutBy: "column",
          smooth: true,
          symbol: "none",
          sampling: "lttb"
        });
      });
      dataset_data.value.push(["时间", ...val]);
      option.color = color_data.value;
      option.legend.data = legend_data.value;
      option.legend.selected = legend_selected.value;
      option.series = series_data.value;
      echartInstance.setOption(option);
    }
  },
  { deep: true }
);
let sj_list = [];
watch(
  () => props.dataset,
  val => {
    if (val) {
      tableData.value.forEach(item => {
        if (item.label == val[1]) item.value = val[2];
      });
      let index = sj_list.indexOf(val[0]);
      if (index == -1) {
        sj_list.push(val[0]);
        if (sj_list.length > 1) {
          sj_list.sort((a, b) => a - b);
        }
        index = sj_list.findIndex(item => item == val[0]);
        let set = [];
        set[0] =
          val[0].slice(8, 10) +
          ":" +
          val[0].slice(10, 12) +
          ":" +
          val[0].slice(12, 14);
        data.value.forEach((item, i) => {
          if (item == val[1]) {
            set[i + 1] = val[2];
          } else {
            set[i + 1] = null;
          }
        });
        dataset_data.value.splice(index, 0, set);
        option.dataset.source.splice(index, 0, set);
        echartInstance.setOption(option);
      } else {
        data.value.forEach((item, i) => {
          if (item == val[1]) {
            dataset_data.value[index][i + 1] = val[2];
            option.dataset.source[index][i + 1] = val[2];
          }
        });
        echartInstance.setOption(option);
      }
    }
  },
  { deep: true }
);

function onCheckedChange(e) {
  checked.value = e;
  tableData.value.forEach((item, index) => {
    if (e.indexOf(item.label) > -1) {
      tableData.value[index].show = true;
      legend_selected.value[item.label] = true;
    } else {
      tableData.value[index].show = false;
      legend_selected.value[item.label] = false;
    }
  });
}
function onColorChange(color, index) {
  tableData.value[index].color = color;
  color_data.value[index] = color;
  option.color = color_data.value;
  echartInstance.setOption(option);
}

// function legend_toggle(value) {
//   const bool = legend_selected[value];
//   legend_selected[value] = !bool;
//   option.legend.selected = legend_selected;
//   echartInstance.setOption(option);
// }

// defineExpose({ legend_toggle });

const option = {
  tooltip: {
    trigger: "axis"
  },
  color: color_data.value,
  legend: {
    show: false,
    selected: legend_selected.value,
    data: legend_data.value
  },
  // color: ["#ff0000", "#00ff00", "#ffff00", "#ff00ff", "#00ffff", "#ee6666"],
  grid: {
    left: 15,
    right: 15,
    bottom: "2%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    type: "value",
    splitLine: {
      //网格线
      show: false
    }
  },
  series: series_data.value,
  dataset: {
    source: dataset_data.value
  }
};

function initEchartInstance() {
  const echartDom = document.querySelector(".line" + props.index);
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
  <div style="width: 100%; height: 100%">
    <el-popover placement="right" :width="200" trigger="click">
      <template #reference>
        <div class="setting">显示设置</div>
      </template>
      <el-checkbox-group v-model="checked" @change="onCheckedChange" :max="5">
        <div v-for="(item, index) in tableData" :key="item.label">
          <el-checkbox :label="item.label" />
          <el-color-picker
            v-model="item.color"
            size="small"
            :teleported="false"
            @change="onColorChange($event, index)"
          />
          <br />
        </div>
      </el-checkbox-group>
    </el-popover>
    <div class="line-title">{{ title }}</div>
    <table style="width: 100%">
      <tr>
        <td
          v-for="item in tableData"
          :key="item.label"
          v-show="item.show"
          :style="{ color: item.color }"
        >
          {{ item.label }}
        </td>
      </tr>
      <tr style="background: #666666">
        <td
          v-for="item in tableData"
          :key="item.key"
          v-show="item.show"
          :style="{ color: item.color }"
        >
          {{ item.value }}
        </td>
      </tr>
    </table>
    <div
      :class="'line' + props.index"
      style="width: 100%; height: calc(100% - 100px)"
    />
  </div>
</template>
<style lang="scss" scoped>
.setting {
  border: 1px solid #ffffff;
  border-radius: 35px;
  padding: 0 10px;
  margin: 7.5px 0;
  line-height: 20px;
  color: #ffffff;
  font-size: 0.6rem;
  cursor: pointer;
  float: right;
}

.line-title {
  text-align: center;
  color: #ffffff;
  font-size: 1rem;
  line-height: 35px;
}

td {
  text-align: center;
}
</style>
