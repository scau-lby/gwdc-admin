<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, inject } from "vue";
import { useRouter } from "vue-router";
import { getToken } from "/@/utils/auth";
import { getOnlineTruckList } from "/@/api/truck";
import { getPreviewUrlByPlatenums } from "/@/api/video";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

const router = useRouter();

function goBack() {
  router.go(-1);
}

import lineChart from "./line.vue";
import gaugeChart from "./gauge.vue";

let basicList = [],
  wellList = ref([]),
  well_selected = ref(""),
  plateList = ref([]),
  plate_checked = ref([]),
  plate_selected = ref("");

let t1 = ref([]),
  t2 = ref([]),
  t3 = ref([]),
  t4 = ref([]);

function onWellChange(e) {
  well_selected.value = e;
  plateList.value = basicList
    .filter(item => item.wellName == well_selected.value)
    .map(item => item.plateNum);
  plate_checked.value = plateList.value;
  plate_selected.value = plateList.value[0];
}

function onPlateChange(e) {
  plate_selected.value = e;
}

async function getOnline() {
  let { data } = await getOnlineTruckList();
  if (data.length > 0) {
    basicList = data;
    wellList.value = data.map(({ wellName }) => {
      if (!wellList.value.includes(wellName)) return wellName;
    });
    well_selected.value = wellList.value[0];
    plateList.value = data
      .filter(item => item.wellName == well_selected.value)
      .map(item => item.plateNum);
    plate_checked.value = plateList.value;
    plate_selected.value = plateList.value[0];
    initWebSocket();
  }
}

watch(
  () => well_selected.value,
  () => {
    t1.value = [];
    t1.value.push({
      key: "md",
      label: "井口监测密度",
      value: 0,
      show: true
    });
    t1.value.push({
      key: "zmd",
      label: "合并密度",
      value: 0,
      show: true
    });
    t2.value = [];
    t2.value.push({
      key: "zl",
      label: "井口监测总量",
      value: 0,
      show: true
    });
    t2.value.push({
      key: "zzl",
      label: "合并总量",
      value: 0,
      show: true
    });
    t3.value = [];
    t3.value.push({
      key: "yl",
      label: "井口监测压力",
      value: 0,
      show: true
    });
    t3.value.push({
      key: "zyl",
      label: "合并压力",
      value: 0,
      show: true
    });
    t4.value = [];
    t4.value.push({
      key: "pl",
      label: "井口监测排量",
      value: 0,
      show: true
    });
    t4.value.push({
      key: "zpl",
      label: "合并排量",
      value: 0,
      show: true
    });

    plate_checked.value.forEach((item, index) => {
      t1.value.push({
        key: `s_${index}`,
        label: `${item}密度`,
        value: 0,
        show: true
      });
      t2.value.push({
        key: `s_${index}`,
        label: `${item}总量`,
        value: 0,
        show: true
      });
      t3.value.push({
        key: `s_${index}`,
        label: `${item}压力`,
        value: 0,
        show: true
      });
      t4.value.push({
        key: `s_${index}`,
        label: `${item}排量`,
        value: 0,
        show: true
      });
    });
  },
  { deep: true }
);

const legend_data = ref([]),
  legend_checked_1 = ref([]),
  legend_checked_2 = ref([]),
  legend_checked_3 = ref([]),
  legend_checked_4 = ref([]),
  legend_selected = ref({}),
  series_data = ref([]),
  xAxis_data = ref("");
watch(
  () => plateList.value,
  val => {
    legend_data.value = [];
    legend_data.value.push({ name: "井口监测" });
    legend_data.value.push({ name: "合并" });

    legend_checked_1.value = [];
    legend_checked_1.value.push("井口监测");
    legend_checked_1.value.push("合并");

    legend_checked_2.value = [];
    legend_checked_2.value.push("井口监测");
    legend_checked_2.value.push("合并");

    legend_checked_3.value = [];
    legend_checked_3.value.push("井口监测");
    legend_checked_3.value.push("合并");

    legend_checked_4.value = [];
    legend_checked_4.value.push("井口监测");
    legend_checked_4.value.push("合并");

    series_data.value = [];
    series_data.value.push({ name: "井口监测", type: "line", data: [] });
    series_data.value.push({ name: "合并", type: "line", data: [] });

    legend_selected.value = {};
    legend_selected.value["井口监测"] = true;
    legend_selected.value["合并"] = true;
    val.forEach(item => {
      legend_data.value.push({ name: item });
      legend_checked_1.value.push(item);
      legend_checked_2.value.push(item);
      legend_checked_3.value.push(item);
      legend_checked_4.value.push(item);
      series_data.value.push({ name: item, type: "line", data: [] });
      legend_selected.value[item] = true;
    });
  },
  { deep: true }
);

function onLegendCheckedChange_1(e) {
  console.log(e);
  legend_checked_1.value = e;
  const data = t1.value;
  t1.value = data.map(item => {
    if (e.includes(item.label.replace("密度", ""))) {
      item.show = true;
      return item;
    } else {
      item.show = false;
      return item;
    }
  });
  console.log(t1.value);
}

