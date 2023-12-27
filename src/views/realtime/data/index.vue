<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { getToken } from "/@/utils/auth";
import { getOnlineTruckList } from "/@/api/truck";
import { getWellMoreInfo } from "/@/api/well";
import { useTrtcStoreHook } from "/@/store/modules/trtc";

// components
import empty from "/@/views/common/empty.vue";
// 合并
import mixedForm from "/@/components/dataForm/MixedForm.vue";
import mixedLine from "/@/components/dataLine/MixedLine.vue";
// 双机车、双机橇
import dualForm from "/@/components/dataForm/DualForm.vue";
import dualLine from "/@/components/dataLine/DualLine.vue";
// 单机车、单机橇
import singleForm from "/@/components/dataForm/SingleForm.vue";
import singleLine from "/@/components/dataLine/SingleLine.vue";
// 语音
import trtcComp from "/@/components/Trtc/index.vue";
// moreInfo
import moreInfoDialog from "../../home/components/wellTable/MoreInfoDialog.vue";

// 动态标签页
import { useDetail } from "/@/views/home/components/onlineTable/hooks";
const { initToDetail, id } = useDetail();
initToDetail();

const store = useTrtcStoreHook();

const chartRef = ref(null);

let onlineList = [], // 在线设备列表
  plateList = ref([]), // 当前选中任务对应的设备列表
  taskList = ref([]), // 任务列表
  task_selected = ref(""), // 当前任务
  plates_checked = ref([]), // 当前选中设备编号数组
  keys = ref([]), // 当前选中设备的join字符串，合并时使用
  mixed = ref(0), // 0 单机 1 合并
  msgData = ref([]); // 传递数组
const hasMoreInfo = ref(false);

const timer = ref(null);

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
    if (id) {
      task_selected.value = onlineList.filter(
        item => item.plateNum === id
      )[0].task;
      plateList.value = onlineList.filter(
        item => item.task === task_selected.value
      );
      plates_checked.value = [id];

      if (mixed.value === 1) {
        keys.value = [plates_checked.value.join("/")];
      } else {
        keys.value = plates_checked.value;
      }
    } else {
      task_selected.value = taskList.value[0];
      plateList.value = onlineList.filter(
        item => item.task === task_selected.value
      );
      plates_checked.value = [plateList.value[0].plateNum];

      if (mixed.value === 1) {
        keys.value = [plates_checked.value.join("/")];
      } else {
        keys.value = plates_checked.value;
      }
    }

    msgData.value = keys.value.map(item => {
      return {
        ...plateList.value.filter(row => row.plateNum === item)[0],
        detail: null
      };
    });

    initWebSocket();
  }
}

// 切换施工任务
function onTaskChange(val) {
  task_selected.value = val;
  mixed.value = 0;
  plateList.value = onlineList.filter(item => item.task === val);

  plates_checked.value = [plateList.value[0].plateNum];

  keys.value = plates_checked.value;

  msgData.value = keys.value.map(item => {
    return {
      ...plateList.value.filter(row => row.plateNum === item)[0],
      detail: null
    };
  });
  ws.close();
  initWebSocket();
}

// 切换订阅方式
function onMixedChange(value) {
  ws.close();
  if (value === 1) {
    keys.value = [plates_checked.value.join("/")];

    msgData.value = keys.value.map(item => {
      return {
        plateNum: item,
        wellName: task_selected.value.split(" @ ")[0],
        wellType: task_selected.value.split(" @ ")[1],
        detail: null
      };
    });
  } else {
    keys.value = plates_checked.value;

    msgData.value = keys.value.map(item => {
      return {
        ...plateList.value.filter(row => row.plateNum === item)[0],
        detail: null
      };
    });
  }

  initWebSocket();
}

// 切换订阅设备
function onPlateChange(value) {
  mixed.value = 0;
  keys.value = value;
  msgData.value = keys.value.map(item => {
    return {
      ...plateList.value.filter(row => row.plateNum === item)[0],
      detail: null
    };
  });

  ws.close();
  initWebSocket();
}

watch(
  () => task_selected,
  val => {
    if (val) {
      const wellName = val.value.split(" @ ")[0];
      getWellMoreInfo(wellName)
        .then(({ status }) => {
          if (status === 200) {
            hasMoreInfo.value = true;
          } else {
            hasMoreInfo.value = false;
          }
        })
        .catch(() => {
          hasMoreInfo.value = false;
        });
    }
  },
  { deep: true }
);

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

// 和服务端连接的socket对象
let ws = null,
  connected = ref(false);

function initWebSocket() {
  timer.value = new Date().getTime();
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
      plateNums: plates_checked.value,
      mixed: mixed.value,
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

    if (typeof res.data == "object") {
      // 对所有数据进行清洗
      const clean_data = clean(res.data);

      const { sj } = clean_data;
      const time =
        sj.slice(8, 10) + ":" + sj.slice(10, 12) + ":" + sj.slice(12, 14);

      msgData.value.forEach(item => {
        if (item.plateNum === res.plateNum) {
          item.detail = {
            time,
            ...clean_data
          };
        }
      });
    }
  };
}

onMounted(() => {
  getOnline();
});

const moreInfoDialogVisible = ref(false);
const curr_wellName = ref(null);
async function onGetMore() {
  curr_wellName.value = task_selected.value.split(" @ ")[0];
  moreInfoDialogVisible.value = true;
}

onBeforeUnmount(() => {
  if (ws !== null) {
    ws.close();
    ws = null;
  }
});

