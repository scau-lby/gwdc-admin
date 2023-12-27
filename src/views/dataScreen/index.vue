<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useTrtcStoreHook } from "/@/store/modules/trtc";
import { useRouter } from "vue-router";
import { getToken } from "/@/utils/auth";
// api
import { getOnlineTruckList } from "/@/api/truck";
import { getPreviewUrlByPlatenums } from "/@/api/video";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
// components
import trtcComp from "/@/components/Trtc/index.vue";
import tableComp from "./components/table.vue";
import lineChart from "./components/line.vue";
import svgComp from "./components/svg.vue";
import gaugeChart from "./components/gauge.vue";
import pumpChart from "./components/pump.vue";
import prefixComp from "./components/prefix.vue";
import settingComp from "./components/setting.vue";
import fwComp from "./components/fw.vue";

function onAdd(row) {
  console.log(row);
}

const router = useRouter();
function goBack() {
  router.go(-1);
}

const abdcll = ref(0),
  abdclllj = ref(0),
  qslj = ref(0),
  qsll = ref(0),
  yw = ref(""),
  sjdw = ref(0),
  qqdw = ref(0),
  tszs = ref(0),
  dpzs = ref(0);

let basicList = [],
  wellList = ref([]),
  well_selected = ref(""),
  plateList = ref([]),
  plate_selected = ref("");

function onWellChange(e) {
  well_selected.value = e;
  plateList.value = basicList
    .filter(item => item.wellName == well_selected.value)
    .map(item => item.plateNum);
  plate_selected.value = plateList.value[0];
  if (ws !== null) {
    ws.close();
    ws = null;
  }
  initWebSocket();
}

function onPlateChange(e) {
  plate_selected.value = e;
}

async function getOnline() {
  let { data } = await getOnlineTruckList();
  if (data.length > 0) {
    basicList = data;
    data.forEach(({ wellName }) => {
      if (!wellList.value.includes(wellName)) wellList.value.push(wellName);
    });
    well_selected.value = wellList.value[0];
    plateList.value = data
      .filter(item => item.wellName == well_selected.value)
      .map(item => item.plateNum);
    plate_selected.value = plateList.value[0];

    setTimeout(() => {
      initWebSocket();
    }, 3000);
  }
}

const t1 = ref([]),
  t2 = ref([]),
  t3 = ref([]),
  t4 = ref([]),
  legend_data = ref([]),
  legend_checked_1 = ref([]),
  legend_checked_2 = ref([]),
  legend_checked_3 = ref([]),
  legend_checked_4 = ref([]),
  legend_selected = ref({}),
  series_data = ref([]),
  dataset_data_1 = ref([]),
  dataset_data_2 = ref([]),
  dataset_data_3 = ref([]),
  dataset_data_4 = ref([]);