function onLegendCheckedChange_2(e) {
  legend_checked_2.value = e;
  const data = t2.value;
  t2.value = data.map(item => {
    if (e.includes(item.label.replace("总量", ""))) {
      item.show = true;
      return item;
    } else {
      item.show = false;
      return item;
    }
  });
  console.log(t2.value);
}

function onLegendCheckedChange_3(e) {
  legend_checked_3.value = e;
  const data = t3.value;
  t3.value = data.map(item => {
    if (e.includes(item.label.replace("压力", ""))) {
      item.show = true;
      return item;
    } else {
      item.show = false;
      return item;
    }
  });
  console.log(t3.value);
}

function onLegendCheckedChange_4(e) {
  legend_checked_4.value = e;
  const data = t4.value;
  t4.value = data.map(item => {
    if (e.includes(item.label.replace("排量", ""))) {
      item.show = true;
      return item;
    } else {
      item.show = false;
      return item;
    }
  });
  console.log(t4.value);
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
    console.log(res);
    clean({});
    // if (res.plate) {
    // }
  };
}
function clean(params: object) {
  const res = {};
  for (var i in params) {
    if (params[i] != 0 && ["jd", "wd", "sj", "flag"].indexOf(i) === -1) {
      res[i] = parseFloat(params[i]).toFixed(3);
      if (i === "md" && parseFloat(params[i]) < 0) {
        res[i] = 0;
      }
    } else {
      res[i] = params[i];
    }
  }
  return res;
}

let timer = ref(null),
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