const getType = val => {
  const { type, idx } = val;
  if (mixed.value === 1) {
    chartRef.value.legend_toggle(type);
  } else {
    chartRef.value[idx].legend_toggle(type);
  }
};
const trtcRef = ref(null);
function handleJoin() {
  trtcRef.value.handleJoin();
}
function handleLeave() {
  trtcRef.value.handleLeave();
}
// const value = ref([]);

// const props = {
//   multiple: true,
//   expandTrigger: "hover" as const
// };

// const handleCascaderChange = value => {
//   console.log(value);
// };

// const options = ref([]);
</script>
<template>
  <div class="main">
    <template v-if="taskList.length > 0">
      <!-- <el-card>
        <el-form-item label="施工任务/井号">
          <el-cascader
            popper-class="last-check"
            v-model="value"
            :options="options"
            :props="props"
            @change="handleCascaderChange"
            clearable
          />
        </el-form-item>
      </el-card> -->
      <div class="source-card">
        <el-card>
          <el-button type="danger" @click="handleLeave" v-if="store.isJoined">
            关闭语音对讲
          </el-button>
          <el-button type="success" @click="handleJoin" v-else>
            发起语音对讲
          </el-button>
        </el-card>
        <el-card>
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
        </el-card>
        <el-card>
          <el-form-item label="订阅方式">
            <el-radio-group v-model="mixed" @change="onMixedChange">
              <el-radio :label="0">单机</el-radio>
              <el-radio :label="1" v-if="plateList.length > 1"> 合并 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-card>
        <el-card
          :body-style="{
            display: 'flex',
            justifyContent: 'space-between'
          }"
          style="flex-grow: 1; flex-shrink: 1"
        >
          <el-form-item label="在线设备">
            <el-checkbox-group v-model="plates_checked" @change="onPlateChange">
              <el-checkbox
                v-for="item in plateList"
                :key="item.id"
                :label="item.plateNum"
              />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onGetMore"
              :disabled="!hasMoreInfo"
              v-auth="'100'"
            >
              查看井队作业参数
            </el-button>
          </el-form-item>
        </el-card>
      </div>
      <div class="live-container" style="margin-top: 5px" v-if="mixed === 1">
        <el-card class="live-line">
          <mixedLine
            ref="chartRef"
            :index="100"
            :plateNum="msgData[0].plateNum"
            :wellName="msgData[0].wellName"
            :wellType="msgData[0].wellType"
            :data="msgData[0].detail"
            :title="task_selected + '(' + keys + ')'"
            :height="store.isJoined ? 45 : 80"
          />
        </el-card>
        <el-card class="live-form" :header="task_selected + '(' + keys + ')'">
          <mixedForm
            :formData="msgData[0].detail"
            :index="100"
            @type="getType"
          />
        </el-card>
      </div>
      <div
        style="margin-top: 5px; display: flex; justify-content: space-between"
        v-else
      >
        <div
          v-for="(item, index) in keys"
          :key="item"
          class="live-container"
          :style="{ width: keys.length > 1 ? '49.8%' : '100%' }"
        >
          <template
            v-if="
              msgData[index].equType === '单机橇' ||
              msgData[index].equType === '单机车'
            "
          >
            <el-card class="live-line" style="width: 100%">
              <singleLine
                ref="chartRef"
                :data="msgData[index].detail"
                :index="index"
                :plateNum="msgData[index].plateNum"
                :wellName="msgData[index].wellName"
                :wellType="msgData[index].wellType"
                :key="msgData[index].plateNum + timer"
                :title="task_selected + '(' + keys[index] + ')'"
                :height="store.isJoined ? 45 : 80"
              />
            </el-card>
            <el-card
              class="live-form"
              :header="task_selected + '(' + keys[index] + ')'"
            >
              <singleForm
                :formData="msgData[index].detail"
                :index="index"
                :key="msgData[index].plateNum + timer"
                @type="getType"
              />
            </el-card>
          </template>
          <template v-else>
            <el-card class="live-line" style="width: 100%">
              <dualLine
                ref="chartRef"
                :data="msgData[index].detail"
                :index="index"
                :plateNum="msgData[index].plateNum"
                :wellName="msgData[index].wellName"
                :wellType="msgData[index].wellType"
                :key="msgData[index].plateNum + timer"
                :title="task_selected + '(' + keys[index] + ')'"
                :height="store.isJoined ? 55 : 80"
              />
            </el-card>
            <el-card
              class="live-form"
              :header="task_selected + '(' + keys[index] + ')'"
            >
              <dualForm
                :formData="msgData[index].detail"
                :index="index"
                :key="msgData[index].plateNum + timer"
                @type="getType"
              />
            </el-card>
          </template>
        </div>
      </div>
      <div style="margin-top: 5px">
        <trtcComp ref="trtcRef" />
      </div>
    </template>

    <el-card v-else>
      <empty title="当前无设备在线" />
    </el-card>

    <moreInfoDialog
      v-model:visible="moreInfoDialogVisible"
      :wellName="curr_wellName"
    />
  </div>
</template>

<style lang="scss">
.last-check {
  li[aria-haspopup="true"] {
    .el-checkbox {
      display: none;
    }
  }
}
</style>
<style scoped lang="scss">
.source-card {
  display: flex;

  .el-card + .el-card {
    margin-left: 5px;
  }

  ::v-deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 0;
  }
}

::v-deep(.el-card__header) {
  padding: 10px 20px !important;
}

::v-deep(.el-card__body) {
  padding: 10px 20px !important;
}

.live-form {
  width: 450px;
  margin-left: 5px;

  ::v-deep(.el-form-item) {
    margin-bottom: 0px;
  }
}

.live-container {
  display: flex !important;
  flex-direction: row;
}

.live-line {
  width: calc(100% - 200px);
}
</style>