let basic_data = [];
watch(
  () => plateList.value,
  val => {
    basic_data = [];
    basic_data.push("井口监测");
    basic_data.push("合并");
    t1.value = [];
    t1.value.push({
      key: "md",
      label: "井口监测",
      value: 0,
      show: false,
      color: "#FF0000"
    });
    t1.value.push({
      key: "zmd",
      label: "合并",
      value: 0,
      show: false,
      color: "#00FF00"
    });
    t2.value = [];
    t2.value.push({
      key: "zl",
      label: "井口监测",
      value: 0,
      show: false,
      color: "#FF0000"
    });
    t2.value.push({
      key: "zzl",
      label: "合并",
      value: 0,
      show: false,
      color: "#00FF00"
    });
    t3.value = [];
    t3.value.push({
      key: "yl",
      label: "井口监测",
      value: 0,
      show: false,
      color: "#FF0000"
    });
    t3.value.push({
      key: "zyl",
      label: "合并",
      value: 0,
      show: false,
      color: "#00FF00"
    });
    t4.value = [];
    t4.value.push({
      key: "pl",
      label: "井口监测",
      value: 0,
      show: false,
      color: "#FF0000"
    });
    t4.value.push({
      key: "zpl",
      label: "合并",
      value: 0,
      show: false,
      color: "#00FF00"
    });

    legend_data.value = [];
    legend_data.value.push({ name: "井口监测", color: "#FF0000" });
    legend_data.value.push({ name: "合并", color: "#00FF00" });

    legend_checked_1.value = [];
    // legend_checked_1.value.push("井口监测");
    // legend_checked_1.value.push("合并");

    legend_checked_2.value = [];
    // legend_checked_2.value.push("井口监测");
    // legend_checked_2.value.push("合并");

    legend_checked_3.value = [];
    // legend_checked_3.value.push("井口监测");
    // legend_checked_3.value.push("合并");

    legend_checked_4.value = [];
    // legend_checked_4.value.push("井口监测");
    // legend_checked_4.value.push("合并");

    series_data.value = [];
    series_data.value.push({
      name: "井口监测",
      type: "line",
      seriesLayoutBy: "row",
      smooth: true,
      symbol: "none"
    });
    series_data.value.push({
      name: "合并",
      type: "line",
      seriesLayoutBy: "row",
      smooth: true,
      symbol: "none"
    });

    dataset_data_1.value = [];
    dataset_data_1.value.push(["时间"]);
    dataset_data_1.value.push(["井口监测"]);
    dataset_data_1.value.push(["合并"]);

    dataset_data_2.value = [];
    dataset_data_2.value.push(["时间"]);
    dataset_data_2.value.push(["井口监测"]);
    dataset_data_2.value.push(["合并"]);

    dataset_data_3.value = [];
    dataset_data_3.value.push(["时间"]);
    dataset_data_3.value.push(["井口监测"]);
    dataset_data_3.value.push(["合并"]);

    dataset_data_4.value = [];
    dataset_data_4.value.push(["时间"]);
    dataset_data_4.value.push(["井口监测"]);
    dataset_data_4.value.push(["合并"]);

    legend_selected.value = {};
    legend_selected.value["井口监测"] = false;
    legend_selected.value["合并"] = false;
    val.forEach((item, index) => {
      const randomColor = rdmRgbaColor(index);
      basic_data.push(item);
      t1.value.push({
        key: `s_${index}`,
        label: `${item}`,
        value: 0,
        show: true,
        color: randomColor
      });
      t2.value.push({
        key: `s_${index}`,
        label: `${item}`,
        value: 0,
        show: true,
        color: randomColor
      });
      t3.value.push({
        key: `s_${index}`,
        label: `${item}`,
        value: 0,
        show: true,
        color: randomColor
      });
      t4.value.push({
        key: `s_${index}`,
        label: `${item}`,
        value: 0,
        show: true,
        color: randomColor
      });
      legend_data.value.push({
        name: item,
        color: randomColor
      });
      legend_checked_1.value.push(item);
      legend_checked_2.value.push(item);
      legend_checked_3.value.push(item);
      legend_checked_4.value.push(item);
      series_data.value.push({
        name: item,
        type: "line",
        seriesLayoutBy: "row",
        smooth: true,
        symbol: "none"
      });
      dataset_data_1.value.push([item]);
      dataset_data_2.value.push([item]);
      dataset_data_3.value.push([item]);
      dataset_data_4.value.push([item]);
      legend_selected.value[item] = true;
    });
  },
  { deep: true }
);