onMounted(() => {
  getOnline();
  getCurrTime();
  timer.value = setInterval(() => {
    getCurrTime();
    // xAxis_data.value = new Date().getSeconds().toString();
  }, 1000);
  init();
  createPlayer();

  // test
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

import { copyText } from "vue3-clipboard";
import { ElMessage, ElNotification } from "element-plus";
import TRTC, { Client, LocalStream } from "trtc-js-sdk";
import { useTrtcStoreHook } from "/@/store/modules/trtc";
import { getParamKey } from "/@/utils/utils";
import { dismissRoom } from "/@/api/rtc";
import Player from "../realtime/Player.vue";

const store = useTrtcStoreHook();
const inviteLink = ref<string>();
const $bus = inject("$bus");
const $aegis: any = inject("$aegis");
store.$patch({
  sdkAppId: getParamKey("sdkAppId"),
  secretKey: getParamKey("secretKey"),
  userId: getParamKey("userId"),
  roomId: getParamKey("roomId")
});

let localClient: Client;
let localStream: LocalStream;

const audioMuted = ref(false);
const videoMuted = ref(false);
// let shareClient: any;

const muteAudio = () => {
  if (!audioMuted.value) {
    localStream.muteAudio();
    audioMuted.value = true;
  } else {
    localStream.unmuteAudio();
    audioMuted.value = false;
  }
};

const muteVideo = () => {
  if (!videoMuted.value) {
    localStream.muteVideo();
    videoMuted.value = true;
  } else {
    localStream.unmuteVideo();
    videoMuted.value = false;
  }
};

const addSuccessLog = (str: string) => {
  store.logs.push({
    type: "success",
    content: str
  });
  ElNotification({
    message: str,
    type: "success"
  });
};

const addFailedLog = (str: string) => {
  store.logs.push({
    type: "failed",
    content: str
  });
  ElNotification({
    message: str,
    type: "error"
  });
};

async function handleJoin() {
  if (!store.getInitParamsStates()) {
    ElMessage({ message: t("trtc.paramsNeed"), type: "error" });
    return;
  }
  const userSig = store.getUserSig();
  // console.log(parseInt(store.sdkAppId, 10), store.userId, userSig);
  try {
    localClient = TRTC.createClient({
      mode: "rtc",
      sdkAppId: parseInt(store.sdkAppId, 10),
      userId: store.userId,
      userSig
    });

    addSuccessLog(`Client [${store.userId}] created`);
    installEventHandlers();
    await localClient.join({ roomId: parseInt(store.roomId, 10) });
    store.isJoined = true;
    inviteLink.value = store.createShareLink();
    addSuccessLog(`Join room [${store.roomId}] success`);
    $aegis.reportEvent({
      name: "joinRoom",
      ext1: "joinRoom-success",
      ext2: "webrtcQuickDemoVue3",
      ext3: store.sdkAppId
    });
  } catch (error: any) {
    addFailedLog(
      `Join room ${store.roomId} failed, please check your params. Error: ${error.message_}`
    );
    $aegis.reportEvent({
      name: "joinRoom",
      ext1: `joinRoom-failed#${store.roomId}*${store.userId}*${error.message_}`,
      ext2: "webrtcQuickDemoVue3",
      ext3: store.sdkAppId
    });
  }

  await createLocalStream();
  await handlePublish();
}

async function createLocalStream() {
  try {
    localStream = TRTC.createStream({
      userId: store.userId,
      audio: true,
      video: true,
      cameraId: store.videoDeviceId,
      microphoneId: store.audioDeviceId
    });
    localStream.setVideoProfile("480p");

    await localStream.initialize();
    addSuccessLog(`LocalStream [${store.userId}] initialized`);

    localStream
      .play("local")
      .then(() => {
        addLocalControlView();
        addSuccessLog(`LocalStream [${store.userId}] playing`);
      })
      .catch(e => {
        addFailedLog(
          `LocalStream [${store.userId}] failed to play. Error: ${e.message_}`
        );
      });
  } catch (error: any) {
    addFailedLog(`LocalStream failed to initialize. Error: ${error.message_}`);
  }
}

function addLocalControlView() {
  console.log("addLocalControlView");
}

async function handlePublish() {
  if (!store.isJoined) {
    ElMessage({
      message: "call publish()- please join() firstly",
      type: "warning"
    });
    return;
  }
  if (store.isPublished) {
    ElMessage({ message: "duplicate publish() observed", type: "warning" });
    return;
  }

  try {
    await localClient.publish(localStream);
    addSuccessLog("LocalStream is published successfully");
    store.isPublished = true;
    $aegis.reportEvent({
      name: "publish",
      ext1: "publish-success",
      ext2: "webrtcQuickDemoVue3",
      ext3: store.sdkAppId
    });
  } catch (error: any) {
    addFailedLog(`LocalStream is failed to publish. Error: ${error.message_}`);
    $aegis.reportEvent({
      name: "publish",
      ext1: `publish-failed#${store.roomId}*${store.userId}*${error.message_}`,
      ext2: "webrtcQuickDemoVue3",
      ext3: store.sdkAppId
    });
  }
}

function installEventHandlers() {
  if (!localClient) {
    return;
  }
  localClient.on("error", handleError);
  localClient.on("client-banned", handleBanned);
  localClient.on("peer-join", handlePeerJoin);
  localClient.on("peer-leave", handlePeerLeave);
  localClient.on("stream-added", handleStreamAdded);
  localClient.on("stream-subscribed", handleStreamSubscribed);
  localClient.on("stream-removed", handleStreamRemoved);
  localClient.on("stream-updated", handleStreamUpdated);
  localClient.on("mute-video", handleMuteVideo);
  localClient.on("mute-audio", handleMuteAudio);
  localClient.on("unmute-video", handleUnmuteVideo);
  localClient.on("unmute-audio", handleUnmuteAudio);
}
function handleError(error: any) {
  ElMessage({ message: `LocalClient error: ${error.message_}`, type: "error" });
  addSuccessLog(`LocalClient error: ${error.message_}`);
}
function handleBanned(event: any) {
  ElMessage({
    message: `Client has been banned for ${event.reason}`,
    type: "warning"
  });
  addSuccessLog(`Client has been banned for ${event.reason}`);
}
function handlePeerJoin(event: any) {
  const { userId } = event;
  if (userId !== "local-screen") {
    addSuccessLog(`Peer Client [${userId}] joined`);
  }
}
function handlePeerLeave(event: any) {
  const { userId } = event;
  if (userId !== "local-screen") {
    addSuccessLog(`[${userId}] leave`);
  }
}

function handleStreamAdded(event: any) {
  const remoteStream = event.stream;
  const id = remoteStream.getId();
  const userId = remoteStream.getUserId();

  if (remoteStream.getUserId() === `share_${store.userId}`) {
    // don't need to screen shared by us
    localClient.unsubscribe(remoteStream).catch((error: any) => {
      addFailedLog(`unsubscribe failed: ${error.message_}`);
    });
  } else {
    addSuccessLog(
      `remote stream added: [${userId}] ID: ${id} type: ${remoteStream.getType()}`
    );
    localClient.subscribe(remoteStream).catch((error: any) => {
      addFailedLog(`subscribe failed: ${error.message_}`);
      $aegis.reportEvent({
        name: "subscribe",
        ext1: `subscribe-failed#${store.roomId}*${store.userId}*${error.message_}`,
        ext2: "webrtcQuickDemoVue3",
        ext3: store.sdkAppId
      });
    });
  }
}

function handleStreamSubscribed(event: any) {
  const remoteStream = event.stream;
  const userId = remoteStream.getUserId();
  addSuccessLog(`RemoteStream subscribed: [${userId}]`);
  ($bus as any).emit("stream-subscribed", event);
  $aegis.reportEvent({
    name: "subscribe",
    ext1: "subscribe-success",
    ext2: "webrtcQuickDemoVue3",
    ext3: store.sdkAppId
  });
}

function handleStreamRemoved(event: any) {
  const remoteStream = event.stream;
  const userId = remoteStream.getUserId();
  addSuccessLog(`RemoteStream removed: [${userId}]`);
  ($bus as any).emit("stream-removed", event);
}

function handleStreamUpdated(event: any) {
  const remoteStream = event.stream;
  const userId = remoteStream.getUserId();
  addSuccessLog(
    `RemoteStream updated: [${userId}] audio:${remoteStream.hasAudio()} }`
  );
}
function handleMuteVideo(event: any) {
  addSuccessLog(`[${event.userId}] mute video`);
}

function handleMuteAudio(event: any) {
  addSuccessLog(`[${event.userId}] mute audio`);
}

function handleUnmuteVideo(event: any) {
  addSuccessLog(`[${event.userId}] unmute video`);
}

function handleUnmuteAudio(event: any) {
  addSuccessLog(`[${event.userId}] unmute audio`);
}

function copy() {
  copyText(inviteLink.value, undefined, (error: any) => {
    if (error) {
      ElMessage({ message: "Copy failed!", type: "error" });
    } else {
      ElMessage({ message: "Copied!", type: "success" });
    }
    inviteLink.value = store.createShareLink();
  });
}

async function handleLeave() {
  if (!store.isJoined) {
    ElMessage({ message: "leave() - please join() firstly", type: "warning" });
    return;
  }
  if (store.isPublished) {
    await handleUnpublish();
  }
  try {
    uninstallEventHandlers();
    await localClient.leave();
    store.isJoined = false;
    addSuccessLog("Leave room success");
    if (localStream) {
      localStream.stop();
      localStream.close();
      localStream = null;
    }
    $aegis.reportEvent({
      name: "leaveRoom",
      ext1: "leaveRoom-success",
      ext2: "webrtcQuickDemoVue3",
      ext3: store.sdkAppId
    });
    // 向服务端发送请求，解散房间
    dismissRoom(store.roomId).then(res => {
      console.log(res);
    });
  } catch (error: any) {
    addFailedLog(`Leave room failed. Error: ${error.message_}`);
    $aegis.reportEvent({
      name: "leaveRoom",
      ext1: `leaveRoom-failed#${store.roomId}*${store.userId}*${error.message_}`,
      ext2: "webrtcQuickDemoVue3",
      ext3: store.sdkAppId
    });
  }
}

async function handleUnpublish() {
  if (!store.isJoined) {
    ElMessage({
      message: "unpublish() - please join() firstly",
      type: "warning"
    });
    return;
  }
  if (!store.isPublished) {
    ElMessage({
      message: "call unpublish() - you have not published yet",
      type: "warning"
    });
    return;
  }
  try {
    await localClient.unpublish(localStream);
    store.isPublished = false;
    addSuccessLog("Unpublish localStream success");
    $aegis.reportEvent({
      name: "unpublish",
      ext1: "unpublish-success",
      ext2: "webrtcQuickDemoVue3",
      ext3: store.sdkAppId
    });
  } catch (error: any) {
    addFailedLog(
      `LocalStream is failed to unpublish. Error: ${error.message_}`
    );
    $aegis.reportEvent({
      name: "unpublish",
      ext1: `unpublish-failed#${store.roomId}*${store.userId}*${error.message_}`,
      ext2: "webrtcQuickDemoVue3",
      ext3: store.sdkAppId
    });
  }
}
function uninstallEventHandlers() {
  if (!localClient) {
    return;
  }
  localClient.off("error", handleError);
  localClient.off("error", handleError);
  localClient.off("client-banned", handleBanned);
  localClient.off("peer-join", handlePeerJoin);
  localClient.off("peer-leave", handlePeerLeave);
  localClient.off("stream-added", handleStreamAdded);
  localClient.off("stream-subscribed", handleStreamSubscribed);
  localClient.off("stream-removed", handleStreamRemoved);
  localClient.off("stream-updated", handleStreamUpdated);
  localClient.off("mute-video", handleMuteVideo);
  localClient.off("mute-audio", handleMuteAudio);
  localClient.off("unmute-video", handleUnmuteVideo);
  localClient.off("unmute-audio", handleUnmuteAudio);
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
      <div class="title">长城固井作业远程监控一体化平台</div>
      <div class="sub-title">
        Remote monitoring platform for cementing operations
      </div>
    </div>
    <div class="page-content">
      <div class="left">
        <div class="top card">
          <div class="header">
            <el-popover placement="right" :width="200" trigger="click">
              <template #reference>
                <el-button
                  round
                  plain
                  type="primary"
                  size="small"
                  style="float: right"
                >
                  显示设置
                </el-button>
              </template>
              <el-checkbox-group
                v-model="legend_checked_1"
                @change="onLegendCheckedChange_1"
                :max="5"
              >
                <div v-for="item in legend_data" :key="item.name">
                  <el-checkbox :label="item.name" />
                  <br />
                </div>
              </el-checkbox-group>
            </el-popover>
            <div class="theader">水泥浆密度监控曲线(g/cm³)</div>
          </div>
          <table style="width: 100%">
            <tr>
              <td v-for="item in t1" :key="item.key" v-show="item.show">
                {{ item.label }}
              </td>
            </tr>
            <tr style="background: #666666">
              <td v-for="item in t1" :key="item.key" v-show="item.show">
                {{ item.value }}
              </td>
            </tr>
          </table>
          <lineChart
            :index="index"
            :legend_data="legend_data"
            :legend_selected="legend_selected"
            :xAxis_data="xAxis_data"
            :series_data="series_data"
          />
        </div>
        <div class="center">
          <el-popover placement="right" :width="200" trigger="click">
            <template #reference>
              <el-button
                round
                plain
                type="primary"
                size="small"
                style="float: right"
              >
                显示设置
              </el-button>
            </template>
            <el-checkbox-group
              v-model="legend_checked_2"
              @change="onLegendCheckedChange_2"
            >
              <div v-for="item in legend_data" :key="item.name">
                <el-checkbox :label="item.name" />
                <br />
              </div>
            </el-checkbox-group>
          </el-popover>
          <div class="theader">注替总量监控曲线(m³/min)</div>
          <table style="width: 100%">
            <tr>
              <td v-for="item in t2" :key="item.key" v-show="item.show">
                {{ item.label }}
              </td>
            </tr>
            <tr style="background: #666666">
              <td v-for="item in t2" :key="item.key" v-show="item.show">
                {{ item.value }}
              </td>
            </tr>
          </table>
        </div>
        <div class="bottom">
          <div id="player" style="width: 100%; height: 100%" />
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
      <div class="middle">
        <el-form inline>
          <el-form-item label="作业井号">
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
          </el-form-item>
          <el-form-item label="当前设备">
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
          </el-form-item>
        </el-form>
        <div />
        <div class="middle-bottom">
          <div style="display: flex; justify-content: center">
            <el-button round type="success" size="small">自动排量</el-button>
            <el-button round type="success" size="small">取力开关</el-button>
            <el-button round type="success" size="small">润滑设置</el-button>
            <el-button round type="success" size="small">喇叭开关</el-button>
            <el-button round type="danger" size="small">试压</el-button>
            <el-button round type="primary" size="small">泄压</el-button>
            <el-button round type="info" size="small">超压复位</el-button>
          </div>
          <div style="width: 240px; height: 240px">
            <gaugeChart :index="index" :data="1702" />
            <div style="text-align: center">台上转速</div>
            <div style="display: flex; justify-content: center">
              <IconifyIconOffline icon="caret-top" />
              <IconifyIconOffline icon="caret-bottom" />
            </div>
          </div>
          <div style="width: 240px; height: 240px">
            <gaugeChart :index="index + 1" :data="1350" />
            <div style="text-align: center">底盘转速</div>
            <div style="display: flex; justify-content: center">
              <IconifyIconOffline icon="caret-top" />
              <IconifyIconOffline icon="caret-bottom" />
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="top">
          <el-popover placement="right" :width="200" trigger="click">
            <template #reference>
              <el-button
                round
                plain
                type="primary"
                size="small"
                style="float: right"
              >
                显示设置
              </el-button>
            </template>
            <el-checkbox-group
              v-model="legend_checked_3"
              @change="onLegendCheckedChange_3"
            >
              <div v-for="item in legend_data" :key="item.name">
                <el-checkbox :label="item.name" />
                <br />
              </div>
            </el-checkbox-group>
          </el-popover>
          <div class="theader">施工压力监控曲线(MPa)</div>
          <table style="width: 100%">
            <tr>
              <td v-for="item in t3" :key="item.key" v-show="item.show">
                {{ item.label }}
              </td>
            </tr>
            <tr style="background: #666666">
              <td v-for="item in t3" :key="item.key" v-show="item.show">
                {{ item.value }}
              </td>
            </tr>
          </table>
        </div>
        <div class="center">
          <el-popover placement="right" :width="200" trigger="click">
            <template #reference>
              <el-button
                round
                plain
                type="primary"
                size="small"
                style="float: right"
              >
                显示设置
              </el-button>
            </template>
            <el-checkbox-group
              v-model="legend_checked_4"
              @change="onLegendCheckedChange_4"
            >
              <div v-for="item in legend_data" :key="item.name">
                <el-checkbox :label="item.name" />
                <br />
              </div>
            </el-checkbox-group>
          </el-popover>
          <div class="theader">注替排量监控曲线(m³/min)</div>
          <table style="width: 100%">
            <tr>
              <td v-for="item in t4" :key="item.key" v-show="item.show">
                {{ item.label }}
              </td>
            </tr>
            <tr style="background: #666666">
              <td v-for="item in t4" :key="item.key" v-show="item.show">
                {{ item.value }}
              </td>
            </tr>
          </table>
        </div>
        <div class="bottom" style="border: 1px solid #021fd3">
          <div class="share-link" v-if="store.isJoined">
            <div class="alert" v-text="t('trtc.invite')" />
            <div class="invite">
              <el-button
                :icon="useRenderIcon('document-copy')"
                class="invite-btn"
                @click="copy"
              />
              <el-input v-model="inviteLink" />
            </div>
          </div>
          <div class="pusher">
            <div class="local" id="local" v-if="store.isJoined">
              <div class="tag">
                <el-link
                  :underline="false"
                  :icon="
                    audioMuted
                      ? useRenderIcon('mic-off-line')
                      : useRenderIcon('mic-line')
                  "
                  :class="audioMuted ? 'muteAudio' : 'unmuteAudio'"
                  @click="muteAudio"
                  style="font-size: 20px"
                />
                <el-link
                  :underline="false"
                  :icon="
                    videoMuted
                      ? useRenderIcon('camera-off-line')
                      : useRenderIcon('camera-line')
                  "
                  :class="videoMuted ? 'muteVideo' : 'unmuteVideo'"
                  @click="muteVideo"
                  style="font-size: 20px; margin-right: 5px"
                />
              </div>
            </div>
            <div class="player"><Player /></div>
          </div>
          <div class="player-footer">
            <el-link
              :underline="false"
              :icon="useRenderIcon('microphone')"
              @click="handleJoin"
            />
            <el-link
              :underline="false"
              :icon="useRenderIcon('mute')"
              @click="handleLeave"
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
}

td:nth-of-type(1) {
  color: #ff0000;
}

td:nth-of-type(2) {
  color: #00ff00;
}

td:nth-of-type(3) {
  color: #ffff00;
}

td:nth-of-type(4) {
  color: #ff00ff;
}

td:nth-of-type(5) {
  color: #00ffff;
}

td:nth-of-type(6) {
  color: #ee6666;
}

td {
  text-align: center;
}

.timer {
  position: absolute;
  right: 0;
  margin-right: 50px;
  margin-top: 30px;
  color: #ffffff;
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
  height: 80px;
}

.title {
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  padding-top: 5px;
}

.sub-title {
  color: #ffffff;
  text-align: center;
}

.page-content {
  width: 100%;
  height: calc(100% - 80px);
  display: flex;
  justify-content: space-between;
  padding: 0 5px 5px;
}

#st6_1,
#st6_2 {
  transform-origin: 0 81px;
}

#st17 {
  transform-origin: 0 76px;
}

