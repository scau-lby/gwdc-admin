<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
// store
import { useHisDataStoreHook } from "/@/store/modules/hisData";
// api
import { getHistoryWell, getHistoryList } from "/@/api/history";

import { getPlayBackUrlByPlatenum } from "/@/api/video";

defineOptions({
  name: "HisVideo"
});

let player = null,
  wellName = "",
  wellType = "";

const urls = ref([]),
  muted = ref(true),
  state = ref(1),
  beginTime = ref(null),
  endTime = ref(null),
  task = ref(""),
  plateList = ref([]),
  plate_checked = ref("");

async function getPlateList() {
  let { data } = await getHistoryWell({
    wellName,
    wellType
  });
  plateList.value = data;
  plate_checked.value = data[0].plateNum;
}

onMounted(() => {
  wellName = useHisDataStoreHook().getWellName;
  wellType = useHisDataStoreHook().getWellType;
  if (!wellName || !wellType) {
    getHistoryList({
      pageNum: 1,
      pageSize: 1
    }).then(({ data }) => {
      const records = data.records;
      useHisDataStoreHook().SET_WELLNAME(records[0].wellName);
      useHisDataStoreHook().SET_WELLTYPE(records[0].wellType);
      wellName = records[0].wellName;
      wellType = records[0].wellType;
      task.value = wellName + " @ " + wellType;
      getPlateList();
    });
  } else {
    task.value = wellName + " @ " + wellType;
    getPlateList();
  }
  createPlayer();
  init();
});

watch(
  () => plate_checked.value,
  value => {
    if (value && wellName && wellType) {
      plateList.value.forEach(item => {
        if (item.plateNum === value) {
          beginTime.value = formatDateTime(item.startTime);
          endTime.value = formatDateTime(item.finishTime);
        }
      });
    }
  }
);

function formatDateTime(datetimeStr) {
  return (
    datetimeStr.slice(0, 4) +
    "-" +
    datetimeStr.slice(4, 6) +
    "-" +
    datetimeStr.slice(6, 8) +
    " " +
    datetimeStr.slice(8, 10) +
    ":" +
    datetimeStr.slice(10, 12) +
    ":" +
    datetimeStr.slice(12, 14)
  );
}

// 开始回放
async function playbackStart() {
  let { data } = await getPlayBackUrlByPlatenum({
    beginTime: beginTime.value,
    endTime: endTime.value,
    wellName,
    wellType,
    plateNum: plate_checked.value
    // plateNum: "Camera 01"
  });
  urls.value = data;
  if (data.length > 0) {
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
          state.value = 2;
        },
        err => {
          console.info("JS_StopRealPlayAll failed:", err);
        }
      );
    }
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
    if (playURL !== null) {
      player.JS_Play(playURL, { playURL, mode: 1 }, index).then(
        () => {
          console.log("realplay success");
        },
        err => {
          console.error("error:", err);
        }
      );
    }
  });
}

function init() {
  // 设置播放容器的宽高并监听窗口大小变化
  window.addEventListener("resize", () => {
    player.JS_Resize();
  });
}

// 暂停回放
function playbackPause() {
  player.JS_Pause().then(
    () => {
      console.log("playbackPause success");
      state.value = 3;
    },
    e => {
      console.error("playbackPause", e);
      state.value = 3;
    }
  );
}

// 恢复回放
function playbackResume() {
  player.JS_Resume().then(
    () => {
      console.log("playbackResume success");
      state.value = 2;
    },
    e => {
      console.error("playbackResume", e);
      state.value = 2;
    }
  );
}

function playStop() {
  player.JS_Stop().then(
    () => {
      console.log("stop realplay success");
      state.value = 1;
    },
    e => {
      console.error("playStop", e);
      state.value = 1;
    }
  );
}

// 抓取图片
function capture(imageType) {
  const curIndex = player.currentWindowIndex;
  player.JS_CapturePicture(curIndex, task.value, imageType).then(
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
    fileName = task.value + `.mp4`,
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
</script>
<template>
  <div class="main">
    <div class="source-card">
      <el-card header="施工任务" :body-style="{ padding: '10px 15px' }">
        <el-input v-model="task" readonly />
      </el-card>
      <el-card header="设备编号" :body-style="{ padding: '10px 15px' }">
        <el-radio-group v-model="plate_checked">
          <el-radio
            v-for="item in plateList"
            :key="item.id"
            :label="item.plateNum"
          />
        </el-radio-group>
      </el-card>
      <el-card style="flex-grow: 1" :body-style="{ padding: '10px 15px' }">
        <div style="display: flex">
          <el-form-item label="记录开始时间">
            <el-date-picker
              v-model="beginTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              readonly
            />
          </el-form-item>
          <el-form-item label="记录结束时间" style="margin-left: 20px">
            <el-date-picker
              v-model="endTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              readonly
            />
          </el-form-item>
        </div>
      </el-card>
    </div>
    <div
      class="mc-player"
      :style="{ marginTop: '15px', width: '100%', height: '72vh' }"
    >
      <div id="player" />
      <div class="mc-footer">
        <div style="display: flex">
          <el-link
            :underline="false"
            :icon="useRenderIcon('play-fill')"
            @click="playbackStart"
            v-if="state === 1"
          />
          <el-link
            :underline="false"
            :icon="useRenderIcon('pause-fill')"
            @click="playbackPause"
            v-if="state === 2"
          />
          <el-link
            :underline="false"
            :icon="useRenderIcon('stop-fill')"
            @click="playStop"
            v-if="state === 2"
          />
          <el-link
            :underline="false"
            :icon="useRenderIcon('play-fill')"
            @click="playbackResume"
            v-if="state === 3"
          />
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
  </div>
</template>

<style scoped lang="scss">
.source-card {
  display: flex;

  .el-card + .el-card {
    margin-left: 15px;
  }

  ::v-deep(.el-card__header) {
    text-align: center;
    padding: 10px 10px 0;
    border-bottom: none;
    font-weight: 600;
    color: #606266;
  }

  ::v-deep(.el-form-item) {
    margin-bottom: 0px;
  }

  ::v-deep(.el-input__inner) {
    text-align: center;
  }
}

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
  padding: 5px 10px;
  background: #000;

  .el-link {
    font-size: 22px;
    margin: 5px;
    color: #fff;
  }
}
</style>
