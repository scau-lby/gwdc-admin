<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, reactive, nextTick } from "vue";
import { getToken } from "/@/utils/auth";
import { getOnlineTruckList } from "/@/api/truck";

// 动态标签页
import { useDetail } from "/@/views/home/components/onlineTable/hooks";
const { initToDetail, id } = useDetail();
initToDetail();

// components
import empty from "/@/views/common/empty.vue";
import liveForm from "./components/LiveForm.vue";
import liveLine from "./components/LiveLine.vue";

import liveFormMixed from "./components/liveFormMixed.vue";
import liveLineMixed from "./components/liveLineMixed.vue";
const chartRef = ref(null);

let taskList = reactive([]), // 任务列表
  truckList = reactive([]), // 在线设备列表
  mixed = ref(0), // 0 单机 1 合并
  curr_task = ref(""), // 当前任务
  curr_plateNum = ref([]), // 当前设备
  keys = ref([]), // 当前选中设备
  formData = ref([]),
  chartData = ref({});

// 获取在线设备列表
async function getOnline() {
  let { data } = await getOnlineTruckList();
  data.forEach(item => {
    const task = `${item.wellName} ${item.wellType}`;
    if (!taskList.includes(task)) taskList.push(task);
    truckList.push({ task, ...item });
  });
  if (data.length > 0) {
    if (id) {
      curr_task.value = truckList.filter(item => item.plateNum === id)[0].task;
      curr_plateNum.value = [id];
      if (mixed.value === 1) {
        keys.value = [curr_plateNum.value.join("/")];
      } else {
        keys.value = curr_plateNum.value;
      }
    } else {
      curr_task.value = taskList[0];
      curr_plateNum.value = [
        truckList.filter(item => item.task === curr_task.value)[0].plateNum
      ];
      if (mixed.value === 1) {
        keys.value = [curr_plateNum.value.join("/")];
      } else {
        keys.value = curr_plateNum.value;
      }
    }

    nextTick(() => {
      formData.value = keys.value.map(() => []);
      keys.value.forEach(item => {
        chartData.value[item] = [];
      });
    });

    initWebSocket();
  }
}

function clean(params: object) {
  const res = {};
  for (var i in params) {
    if (params[i] != 0 && ["jd", "wd", "sj"].indexOf(i) === -1) {
      res[i] = parseFloat(params[i]).toFixed(3);
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
  if (!window.WebSocket) {
    return console.log("您的浏览器不支持WebSocket");
  }
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }
  let url = `ws://59.47.54.83:7002/truck/real/ws?token=${accessToken}`;
  ws = new WebSocket(url);
  ws.onopen = () => {
    connected.value = true;

    const send_data = {
      plateNums: curr_plateNum.value,
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
      formData.value = keys.value.map((item, index) => {
        if (item == res.plateNum) {
          return clean_data;
        } else {
          return formData.value[index];
        }
      });

      const { sj, ...params } = clean_data;
      const time =
        sj.slice(8, 10) + ":" + sj.slice(10, 12) + ":" + sj.slice(12, 14);
      keys.value.forEach(item => {
        if (item == res.plateNum) {
          chartData.value[item].push({
            sj: time,
            ...params
          });
        }
      });
    }
  };
}

// 切换订阅方式
function onMixedChange(value) {
  if (value === 1) {
    // 合并
    keys.value = [curr_plateNum.value.join("/")];
  } else {
    keys.value = curr_plateNum.value;
  }

  nextTick(() => {
    formData.value = keys.value.map(() => []);
    keys.value.forEach(item => {
      chartData.value[item] = [];
    });
  });

  ws.close();
  initWebSocket();
}

// 切换施工任务
function onTaskChange(val) {
  mixed.value = 0;
  curr_plateNum.value = [
    truckList.filter(item => item.task === val)[0].plateNum
  ];
  keys.value = curr_plateNum.value;

  nextTick(() => {
    formData.value = keys.value.map(() => []);
    keys.value.forEach(item => {
      chartData.value[item] = [];
    });
  });

  ws.close();
  initWebSocket();
}

// 切换订阅设备
function onPlateChange(value) {
  if (mixed.value === 1) {
    keys.value = [value.join("/")];
  } else {
    keys.value = value;
  }

  nextTick(() => {
    formData.value = keys.value.map(() => []);
    keys.value.forEach(item => {
      chartData.value[item] = [];
    });
  });

  ws.close();
  initWebSocket();
}

onMounted(() => {
  getOnline();
});

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
</script>
<template>
  <div class="main">
    <el-card class="source-card" v-if="taskList.length > 0">
      <el-form :inline="true">
        <el-form-item label="数据来源" />
        <el-form-item label="施工任务" style="margin-left: 50px">
          <el-select
            v-model="curr_task"
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
        <el-form-item label="订阅方式">
          <el-radio-group v-model="mixed" @change="onMixedChange">
            <el-radio :label="0">单机</el-radio>
            <el-radio :label="1">合并</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="在线设备">
          <el-checkbox-group v-model="curr_plateNum" @change="onPlateChange">
            <el-checkbox
              v-for="item in truckList"
              :key="item.id"
              :label="item.plateNum"
              v-show="item.task === curr_task"
            />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-else>
      <empty title="当前无设备在线" />
    </el-card>
    <el-row :gutter="10" style="margin-top: 10px" v-if="mixed === 0">
      <el-col
        v-for="(item, index) in curr_plateNum"
        :key="index"
        class="live-container"
        :span="curr_plateNum.length > 1 ? 12 : 24"
      >
        <el-card
          class="live-line"
          :header="curr_task + ' / ' + curr_plateNum[index] + ' / 作业实时曲线'"
        >
          <liveLine
            ref="chartRef"
            :index="index"
            :chartData="chartData[curr_plateNum[index]]"
          />
        </el-card>
        <el-card
          class="live-form"
          :header="curr_task + ' / ' + curr_plateNum[index] + ' / 作业实时数据'"
        >
          <liveForm
            :formData="formData[index]"
            :index="index"
            @type="getType"
          />
        </el-card>
      </el-col>
    </el-row>
    <div class="live-container" style="margin-top: 20px" v-else>
      <el-card
        class="live-line"
        :header="curr_task + ' / 作业实时曲线(' + keys + ')'"
      >
        <liveLineMixed
          ref="chartRef"
          :index="100"
          :chartData="chartData[keys[0]]"
        />
      </el-card>
      <el-card
        class="live-form"
        :header="curr_task + ' / 作业实时数据(' + keys + ')'"
      >
        <liveFormMixed :formData="formData[0]" :index="100" @type="getType" />
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.source-card {
  ::v-deep(.el-form-item) {
    margin-right: 40px;
  }
}

::v-deep(.el-form-item) {
  margin-bottom: 0px;
}

.live-container {
  display: flex !important;
  flex-direction: row;
}

.live-line {
  width: calc(100% - 290px);
}

.live-form {
  width: 280px;
  margin-left: 10px;
}
</style>