.green {
  stroke: green !important;
}

.left,
.right {
  width: 500px;
  display: flex;
  flex-direction: column;
}

.middle {
  flex: 1;
  padding: 5px;
  color: #ffffff;
}

.top,
.center {
  border: 1px solid #021fd3;
  flex: 1;
  padding: 5px;
  min-height: 300px;
}

.center,
.bottom {
  margin-top: 5px;
}

.bottom {
  width: 100%;
  position: relative;
  flex: 1;
  height: 320px;
}

.player-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: calc(100% - 6px);
  margin: 0 3px 3px;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  background: #0f0f0f;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  z-index: 9999;
}

.el-link {
  color: #ffffff;
}

.theader {
  text-align: center;
  color: #ffffff;
  font-size: 18px;
  line-height: 30px;
}

.invite {
  display: flex;
}

.pusher {
  width: 100%;
  height: calc(100% - 70px);
  display: flex;
  justify-content: space-between;
}

.local {
  position: relative;
  flex-shrink: 1;
  width: 100px;
  height: 100px;
}

.tag {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  z-index: 999;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  padding: 0 4px;
  flex-direction: row-reverse;
}

.player {
  width: calc(100% - 110px);
  height: 100%;
}

.st0 {
  fill: #e71f19;
}

.st1 {
  fill: #ffffff;
}

