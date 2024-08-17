<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { getOnlineTruckList } from "/@/api/truck";
import { getPreviewUrlByPlatenums, setControlCmd } from "/@/api/video";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
// components
import Control from "./components/Control.vue";

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
  </div>
</template>

<style scoped lang="scss">
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
