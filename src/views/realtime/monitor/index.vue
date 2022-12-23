<script setup lang="ts">
import { onMounted, ref, watch, inject } from "vue";
import { getOnlineTruckList } from "/@/api/truck";
import { getPreviewUrlByPlatenums, setControlCmd } from "/@/api/video";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { useTrtcStoreHook } from "/@/store/modules/trtc";
import TRTC, { Client, LocalStream } from "trtc-js-sdk";
import { ElMessage, ElNotification } from "element-plus";
import { useI18n } from "vue-i18n";
import { getParamKey } from "/@/utils/utils";
import Player from "./components/Player.vue";
import Control from "./components/Control.vue";
import { copyText } from "vue3-clipboard";

const { t } = useI18n({ useScope: "global" });
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
const audioMuted = ref(false);
const videoMuted = ref(false);

let player = null;

let onlineList = []; // 在线设备列表
const plateList = ref(null), // 当前选中任务对应的设备列表
  taskList = ref([]), // 任务列表
  task_selected = ref(""), // 当前任务
  plates_checked = ref([]), // 当前选中设备编号数组
  urls = ref([]),
  muted = ref(true),
  speed = ref(50),
  cruise = ref(false);
// volume = ref(10);

// 获取在线设备列表
async function getOnline() {
  let { data } = await getOnlineTruckList();

  if (data.length > 0) {
    data.forEach(item => {
      const { id, plateNum, equType, wellName, wellType } = item,
        task = `${wellName} @ ${wellType}`;
      if (!taskList.value.includes(task)) taskList.value.push(task);
      onlineList.push({ id, task, plateNum, equType, wellName, wellType });
    });

    task_selected.value = taskList.value[0];
    plateList.value = onlineList.filter(
      item => item.task === task_selected.value
    );
    plateList.value.forEach(item => {
      plates_checked.value.push(item.plateNum);
    });
  }
}

// 切换施工任务
function onTaskChange(val) {
  plateList.value = onlineList.filter(item => item.task === val);
  plates_checked.value = [];
  plateList.value.forEach(item => {
    plates_checked.value.push(item.plateNum);
  });
}

watch(
  () => plates_checked.value,
  val => {
    if (val.length !== 0) {
      getPreviewUrlByPlatenums({
        plateNums: val.join(","),
        // plateNums: "Camera 01",
        wellName: task_selected.value.split(" @ ")[0],
        wellType: task_selected.value.split(" @ ")[1]
      }).then(({ data }) => {
        urls.value = data;
        if (urls.value.length == 1) {
          arrangeWindow(1);
        } else if (urls.value.length > 1 && urls.value.length <= 4) {
          arrangeWindow(2);
        } else if (urls.value.length > 4 && urls.value.length <= 9) {
          arrangeWindow(3);
        } else if (urls.value.length > 9) {
          arrangeWindow(4);
        }
        if (player !== null) {
          player.JS_StopRealPlayAll().then(
            () => {
              console.info("JS_StopRealPlayAll success");
              realplay(urls.value);
            },
            err => {
              console.info("JS_StopRealPlayAll failed:", err);
            }
          );
        }
      });
    } else {
      stopAllPlay();
    }
  },
  {
    deep: true,
    immediate: true
  }
);

function stopAllPlay() {
  if (player !== null) {
    player.JS_StopRealPlayAll().then(
      () => {
        console.info("JS_StopRealPlayAll success");
      },
      err => {
        console.info("JS_StopRealPlayAll failed:", err);
      }
    );
  }
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

  // 事件回调绑定
  player.JS_SetWindowControlCallback({
    windowEventSelect: function (iWndIndex) {
      // 插件选中窗口回调
      console.log("windowSelect callback: ", iWndIndex);
    },
    pluginErrorHandler: function (iWndIndex, iErrorCode, oError) {
      // 插件错误回调
      console.log("pluginError callback: ", iWndIndex, iErrorCode, oError);
    },
    windowEventOver: function () {
      // 鼠标移过回调
    },
    windowEventOut: function () {
      // 鼠标移出回调
    },
    windowEventUp: function () {
      // 鼠标mouseup事件回调
    },
    windowFullCcreenChange: function (bFull) {
      // 全屏切换回调
      console.log("fullScreen callback: ", bFull);
    },
    firstFrameDisplay: function (iWndIndex, iWidth, iHeight) {
      // 首帧显示回调
      console.log("firstFrame loaded callback: ", iWndIndex, iWidth, iHeight);
    },
    performanceLack: function () {
      // 性能不足回调
      console.log("performanceLack callback: ");
    }
  });
}