.st2 {
  opacity: 0.5;
  fill: #c30d23;
  enable-background: new;
}

.st3 {
  opacity: 0.7;
  fill: #c30d23;
  enable-background: new;
}

.st4 {
  opacity: 0.69;
  fill: #c30d23;
  enable-background: new;
}

.st5 {
  fill: #e60012;
}

.st6 {
  fill: #0000ff;
}

.st7 {
  fill: none;
  stroke: #c30d23;
  stroke-width: 3;
  stroke-miterlimit: 10;
}

.st8 {
  opacity: 0.91;
  fill: #40220f;
  enable-background: new;
}

.st9 {
  opacity: 0.5;
  fill: none;
  stroke: #c30d23;
  stroke-width: 3;
  stroke-miterlimit: 10;
  enable-background: new;
}

.st10 {
  opacity: 0.45;
  fill: none;
  stroke: #c30d23;
  stroke-width: 3;
  stroke-miterlimit: 10;
  enable-background: new;
}

.st11 {
  fill: none;
  stroke: #e60012;
  stroke-width: 6;
  stroke-miterlimit: 10;
}

.st12 {
  fill: none;
  stroke: #c30d23;
  stroke-width: 6;
  stroke-miterlimit: 10;
}

.st13 {
  fill: #e60012;
  stroke: #c30d23;
  stroke-width: 3;
  stroke-miterlimit: 10;
}

