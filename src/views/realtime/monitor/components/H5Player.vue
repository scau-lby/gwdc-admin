<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
// import * as moment from "moment";

const props = defineProps({
  urls: {
    type: Array,
    default: () => []
  }
});

let player = null,
  muted = ref(true),
  volume = ref(50);

function createPlayer() {
  player = new window.JSPlugin({
    szId: "player",
    szBasePath: "./",
    // 当容器div#play_window有固定宽高时，可不传iWidth和iHeight，窗口大小将自适应容器宽高
    // iWidth: 600,
    // iHeight: 400,
    iMaxSplit: 4,
    iCurrentSplit: 2,
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
    windowEventOver: function (iWndIndex) {
      // 鼠标移过回调
      console.log(iWndIndex);
    },
    windowEventOut: function (iWndIndex) {
      // 鼠标移出回调
      console.log(iWndIndex);
    },
    windowEventUp: function (iWndIndex) {
      // 鼠标mouseup事件回调
      console.log(iWndIndex);
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

function arrangeWindow(splitNum) {
  player.JS_ArrangeWindow(splitNum).then(
    () => {
      console.log(`arrangeWindow to ${splitNum}x${splitNum} success`);
    },
    e => {
      console.error(e);
    }
  );
}

// 整体全屏
function wholeFullScreen() {
  player.JS_FullScreenDisplay(true).then(
    () => {
      console.log(`wholeFullScreen success`);
    },
    e => {
      console.error(e);
    }
  );
}

// 开始预览
function realplay(data) {
  if (data.length === 0) return;
  data.forEach((item, index) => {
    // const playURL = "ws://59.47.54.83:7002/media?url=" + item.url;
    console.log(item);
    const playURL = item.url;
    player.JS_Play(playURL, { playURL, mode: 0 }, index).then(
      res => {
        console.log(res), console.log("realplay success");
      },
      err => {
        console.error("error:", err);
      }
    );
  });
}

function init() {
  // 设置播放容器的宽高并监听窗口大小变化
  window.addEventListener("resize", () => {
    player.JS_Resize();
  });
}

// 抓取图片
function capture(imageType) {
  const curIndex = player.currentWindowIndex;
  player.JS_CapturePicture(curIndex, "img", imageType).then(
    () => {
      console.log("capture success", imageType);
    },
    e => {
      console.error(e);
    }
  );
}

// 开启声音
function openSound() {
  const curIndex = player.currentWindowIndex;
  player.JS_OpenSound(curIndex).then(
    () => {
      console.log("openSound success");
      muted.value = false;
    },
    e => {
      console.error(e);
    }
  );
}

// 关闭声音
function closeSound() {
  const curIndex = player.currentWindowIndex;
  player.JS_CloseSound(curIndex).then(
    () => {
      console.log("closeSound success");
      muted.value = true;
    },
    e => {
      console.error(e);
    }
  );
}

// 设置音量
function setVolume(value) {
  const curIndex = player.currentWindowIndex;
  player.JS_SetVolume(curIndex, value).then(
    () => {
      console.log("setVolume success", value);
    },
    e => {
      console.error(e);
    }
  );
}

// 录制视频
function recordStart(type) {
  const codeMap = { MP4: 5, PS: 2 },
    curIndex = player.currentWindowIndex,
    fileName = new Date().getTime() + `.mp4`,
    typeCode = codeMap[type];

  player.JS_StartSaveEx(curIndex, fileName, typeCode).then(
    () => {
      console.log("record start ...");
    },
    e => {
      console.error(e);
    }
  );
}

// 停止录制
function recordStop() {
  const curIndex = player.currentWindowIndex;
  player.JS_StopSave(curIndex).then(
    () => {
      console.log("record stoped, saving ...");
    },
    e => {
      console.error(e);
    }
  );
}

watch(
  () => props.urls,
  val => {
    if (val.length == 1) {
      player.JS_ArrangeWindow(1);
    } else if (val.length > 1 && val.length <= 4) {
      player.JS_ArrangeWindow(2);
    } else if (val.length > 4 && val.length <= 9) {
      player.JS_ArrangeWindow(3);
    } else if (val.length > 9) {
      player.JS_ArrangeWindow(4);
    }
    if (player !== null) {
      player.JS_StopRealPlayAll().then(
        () => {
          player = null;
          console.info("JS_StopRealPlayAll success");
          if (val.length > 0) {
            realplay(val);
          }
        },
        err => {
          console.info("JS_StopRealPlayAll failed:", err);
        }
      );
    } else {
      if (val.length > 0) {
        realplay(val);
      }
    }
  },
  {
    deep: true,
    immediate: true
  }
);

onMounted(() => {
  init();
  createPlayer();
  setTimeout(() => {}, 2000);
});
</script>

<template>
  <!-- 表单内容 -->
  <div class="mc-player">
    <div id="player" />
    <div class="mc-footer">
      <div>
        <el-button
          class="reset-margin"
          plain
          :icon="useRenderIcon('camera-filled')"
          @click="capture('JPEG')"
          type="success"
        >
          抓取 JPEG
        </el-button>
        <el-button
          class="reset-margin"
          plain
          :icon="useRenderIcon('camera')"
          @click="capture('BMP')"
          type="success"
        >
          抓取 BMP
        </el-button>
        <el-button
          class="reset-margin"
          plain
          :icon="useRenderIcon('video-camera-filled')"
          @click="recordStart('MP4')"
          type="danger"
        >
          录制 MP4
        </el-button>
        <el-button
          class="reset-margin"
          plain
          :icon="useRenderIcon('video-camera')"
          @click="recordStart('PS')"
          type="danger"
        >
          录制 PS
        </el-button>
        <el-button
          class="reset-margin"
          plain
          :icon="useRenderIcon('film')"
          @click="recordStop"
          type="danger"
        >
          停止录制并保存文件
        </el-button>
      </div>
      <div
        style="display: flex; flex-direction: row; justify-content: flex-end"
      >
        <el-button
          class="reset-margin"
          plain
          :icon="useRenderIcon('volume-up-line')"
          @click="openSound"
          type="primary"
          v-if="muted"
        >
          开启声音
        </el-button>
        <el-button
          class="reset-margin"
          plain
          :icon="useRenderIcon('volume-mute-line')"
          @click="closeSound"
          type="primary"
          v-else
        >
          关闭声音
        </el-button>
        <div style="min-width: 150px; margin: 0 20px">
          <el-slider @change="setVolume" v-model="volume" size="small" />
        </div>
        <el-button
          class="reset-margin"
          plain
          @click="arrangeWindow(1)"
          type="warning"
        >
          1×1
        </el-button>
        <el-button
          class="reset-margin"
          plain
          @click="arrangeWindow(2)"
          type="warning"
        >
          2×2
        </el-button>
        <el-button
          class="reset-margin"
          plain
          @click="arrangeWindow(3)"
          type="warning"
        >
          3×3
        </el-button>
        <el-button
          class="reset-margin"
          plain
          @click="arrangeWindow(4)"
          type="warning"
        >
          4×4
        </el-button>
        <el-button
          class="reset-margin"
          plain
          :icon="useRenderIcon('full-screen')"
          @click="wholeFullScreen"
          type="warning"
        >
          整体全屏
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mc-player {
  width: 100%;
  height: 100%;

  #player {
    width: 100% !important;
    height: 100% !important;
  }
}

.mc-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
