<script setup lang="ts">
import { ref, inject } from "vue";
import { copyText } from "vue3-clipboard";
import { ElMessage, ElNotification } from "element-plus";
import TRTC, { Client, LocalStream } from "trtc-js-sdk";
import { useTrtcStoreHook } from "/@/store/modules/trtc";
import { getParamKey } from "/@/utils/utils";
import { dismissRoom } from "/@/api/rtc";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import Player from "./Player.vue";
import { useI18n } from "vue-i18n";

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
defineExpose({
  handleJoin,
  handleLeave
});
</script>
<template>
  <div>
    <div class="share-link" v-if="store.isJoined">
      <div class="alert">{{ t("trtc.invite") }}</div>
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
      <!-- v-if="store.isJoined" -->
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
      <Player />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.share-link {
  color: #084298;
  background-color: #cfe2ff;
  border-color: #b6d4fe;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 4px;

  .alert {
    width: 100%;
    overflow-x: hidden;
  }
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
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.local {
  position: relative;
  min-width: 150px;
  min-height: 150px;

  .tag {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30px;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    padding: 0 4px;
    flex-direction: row-reverse;
  }
}
</style>