.st14 {
  fill: none;
  stroke: #c30d23;
  stroke-width: 4;
  stroke-miterlimit: 10;
}

.st15 {
  fill: none;
  stroke: #c30d23;
  stroke-width: 2;
  stroke-miterlimit: 10;
}

.st16 {
  opacity: 0.31;
  fill: #6a3906;
  enable-background: new;
}

.st17 {
  fill: #bebebe;
}

.st18 {
  fill: none;
  stroke: #c0c0c0;
  stroke-width: 3;
  stroke-miterlimit: 10;
}

.st19 {
  fill: #ff0000;
  stroke: #ff2a54;
  stroke-width: 2;
  stroke-miterlimit: 10;
}

.st20 {
  fill: #808080;
  stroke: #dddddd;
  stroke-miterlimit: 10;
}

.st21 {
  fill: none;
  stroke: #ff0000;
  stroke-width: 3;
  stroke-miterlimit: 10;
}

.st22 {
  fill: #808080;
}

.st23 {
  fill: none;
  stroke: #808080;
  stroke-miterlimit: 10;
}

.st24 {
  font-family: "SimHei";
}

.st25 {
  font-size: 8.7656px;
}

.st26 {
  fill: #696969;
  stroke: #333333;
  stroke-width: 0.75;
  stroke-miterlimit: 10;
}