// 整体全屏
function wholeFullScreen() {
  player.JS_FullScreenDisplay(true).then(
    () => {},
    e => {
      console.error(e);
    }
  );
}

// 分屏
function arrangeWindow(splitNum) {
  player.JS_ArrangeWindow(splitNum).then(
    () => {},
    e => {
      console.error(e);
    }
  );
}

// 开始预览
function realplay(data) {
  if (data.length === 0) return;
  data.forEach((item, index) => {
    const playURL = item.url;
    player.JS_Play(playURL, { playURL, mode: 1 }, index).then(
      () => {
        console.log("realplay success");
      },
      err => {
        console.error("error:", err);
      }
    );
  });
}

// 初始化
function init() {
  // 设置播放容器的宽高并监听窗口大小变化
  window.addEventListener("resize", () => {
    player.JS_Resize();
  });
}

// 抓取图片
function capture(imageType) {
  const curIndex = player.currentWindowIndex;
  player.JS_CapturePicture(curIndex, task_selected.value, imageType).then(
    () => {},
    e => {
      console.error(e);
    }
  );
}

// 录制视频
function recordStart(type) {
  const codeMap = { MP4: 5, PS: 2 },
    curIndex = player.currentWindowIndex,
    fileName = task_selected.value + `.mp4`,
    typeCode = codeMap[type];

  player.JS_StartSaveEx(curIndex, fileName, typeCode).then(
    () => {},
    e => {
      console.error(e);
    }
  );
}

// 停止录制
function recordStop() {
  const curIndex = player.currentWindowIndex;
  player.JS_StopSave(curIndex).then(
    () => {},
    e => {
      console.error(e);
    }
  );
}

// 开启声音
function openSound() {
  player.JS_OpenSound().then(
    () => {
      console.info("JS_OpenSound success");
      muted.value = false;
    },
    err => {
      console.error("JS_OpenSound failed", err);
    }
  );
}

// 关闭声音
function closeSound() {
  const curIndex = player.currentWindowIndex;
  player.JS_CloseSound(curIndex).then(
    () => {
      console.info("closeSound success");
      muted.value = true;
    },
    e => {
      console.error(e);
    }
  );
}

// 设置音量
// function setVolume(value) {
//   const curIndex = player.currentWindowIndex;
//   player.JS_SetVolume(curIndex, value).then(
//     () => {
//       console.info("setVolume success", value);
//     },
//     e => {
//       console.error(e);
//     }
//   );
// }

onMounted(() => {
  getOnline();
  init();
  createPlayer();
  setTimeout(() => {}, 2000);
});

function setControl(cmd) {
  const curIndex = player.currentWindowIndex;

  setControlCmd({
    CameraName: urls.value[curIndex].cameraName,
    command: cmd,
    speed: speed.value,
    action: 0
  }).then(res => {
    console.log(res);
  });

  setTimeout(() => {
    setControlCmd({
      CameraName: urls.value[curIndex].cameraName,
      command: cmd,
      speed: speed.value,
      action: 1
    }).then(res => {
      console.log(res);
    });
  }, 1000);
}

function setCmd(cmd, action = 0) {
  cruise.value = !cruise.value;
  const curIndex = player.currentWindowIndex;

  setControlCmd({
    CameraName: urls.value[curIndex].cameraName,
    command: cmd,
    speed: speed.value,
    action
  }).then(res => {
    console.log(res);
  });
}

function setSpeed(curr_speed) {
  speed.value = curr_speed;
}

