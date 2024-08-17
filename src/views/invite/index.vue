<template>
  <el-row style="padding: 0 10px 40px 10px">
    <el-col :md="{ span: 18, offset: 3 }" :sm="{ span: 24 }">
      <div class="invite">
        <div class="share-link">
          <div class="alert" v-text="t('trtc.inviteUrl')" />
        </div>
      </div>
      <div style="padding-top: 10px">
        <el-button type="primary" @click="handleJoin"> 进入房间 </el-button>
        <el-button type="primary" @click="handleLeave"> 离开房间 </el-button>
        <!-- <el-button type="primary" @click="switchDevice"> 切换摄像头 </el-button> -->
      </div>
      <div style="padding-top: 10px">
        <el-button
          type="primary"
          v-for="item in cameras"
          :key="item.deviceId"
          @click="switchDevice(item.deviceId)"
        >
          {{ item.label }}
        </el-button>
      </div>
      <div id="local" style="width: 300px; margin-top: 20px" />
      <div class="remote-container">
        <div v-for="item in store.invitedRemoteStreams" :key="item.getId()">
          <div :id="item.getId()" style="width: 300px; margin-top: 20px" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { nextTick, ref } from "vue";
import { getParamKey } from "/@/utils/utils";
import Client from "/@/utils/client";
import { useTrtcStoreHook } from "/@/store/modules/trtc";
import TRTC from "trtc-js-sdk";

const store = useTrtcStoreHook();
const { t } = useI18n({ useScope: "global" });

const sdkAppId = parseInt(getParamKey("sdkAppId"), 10);
const userId = getParamKey("userId");
const userSig = getParamKey("userSig");
const roomId = parseInt(getParamKey("roomId"), 10);

const state = { url: window.location.href.split("?")[0] };
window.history.pushState(state, "", "index.html#/invite");

if (!sdkAppId || !userId || !userSig || !roomId) {
  ElMessage.error(t("trtc.check"));
}
let localClient: any;
let cameras = ref(null);

async function handleJoin() {
  try {
    localClient = new Client({
      sdkAppId,
      userSig,
      userId,
      roomId
    });
    const client = localClient.getClient();

    client.on("stream-subscribed", handleSubscribed);
    client.on("stream-removed", handleRemoved);

    await localClient.join();
    await localClient.publish();
    const localStream = localClient.getLocalStream();

    await nextTick();
    localStream.play("local");
    TRTC.getCameras().then(devices => {
      cameras.value = devices;
      // devices.forEach(dev => {
      // ElMessage({
      //   message: "camera label: " + dev.label + " deviceId: " + dev.deviceId,
      //   type: "success"
      // });
      // });
    });
  } catch (error: any) {
    ElMessage({
      message: error.message_,
      type: "error"
    });
  }
}

async function handleSubscribed(event: any) {
  const remoteStream = event.stream;
  const id = remoteStream.getId();
  const remoteId = `${id}`;
  store.invitedRemoteStreams.push(remoteStream);
  await nextTick();
  remoteStream
    .play(remoteId)
    .then(() => {
      console.log(`RemoteStream play success: [${userId}]`);
    })
    .catch((error: any) => {
      console.log(
        `RemoteStream play failed: [${userId}], error: ${error.message_}`
      );
    });
}

async function handleRemoved(event: any) {
  const remoteStream = event.stream;
  const id = remoteStream.getId();
  store.invitedRemoteStreams = store.invitedRemoteStreams.filter(
    (stream: any) => stream.getId() !== id
  );
}

async function handleLeave() {
  await localClient.leave();
}
function switchDevice(cameraId) {
  // 假设本地流 localStream 已经被发布
  // 切换到第二个摄像头
  // ElMessage({
  //   message: store.videoDeviceId + "----" + cameraId.value,
  //   type: "success"
  // });
  // ElMessage({
  //   message: cameraId.value,
  //   type: "success"
  // });
  const localStream = localClient.getLocalStream();
  localStream.switchDevice("video", cameraId).then(() => {
    // ElMessage({
    //   message: "switch camera success",
    //   type: "success"
    // });
    // console.log("switch camera success");
  });
}
</script>
<style lang="scss" scoped>
.invite {
  display: flex;
  padding-top: 20px;
}

.share-link {
  color: #084298;
  background-color: #cfe2ff;
  border-color: #b6d4fe;
  width: 100%;
  padding: 15px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.el-button {
  background-color: #0d6efd;
  font-size: 14px;
  font-weight: 400;
  padding: 4px 8px;
}

.el-button:hover {
  background-color: #0d6efd;
}

.el-button:focus {
  background-color: #0d6efd;
}

.el-button + .el-button {
  margin-left: 6px;
}

.remote-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-top: 20px;
}
</style>