function rdmRgbaColor(index) {
  const rgbaList = [
    [1, 0, 1, 1],
    [0, 1, 1, 1],
    [1, 1, 0, 1],
    [0, 0, 1, 1],
    [1, 0, 0, 1],
    [0, 1, 0, 1]
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

function onLegendCheckedChange(e) {
  const type = e[0], // 1 legend_checked 改变 2 color 改变
    index = e[1][0],
    value = e[1][1];
  let data;
  if (type == 1) {
    switch (index) {
      case 1:
        legend_checked_1.value = value;
        data = t1.value;
        t1.value = data.map(item => {
          if (value.includes(item.label)) {
            item.show = true;
            return item;
          } else {
            item.show = false;
            return item;
          }
        });
        break;
      case 2:
        legend_checked_2.value = value;
        data = t2.value;
        t2.value = data.map(item => {
          if (value.includes(item.label)) {
            item.show = true;
            return item;
          } else {
            item.show = false;
            return item;
          }
        });
        break;
      case 3:
        legend_checked_3.value = value;
        data = t3.value;
        t3.value = data.map(item => {
          if (value.includes(item.label)) {
            item.show = true;
            return item;
          } else {
            item.show = false;
            return item;
          }
        });
        break;
      case 4:
        legend_checked_4.value = value;
        data = t4.value;
        t4.value = data.map(item => {
          if (value.includes(item.label)) {
            item.show = true;
            return item;
          } else {
            item.show = false;
            return item;
          }
        });
        break;
    }
  } else if (type == 2) {
    legend_data.value[index].color = value;
    t1.value[index].color = value;
    t2.value[index].color = value;
    t3.value[index].color = value;
    t4.value[index].color = value;
  }
}

// 和服务端连接的socket对象
let ws = null,
  connected = ref(false);

function initWebSocket() {
  if (!window.WebSocket) {
    return console.log("您的浏览器不支持WebSocket");
  }
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }
  let url = `wss://cemrm.gwdc.com.cn:7002/truck/real/ws?token=${accessToken}`;
  ws = new WebSocket(url);
  ws.onopen = () => {
    connected.value = true;
    const send_data = {
      plateNums: plateList.value,
      mixed: 0,
      unit: 0
    };
    ws.send(JSON.stringify(send_data));
  };

  ws.onclose = () => {
    console.log("断开链接");
    connected.value = false;
  };

  ws.onmessage = msg => {
    const res = JSON.parse(msg.data);
    const data = res.data;
    if (data.sj) {
      if (res.plateNum == plate_selected.value) {
        // svg
        abdcll.value = data.abdcll;
        abdclllj.value = data.abdclllj;
        qsll.value = data.qsll;
        qslj.value = data.qslj;
        yw.value = data.yw > 0 ? data.yw.toFixed(0) + "%" : "0%";
        // 档位表
        sjdw.value = data.apbsxdw;
        qqdw.value = data.apbsxqqdw;
        // 转速表
        tszs.value = data.apfdjzs;
        dpzs.value = data.dpfdjzs;
        // 灰水阀调整
        tableData5.value[0].kd =
          data.hffw > 0 ? data.hffw.toFixed(0) + "%" : "0";
        tableData5.value[1].kd =
          data.sffw > 0 ? data.sffw.toFixed(0) + "%" : "0";
      }

      const basic_index = basic_data.findIndex(item => item == res.plateNum);
      t1.value[basic_index].value = data.md;
      t2.value[basic_index].value = data.zlj;
      t3.value[basic_index].value = data.abyl;
      t4.value[basic_index].value = data.zssll;

      const sj_index = dataset_data_1.value[0].findIndex(
        item => item == data.sj
      );
      console.log(sj_index);
      console.log(res.plateNum, data.md);
      if (sj_index == -1) {
        const sj = data.sj.slice(10, 12) + ":" + data.sj.slice(12, 14);
        dataset_data_1.value[0].push(sj);
        dataset_data_2.value[0].push(sj);
        dataset_data_3.value[0].push(sj);
        dataset_data_4.value[0].push(sj);
        basic_data.forEach((item, i) => {
          if (i == basic_index) {
            dataset_data_1.value[i + 1].push(data.md);
            dataset_data_2.value[i + 1].push(data.zlj);
            dataset_data_3.value[i + 1].push(data.abyl);
            dataset_data_4.value[i + 1].push(data.zssll);
          } else {
            const length = dataset_data_1.value[i + 1].length;
            dataset_data_1.value[i + 1].push(
              dataset_data_1.value[i + 1][length - 1]
            );
            dataset_data_2.value[i + 1].push(
              dataset_data_2.value[i + 1][length - 1]
            );
            dataset_data_3.value[i + 1].push(
              dataset_data_3.value[i + 1][length - 1]
            );
            dataset_data_4.value[i + 1].push(
              dataset_data_4.value[i + 1][length - 1]
            );
          }
        });
      } else {
        basic_data.forEach((item, i) => {
          if (i == basic_index) {
            dataset_data_1.value[i + 1] = data.md;
            dataset_data_2.value[i + 1] = data.zlj;
            dataset_data_3.value[i + 1] = data.abyl;
            dataset_data_4.value[i + 1] = data.zssll;
          }
        });
      }
    }
  };
}
// function clean(params: object) {
//   const res = {};
//   for (var i in params) {
//     if (params[i] != 0 && ["jd", "wd", "sj", "flag"].indexOf(i) === -1) {
//       if (i === "md" && parseFloat(params[i]) < 0) {
//         res[i] = 0;
//       } else {
//         res[i] = parseFloat(params[i]).toFixed(3);
//       }
//     } else if (i === "sj") {
//       // res[i] =
//       //   params[i].slice(8, 10) +
//       //   ":" +
//       //   params[i].slice(10, 12) +
//       //   ":" +
//       //   params[i].slice(12, 14);
//       res[i] = params[i].slice(10, 12) + ":" + params[i].slice(12, 14);
//     } else {
//       res[i] = params[i];
//     }
//   }
//   return res;
// }

// h5player
let player = null,
  playing = ref(true);
function init() {
  window.addEventListener("resize", () => {
    player.JS_Resize();
  });
}
function createPlayer() {
  player = new window.JSPlugin({
    szId: "player",
    szBasePath: "./",
    iMaxSplit: 4,
    iCurrentSplit: 1,
    openDebug: true,
    oStyle: {
      borderSelect: "#FFCC00"
    }
  });
}
// 开始播放
function startPlay() {
  getPreviewUrlByPlatenums({
    plateNums: plateList.value.join(","),
    wellName: well_selected.value,
    wellType: basicList.filter(item => item.wellName == well_selected.value)[0]
      .wellType
  }).then(({ data }) => {
    console.log(data);
  });
}
// 停止播放
function stopPlay() {}
// 整体全屏
function wholeFullScreen() {
  player.JS_FullScreenDisplay(true).then(
    () => {},
    e => {
      console.error(e);
    }
  );
}

const timer = ref(null),
  curr_time = ref("");

function getCurrTime() {
  const time = new Date();
  const y = time.getFullYear();
  const m =
    time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + time.getMonth() + 1;
  const d = time.getDate() > 9 ? time.getDate() : "0" + time.getDate();
  const W = time.getDay();
  const h = time.getHours() > 9 ? time.getHours() : "0" + time.getHours();
  const i = time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes();
  const s = time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds();

  const week = ["日", "一", "二", "三", "四", "五", "六"];
  const w = week[W];
  curr_time.value =
    y + "/" + m + "/" + d + " 星期" + w + " " + h + ":" + i + ":" + s;
}
onMounted(() => {
  getOnline();
  getCurrTime();
  timer.value = setInterval(() => {
    getCurrTime();
  }, 1000);
  init();
  createPlayer();
});
onBeforeUnmount(() => {
  timer.value = null;
  if (ws !== null) {
    ws.close();
    ws = null;
  }
});
// import { gsap } from "gsap";
// import { nextTick } from "vue";
// let tl = null;
// nextTick(() => {
//   tl = gsap.timeline();
//   // tl.to("#sup_x5F_pump_x5F_in_2_", { rotation: 360, repeat: infinite });

//   // setTimeout(() => {
//   //   document.getElementById("tyw1").innerHTML = '30%';
//   // }, 1000)

//   tl.to("#st6_1", { scaleY: 0.5, duration: 1 });
//   tl.to("#st6_2", { scaleY: 0.8, duration: 1 });
//   tl.to("#st17", { scaleY: 0.3, duration: 1 });
//   setTimeout(() => {
//     document.getElementById("B罐液位_1_").innerHTML = "50%";
//   }, 2000);
//   setTimeout(() => {
//     document.getElementById("A罐液位_1_").innerHTML = "80%";
//   }, 3000);
// });
// const restart = () => {
//   document.getElementById("V9_x5F_line_x5F_2_2_").classList.add("green");
//   setTimeout(() => {
//     document.getElementById("V9_x5F_line_x5F_2_2_").classList.remove("green");
//   }, 2000);

//   tl.restart();
// };

const tableData = ref([]);
tableData.value = [
  {
    name: "注前置液",
    sjmd: "",
    sjsspl: "",
    sjljzl: ""
  },
  {
    name: "注领浆",
    sjmd: "",
    sjsspl: "",
    sjljzl: ""
  },
  {
    name: "注中间浆",
    sjmd: "",
    sjsspl: "",
    sjljzl: ""
  },
  {
    name: "注尾桨",
    sjmd: "",
    sjsspl: "",
    sjljzl: ""
  },
  {
    name: "注洗管线",
    sjmd: "",
    sjsspl: "",
    sjljzl: ""
  },
  {
    name: "释放胶塞",
    sjmd: "",
    sjsspl: "",
    sjljzl: ""
  },
  {
    name: "注压塞液",
    sjmd: "",
    sjsspl: "",
    sjljzl: ""
  }
];

const tableData2 = ref([]);
tableData2.value = [
  {
    name: "密度",
    jcz: 1.352,
    sjz: 1.35
  },
  {
    name: "瞬时排量",
    jcz: 1.201,
    sjz: 1.2
  },
  {
    name: "累计排量",
    jcz: 13.32,
    sjz: 20
  },
  {
    name: "压力/超压保护",
    jcz: 13.12,
    sjz: 20
  }
];

const tableData3 = ref([]);
tableData3.value = [
  {
    yhmd: 1.45,
    yhyw: "35%",
    sfkd: "30%",
    hfkd: "25%"
  }
];

const tableData4 = ref([]);
tableData4.value = [
  {
    name: "喷射泵",
    kd: "50%",
    yy: "3.2MPa"
  },
  {
    name: "循环泵",
    kd: "50%",
    yy: "3.2MPa"
  },
  {
    name: "供水泵",
    kd: "50%",
    yy: "3.2MPa"
  },
  {
    name: "搅拌器",
    kd: "65%",
    yy: "3.7MPa"
  }
];

const tableData5 = ref([]);
tableData5.value = [
  {
    name: "灰阀",
    kd: "0"
  },
  {
    name: "水阀",
    kd: "0"
  },
  {
    name: "消泡剂",
    kd: "0"
  }
];

// trtc 实时音视频
const store = useTrtcStoreHook();
const trtcRef = ref(null);
function handleJoin() {
  trtcRef.value.handleJoin();
}
function handleLeave() {
  trtcRef.value.handleLeave();
}
const index = new Date().getTime();
</script>
<template>
  <div class="databoard-container">
    <div class="page-header">
      <div class="timer">
        {{ curr_time }}
        <el-button type="primary" style="margin-left: 20px" @click="goBack">
          返回
        </el-button>
      </div>
      <div class="page-title">长城固井作业远程监控一体化平台</div>
      <div class="page-subtitle">
        Remote monitoring platform for cementing operations
      </div>
    </div>
    <div class="page-content">
      <div class="page-aside">
        <div class="line-container">
          <settingComp
            :index="1"
            :data="legend_data"
            :checked="legend_checked_1"
            @change="onLegendCheckedChange"
          />
          <div class="line-title">水泥浆密度监控曲线(g/cm³)</div>

          <tableComp :data="t1" />
          <div style="width: 100%; height: calc(100% - 90px)">
            <lineChart
              :index="index + 1"
              :legend_data="legend_data"
              :legend_selected="legend_selected"
              :series="series_data"
              :dataset="dataset_data_1"
            />
          </div>
        </div>
        <div class="line-container">
          <settingComp
            :index="2"
            :data="legend_data"
            :checked="legend_checked_2"
            @change="onLegendCheckedChange"
          />
          <div class="line-title">累计排量监控曲线(m³)</div>
          <tableComp :data="t2" />
          <div style="width: 100%; height: calc(100% - 90px)">
            <lineChart
              :index="index + 2"
              :legend_data="legend_data"
              :legend_selected="legend_selected"
              :series="series_data"
              :dataset="dataset_data_2"
            />
          </div>
        </div>
        <div class="bottom">
          <div id="player" style="width: 100%; height: calc(100% - 30px)" />
          <div class="player-footer">
            <el-link
              :underline="false"
              :icon="useRenderIcon('play-fill')"
              @click="startPlay"
              v-if="playing"
            />
            <el-link
              :underline="false"
              :icon="useRenderIcon('stop-fill')"
              @click="stopPlay"
              v-else
            />
            <el-tooltip effect="light" content="整体全屏">
              <el-link
                :underline="false"
                :icon="useRenderIcon('full-screen')"
                @click="wholeFullScreen"
              />
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="page-main">
        <div class="svg-container">
          <div class="select-container">
            作业井号
            <el-select
              v-model="well_selected"
              placeholder="请选择作业井号"
              @change="onWellChange"
              size="small"
            >
              <el-option
                v-for="(item, index) in wellList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
            <br />
            当前设备
            <el-select
              v-model="plate_selected"
              placeholder="请选择设备编号"
              @change="onPlateChange"
              size="small"
            >
              <el-option
                v-for="(item, index) in plateList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
          <svgComp
            :abdcll="abdcll"
            :abdclllj="abdclllj"
            :qslj="qslj"
            :qsll="qsll"
            :yw="yw"
          />
          <div class="op-container">
            <el-button round type="success" size="small">自动排量</el-button>
            <el-button round type="success" size="small">取力开关</el-button>
            <el-button round type="success" size="small">润滑设置</el-button>
            <el-button round type="success" size="small">喇叭开关</el-button>
            <el-button round type="danger" size="small">试压</el-button>
            <el-button round type="primary" size="small">泄压</el-button>
            <el-button round type="info" size="small">超压复位</el-button>
          </div>
        </div>
        <el-carousel type="card" height="260px" :autoplay="false">
          <el-carousel-item>
            <div class="gauge-container">
              <gaugeChart :index="index" :data1="tszs" :data2="dpzs" />
              <div class="adjust-op" style="margin-left: calc(22% - 100px)">
                <IconifyIconOffline icon="caret-top" />
                台上转速
                <IconifyIconOffline icon="caret-bottom" />
              </div>
              <div class="gears-container">
                <div class="gears" style="color: #ffffff">{{ sjdw }}</div>
                <div class="gears" style="color: #ff0000">{{ qqdw }}</div>
              </div>
              <div class="adjust-op" style="margin-left: calc(50% - 100px)">
                <IconifyIconOffline icon="caret-top" />
                台上档位
                <IconifyIconOffline icon="caret-bottom" />
              </div>
              <div class="adjust-op" style="margin-left: calc(78% - 100px)">
                <IconifyIconOffline icon="caret-top" />
                底盘转速
                <IconifyIconOffline icon="caret-bottom" />
              </div>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <div class="gauge-container">
              <pumpChart
                :index="index + 1"
                :data1="50"
                :name1="'3.2Mpa'"
                :data2="50"
                :name2="'3.2Mpa'"
                :data3="50"
                :name3="'3.2Mpa'"
              />
              <div class="adjust-op" style="margin-left: calc(18% - 100px)">
                <IconifyIconOffline icon="caret-top" />
                喷射泵
                <IconifyIconOffline icon="caret-bottom" />
              </div>
              <div class="adjust-op" style="margin-left: calc(50% - 100px)">
                <IconifyIconOffline icon="caret-top" />
                循环泵
                <IconifyIconOffline icon="caret-bottom" />
              </div>
              <div class="adjust-op" style="margin-left: calc(82% - 100px)">
                <IconifyIconOffline icon="caret-top" />
                供水泵
                <IconifyIconOffline icon="caret-bottom" />
              </div>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <prefixComp :data="tableData3" />
          </el-carousel-item>
          <el-carousel-item>
            <el-scrollbar max-height="260px">
              <h5 class="table-title">固井作业设计</h5>
              <el-table
                :data="tableData"
                size="small"
                border
                fit
                style="width: 100%"
                :header-cell-style="{
                  background: '#009f6b',
                  color: '#ffffff'
                }"
              >
                <el-table-column type="index" label="序号" align="center" />
                <el-table-column prop="name" label="设计名称" />
                <el-table-column prop="sjmd" label="设计密度" />
                <el-table-column
                  prop="sjsspl"
                  label="设计瞬时排量"
                  width="105"
                />
                <el-table-column
                  prop="sjljzl"
                  label="设计累计总量"
                  width="105"
                />
              </el-table>
              <h5 class="table-title">预混参数设置</h5>
              <el-table
                :data="tableData3"
                size="small"
                border
                fit
                style="width: 100%"
                :header-cell-style="{
                  background: '#009f6b',
                  color: '#ffffff'
                }"
              >
                <el-table-column prop="yhmd" label="预混密度" />
                <el-table-column prop="yhyw" label="预混液位" />
                <el-table-column prop="sfkd" label="水阀开度" />
                <el-table-column prop="hfkd" label="灰阀开度" />
              </el-table>
            </el-scrollbar>
          </el-carousel-item>
          <el-carousel-item>
            <div style="width: 100%">
              <h5 class="table-title">作业参数调整</h5>
              <el-table
                :data="tableData2"
                size="small"
                border
                fit
                style="width: 100%"
                :header-cell-style="{
                  background: '#009f6b',
                  color: '#ffffff'
                }"
              >
                <el-table-column prop="name" label="项目" width="110" />
                <el-table-column prop="sjz" label="设计值" />
                <el-table-column prop="jcz" label="监测值" />
                <el-table-column label="调整" align="center" width="60">
                  <template #default="scope">
                    <div class="flex-around">
                      <IconifyIconOffline
                        icon="caret-top"
                        @click="onAdd(scope.row)"
                      />
                      <IconifyIconOffline icon="caret-bottom" />
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <fwComp :data="tableData5" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="page-aside">
        <div class="line-container">
          <settingComp
            :index="3"
            :data="legend_data"
            :checked="legend_checked_3"
            @change="onLegendCheckedChange"
          />
          <div class="line-title">施工压力监控曲线(MPa)</div>
          <tableComp :data="t3" />
          <div style="width: 100%; height: calc(100% - 90px)">
            <lineChart
              :index="index + 3"
              :legend_data="legend_data"
              :legend_selected="legend_selected"
              :series="series_data"
              :dataset="dataset_data_3"
            />
          </div>
        </div>
        <div class="line-container">
          <settingComp
            :index="4"
            :data="legend_data"
            :checked="legend_checked_4"
            @change="onLegendCheckedChange"
          />
          <div class="line-title">瞬时排量监控曲线(m³/min)</div>
          <tableComp :data="t4" />
          <div style="width: 100%; height: calc(100% - 90px)">
            <lineChart
              :index="index + 4"
              :legend_data="legend_data"
              :legend_selected="legend_selected"
              :series="series_data"
              :dataset="dataset_data_4"
            />
          </div>
        </div>
        <div class="bottom" style="background: #000">
          <div
            style="
              width: 100%;
              height: calc(100% - 30px);
              border: 1px solid rgb(255, 204, 0);
            "
          >
            <trtcComp ref="trtcRef" :width="120" />
          </div>
          <div class="player-footer">
            <el-link
              v-if="store.isJoined"
              :underline="false"
              :icon="useRenderIcon('mute')"
              @click="handleLeave"
            />
            <el-link
              v-else
              :underline="false"
              :icon="useRenderIcon('microphone')"
              @click="handleJoin"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-size: 0.9rem;
}