let localClient: Client;
let localStream: LocalStream;
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
</script>
<template>
  <div>
    <div class="main">
      <div class="mc-player" :style="{ width: '100%' }">
        <div id="player" style="height: 70vh" />
        <div class="mc-footer">
          <div style="display: flex">
            <el-link
              :underline="false"
              :icon="useRenderIcon('volume-mute-line')"
              @click="openSound"
              v-if="muted"
            />
            <el-link
              :underline="false"
              :icon="useRenderIcon('volume-up-line')"
              @click="closeSound"
              v-else
            />
            <!-- <div style="min-width: 150px; margin: 0 20px">
            <el-slider @change="setVolume" v-model="volume" size="small" />
          </div> -->
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
          <div>
            <el-tooltip effect="light" content="抓取 JPEG">
              <el-link
                :underline="false"
                :icon="useRenderIcon('camera-filled')"
                @click="capture('JPEG')"
              />
            </el-tooltip>
            <el-tooltip effect="light" content="录制 MP4">
              <el-link
                :underline="false"
                :icon="useRenderIcon('video-camera-filled')"
                @click="recordStart('MP4')"
              />
            </el-tooltip>
            <el-tooltip effect="light" content="停止录制并保存">
              <el-link
                :underline="false"
                :icon="useRenderIcon('film')"
                @click="recordStop"
              />
            </el-tooltip>
            <el-tooltip effect="light" content="1×1">
              <el-link
                :underline="false"
                :icon="useRenderIcon('platform')"
                @click="arrangeWindow(1)"
              />
            </el-tooltip>
            <el-tooltip effect="light" content="2×2">
              <el-link
                :underline="false"
                :icon="useRenderIcon('menu')"
                @click="arrangeWindow(2)"
              />
            </el-tooltip>
            <el-tooltip effect="light" content="3×3">
              <el-link
                :underline="false"
                :icon="useRenderIcon('grid')"
                @click="arrangeWindow(3)"
              />
            </el-tooltip>
            <!-- <el-link
          :underline="false"
          :icon="useRenderIcon('grid')"
          @click="arrangeWindow(4)"
        /> -->
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
      <div style="margin-left: 15px; display: flex; flex-direction: column">
        <el-card style="flex-grow: 1">
          <el-form-item label="施工任务">
            <el-select
              v-model="task_selected"
              placeholder="请选择施工任务"
              @change="onTaskChange"
            >
              <el-option
                v-for="(item, index) in taskList"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="在线设备">
            <el-checkbox-group v-model="plates_checked">
              <el-checkbox
                v-for="item in plateList"
                :key="item.id"
                :label="item.plateNum"
              />
            </el-checkbox-group>
          </el-form-item>
        </el-card>
        <el-card style="margin-top: 15px">
          <Control
            :cruise="cruise"
            :speed="speed"
            @setControl="setControl"
            @setCmd="setCmd"
            @setSpeed="setSpeed"
            v-auth="'126'"
          />
        </el-card>
      </div>
    </div>
    <div class="share-link" v-if="store.isJoined">
      <div class="alert" v-text="t('trtc.invite')" />
      <div class="invite">
        <el-button
          :icon="useRenderIcon('document-copy')"
          class="invite-btn"
          @click="copy"
        />
        <el-input id="foo" v-model="inviteLink" />
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
  </div>
</template>

<style scoped lang="scss">
.share-link {
  color: #084298;
  background-color: #cfe2ff;
  border-color: #b6d4fe;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  margin-top: 15px;
}

.invite {
  display: flex;
  padding-top: 6px;

  .invite-btn {
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #d5d5d5;
    border-radius: 3px;
    padding: 6px 12px;
    cursor: pointer;
    background-color: #eee;
  }
}

.pusher {
  margin-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.local {
  width: 300px;
  height: 300px;
  position: relative;
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
  flex-grow: 1;
  margin-left: 15px;
}

.main {
  display: flex;
}

.mc-player {
  width: 100%;
  height: 100%;

  #player {
    width: 100% !important;
    // height: 90% !important;
  }
}

.mc-footer {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  background: #000;

  .el-link {
    font-size: 22px;
    margin: 5px;
    color: #fff;
  }
}
</style>