.st27 {
  fill: none;
  stroke: #333333;
  stroke-width: 2;
  stroke-miterlimit: 10;
}

.st28 {
  fill: #999999;
  stroke: #333333;
  stroke-width: 0.5;
  stroke-miterlimit: 10;
}

.st29 {
  fill: #00ffff;
  stroke: #48d1cc;
  stroke-width: 0.5;
  stroke-miterlimit: 10;
}

.st30 {
  fill: #696969;
  stroke: #333333;
  stroke-miterlimit: 10;
}

.st31 {
  font-size: 12.2718px;
}

.st32 {
  fill: #696969;
}

.st33 {
  fill: #ff0000;
}

.st34 {
  font-size: 10.5187px;
}

.st35 {
  fill: #00ffff;
}

.st36 {
  clip-path: url(#SVGID_2_);
  fill: #ed1c24;
}

.st37 {
  clip-path: url(#SVGID_4_);
  fill: none;
  stroke: #c1272d;
  stroke-miterlimit: 10;
}

.st38 {
  clip-path: url(#SVGID_6_);
  fill: none;
  stroke: #333333;
  stroke-width: 2;
  stroke-miterlimit: 10;
}

.st39 {
  clip-path: url(#SVGID_8_);
  fill: none;
  stroke: #333333;
  stroke-width: 2;
  stroke-miterlimit: 10;
}

.st40 {
  clip-path: url(#SVGID_10_);
  fill: none;
  stroke: #333333;
  stroke-width: 2;
  stroke-miterlimit: 10;
}

.st41 {
  clip-path: url(#SVGID_12_);
}

.st42 {
  clip-path: url(#SVGID_14_);
}

.st43 {
  clip-path: url(#SVGID_16_);
}

.st44 {
  clip-path: url(#SVGID_18_);
  fill: #ed1c24;
}

.st45 {
  clip-path: url(#SVGID_20_);
  fill: none;
  stroke: #c1272d;
  stroke-miterlimit: 10;
}

.st46 {
  clip-path: url(#SVGID_22_);
  fill: none;
  stroke: #333333;
  stroke-miterlimit: 10;
}

.st47 {
  clip-path: url(#SVGID_24_);
  fill: none;
  stroke: #333333;
  stroke-miterlimit: 10;
}

.st48 {
  clip-path: url(#SVGID_26_);
  fill: none;
  stroke: #333333;
  stroke-miterlimit: 10;
}

.st49 {
  clip-path: url(#SVGID_28_);
  fill: #333333;
}

.st50 {
  clip-path: url(#SVGID_30_);
  fill: #333333;
}

.st51 {
  clip-path: url(#SVGID_32_);
  fill: #333333;
}

.st52 {
  clip-path: url(#SVGID_34_);
  fill: #ed1c24;
}

.st53 {
  clip-path: url(#SVGID_36_);
  fill: none;
  stroke: #c1272d;
  stroke-width: 0.5;
  stroke-miterlimit: 10;
}

.st54 {
  clip-path: url(#SVGID_38_);
  fill: #ed1c24;
}

.st55 {
  clip-path: url(#SVGID_40_);
  fill: none;
  stroke: #c1272d;
  stroke-width: 0.5;
  stroke-miterlimit: 10;
}

.st56 {
  clip-path: url(#SVGID_42_);
  fill: #ed1c24;
}

.st57 {
  clip-path: url(#SVGID_44_);
  fill: none;
  stroke: #c1272d;
  stroke-width: 0.5;
  stroke-miterlimit: 10;
}

.st58 {
  clip-path: url(#SVGID_46_);
  fill: #ed1c24;
}

.st59 {
  clip-path: url(#SVGID_48_);
  fill: none;
  stroke: #c1272d;
  stroke-width: 0.5;
  stroke-miterlimit: 10;
}

.st60 {
  clip-path: url(#SVGID_50_);
  fill: #ed1c24;
}

.st61 {
  clip-path: url(#SVGID_52_);
  fill: none;
  stroke: #c1272d;
  stroke-width: 0.5;
  stroke-miterlimit: 10;
}

.st62 {
  clip-path: url(#SVGID_54_);
  fill: #ed1c24;
}

.st63 {
  clip-path: url(#SVGID_56_);
  fill: none;
  stroke: #c1272d;
  stroke-width: 0.5;
  stroke-miterlimit: 10;
}

.st64 {
  clip-path: url(#SVGID_58_);
  fill: #ed1c24;
}

.st65 {
  clip-path: url(#SVGID_60_);
  fill: none;
  stroke: #c1272d;
  stroke-width: 0.5;
  stroke-miterlimit: 10;
}

.st66 {
  clip-path: url(#SVGID_62_);
  fill: #ed1c24;
}

.st67 {
  clip-path: url(#SVGID_64_);
  fill: none;
  stroke: #c1272d;
  stroke-width: 0.5;
  stroke-miterlimit: 10;
}

.st68 {
  clip-path: url(#SVGID_66_);
}

.st69 {
  clip-path: url(#SVGID_68_);
}

.st70 {
  clip-path: url(#SVGID_70_);
}

.st71 {
  clip-path: url(#SVGID_72_);
}

.st72 {
  clip-path: url(#SVGID_74_);
}

.st73 {
  clip-path: url(#SVGID_76_);
}

.st74 {
  clip-path: url(#SVGID_78_);
}

.st75 {
  clip-path: url(#SVGID_80_);
}

.st76 {
  clip-path: url(#SVGID_82_);
}

.st77 {
  clip-path: url(#SVGID_84_);
}

.st78 {
  clip-path: url(#SVGID_86_);
}

.st79 {
  clip-path: url(#SVGID_88_);
}

.st80 {
  clip-path: url(#SVGID_90_);
  fill: #ed1c24;
}

.st81 {
  clip-path: url(#SVGID_92_);
  fill: none;
  stroke: #c1272d;
  stroke-miterlimit: 10;
}

.st82 {
  clip-path: url(#SVGID_94_);
  fill: #c1272d;
}

.st83 {
  clip-path: url(#SVGID_96_);
  fill: none;
  stroke: #c1272d;
  stroke-miterlimit: 10;
}

.st84 {
  clip-path: url(#SVGID_98_);
  fill: #ed1c24;
}

.st85 {
  clip-path: url(#SVGID_100_);
  fill: none;
  stroke: #c1272d;
  stroke-miterlimit: 10;
}

.st86 {
  clip-path: url(#SVGID_102_);
  fill: #ed1c24;
}

.st87 {
  clip-path: url(#SVGID_104_);
  fill: #ed1c24;
}

.st88 {
  clip-path: url(#SVGID_106_);
  fill: #ed1c24;
}

.st89 {
  clip-path: url(#SVGID_108_);
  fill: #ed1c24;
}

.st90 {
  clip-path: url(#SVGID_110_);
  fill: #c1272d;
}

.st91 {
  clip-path: url(#SVGID_112_);
  fill: #c1272d;
}

.st92 {
  clip-path: url(#SVGID_114_);
  fill: #c1272d;
}

.st93 {
  clip-path: url(#SVGID_116_);
  fill: #180002;
}

.st94 {
  clip-path: url(#SVGID_118_);
  fill: none;
  stroke: #4d4d4d;
  stroke-width: 0.25;
  stroke-miterlimit: 10;
}

.st95 {
  clip-path: url(#SVGID_120_);
  fill: #180002;
}

.st96 {
  clip-path: url(#SVGID_122_);
  fill: none;
  stroke: #4d4d4d;
  stroke-width: 0.25;
  stroke-miterlimit: 10;
}

.st97 {
  clip-path: url(#SVGID_124_);
  fill: #180002;
}

.st98 {
  clip-path: url(#SVGID_126_);
  fill: none;
  stroke: #4d4d4d;
  stroke-width: 0.25;
  stroke-miterlimit: 10;
}

.st99 {
  clip-path: url(#SVGID_128_);
  fill: #4a0002;
}

.st100 {
  clip-path: url(#SVGID_130_);
  fill: #4a0002;
}

.st101 {
  clip-path: url(#SVGID_132_);
  fill: #4a0002;
}

.st102 {
  fill: none;
  stroke: #000000;
  stroke-miterlimit: 10;
}

.st103 {
  font-family: "AdobeSongStd-Light-GBpc-EUC-H";
}

.st104 {
  font-size: 10px;
}

.st105 {
  font-family: "ArialMT";
}

.st106 {
  font-size: 8px;
}

.st107 {
  fill: #777777;
  stroke: #000000;
  stroke-miterlimit: 10;
}
</style>