.databoard-container {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  background: url("./bg.png");
  background-size: 100% 100%;
}

.page-header {
  width: 100%;
  height: 60px;

  .page-title,
  .page-subtitle {
    color: #ffffff;
    text-align: center;
  }

  .page-title {
    font-size: 20px;
    padding-top: 5px;
  }

  .timer {
    position: absolute;
    right: 0;
    margin-right: 50px;
    margin-top: 30px;
    color: #ffffff;
  }
}

.page-content {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  justify-content: space-between;
  padding: 0 5px 5px;
}

.green {
  stroke: green !important;
}

.page-aside {
  max-width: 500px;
  width: 25%;
  display: flex;
  flex-direction: column;

  .line-container {
    // border: 1px solid #021fd3;
    padding: 0 5px;
    min-height: 275px;
    flex: 1;
    background: rgba(0, 0, 0, 0.1);
  }

  .line-container + .line-container {
    margin-top: 5px;
  }

  .bottom {
    margin-top: 5px;
    width: 100%;
    position: relative;
    min-height: 300px;
  }

  .player-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 5px;
    height: 30px;
    line-height: 30px;
    background: #0f0f0f;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    z-index: 9999;
    border: 1px solid rgb(255, 204, 0);
    border-top: none;
  }

  .el-link {
    color: #ffffff;
  }

  .line-title {
    text-align: center;
    color: #ffffff;
    font-size: 1rem;
    line-height: 35px;
  }

  .setting {
    border: 1px solid #ffffff;
    border-radius: 35px;
    padding: 0 10px;
    margin: 7.5px 0;
    line-height: 20px;
    color: #ffffff;
    font-size: 0.6rem;
    float: right;
    cursor: pointer;
  }
}

