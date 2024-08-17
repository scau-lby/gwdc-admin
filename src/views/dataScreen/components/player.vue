<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { getPreviewUrlByPlatenums } from "/@/api/video";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

let player = null;

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  data: {
    type: Array,
    default: () => {
      return [];
    }
  }
});

const urls = ref([]);
watch(
  () => props.data,
  val => {
    if (val.length !== 0) {
      getPreviewUrlByPlatenums({
        plateNums: val.join(",")
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
  { deep: true }
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
    szId: "szplayer",
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
    () => {}
  );
}

// 单窗口全屏
function singleFullScreen() {
  const curIndex = player.currentWindowIndex;
  player.JS_FullScreenSingle(curIndex).then(
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

onMounted(() => {
  init();
  createPlayer();
});
</script>
<template>
  <div style="width: 100%; height: 100%">
    <div id="szplayer" />
    <div class="player-footer">
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
      <el-tooltip effect="light" content="单窗口全屏">
        <el-link
          :underline="false"
          :icon="useRenderIcon('zoom-in')"
          @click="singleFullScreen"
        />
      </el-tooltip>
      <el-tooltip effect="light" content="整体全屏">
        <el-link
          :underline="false"
          :icon="useRenderIcon('full-screen')"
          @click="wholeFullScreen"
        />
      </el-tooltip>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#szplayer {
  width: 100% !important;
  height: calc(100% - 30px) !important;
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
  justify-content: flex-end;
  z-index: 9999;
  // border: 1px solid rgb(255, 204, 0);
  border-top: none;
}

.el-link {
  color: #ffffff;
}

.el-link ~ .el-link {
  margin-left: 10px;
}
</style>