.page-main {
  flex: 1;
  position: relative;
  padding: 0 5px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
}

.svg-container {
  position: relative;
  margin-top: -20px;
  flex-shrink: 1;
  flex-grow: 1;
}

.select-container {
  position: absolute;
  top: 20px;
  left: 5px;
}

.op-container {
  position: absolute;
  bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.middle-bottom {
  margin-top: -50px;
  height: 450px;
  overflow-y: auto;
  z-index: 999;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-around {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}

.column {
  flex-direction: column;
}

.gauge-container {
  width: 100%;
  height: 100%;
  position: relative;

  .gears-container {
    width: 60px;
    position: absolute;
    top: 20%;
    margin-left: calc(50% - 30px);
    border-radius: 5px;
    box-shadow: 0px 0px 17px 8px rgba(150, 150, 150, 0.22);

    .gears {
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background: #000000;
      font-size: 30px;
      // border: 2px solid #202020;
    }
  }

  .adjust-op {
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 10px;
    color: #ffffff;
    font-size: 16px;
  }
}

.table-title {
  line-height: 30px;
  text-align: center;
}

.el-carousel__item.is-active {
  background-color: #000000;
}

:deep(.el-table) {
  --el-table-border-color: #595959;
  --el-table-row-hover-bg-color: transparent;
  background-color: transparent !important;
  border-color: #595959 !important;
}

:deep(.el-table__expanded-cell) {
  background-color: transparent !important;
}

:deep(.el-table tr, .el-table td) {
  background: transparent !important;
  color: #ffffff;
}
</style>
