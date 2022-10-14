<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, reactive } from "vue";
import { getToken } from "/@/utils/auth";
import { getOnlineTruckList } from "/@/api/truck";

// components
import empty from "/@/views/common/empty.vue";
import board from "./components/Board.vue";

let curr_task = ref(""), // 当前任务
  taskList = reactive([]), // 任务列表
  curr_plateNum = ref(""), // 当前设备
  truckList = ref([]), // 设备列表
  nowTime = ref(""), // 采集时间
  formData1 = ref([]),
  formData2 = ref([]),
  formData3 = ref([]),
  formData4 = ref([]);

const labels1 = ref([
  "发动机转速",
  "发动机扭矩",
  "发动机负载",
  "电瓶电压",
  "开关后电压",
  "总运行时间",
  "车辆总里程",
  "机油压力",
  "机油温度",
  "冷却液压力",
  "冷却液温度",
  "输油压力",
  "燃油温度",
  "中冷器温度",
  "废气温度",
  "进歧管温度",
  "空滤压差",
  "燃油液位",
  "当前油耗",
  "总燃油消耗",
  "燃油消耗率",
  "油门开度",
  "尿素液位",
  "变速箱油温",
  "请求档位",
  "实际档位"
]);

const subs1 = ref([
  "rpm",
  "%",
  "%",
  "V",
  "V",
  "hr",
  "km",
  "KPa",
  "℃",
  "KPa",
  "℃",
  "KPa",
  "℃",
  "℃",
  "℃",
  "℃",
  "KPa",
  "%",
  "L",
  "L",
  "L/h",
  "%",
  "%",
  "℃",
  "",
  ""
]);

const labels2 = ref([
  "混浆密度",
  "A泵压力",
  "B泵压力",
  "A泵瞬时",
  "B泵瞬时",
  "双泵瞬时",
  "A泵累计",
  "B泵累计",
  "双泵累计",
  "清水瞬时",
  "清水累计",
  "A泵替瞬时",
  "B泵替瞬时",
  "A泵替累计",
  "B泵替累计",
  "灰阀阀位",
  "水阀阀位",
  "混浆液位",
  "A泵油压",
  "A泵油温",
  "B泵油压",
  "B泵油温"
]);

const subs2 = ref([
  "g/cm³",
  "MPa",
  "MPa",
  "m³/min",
  "m³/min",
  "m³/min",
  "m³",
  "m³",
  "m³",
  "m³/min",
  "m³",
  "m³/min",
  "m³/min",
  "m³",
  "m³",
  "%",
  "%",
  "%",
  "bar",
  "℃",
  "bar",
  "℃"
]);

// 和服务端连接的socket对象
let ws = null,
  connected = ref(false);

// 切换施工任务
function onTaskChange(val) {
  curr_plateNum.value = truckList.value.filter(
    item => item.task === val
  )[0].plateNum;
  nowTime.value = "";
  formData1.value = [];
  formData2.value = [];
  formData3.value = [];
  formData4.value = [];
  ws.close();
  initWebSocket();
}

// 切换订阅设备
function onPlateChange() {
  nowTime.value = "";
  formData1.value = [];
  formData2.value = [];
  formData3.value = [];
  formData4.value = [];
  ws.close();
  initWebSocket();
}

// 获取在线设备列表
async function getOnline() {
  let { data } = await getOnlineTruckList();
  data.forEach(item => {
    const task = `${item.wellName} ${item.wellType}`;
    if (!taskList.includes(task)) taskList.push(task);
    truckList.value.push({ task, ...item });
  });
  if (data.length > 0) {
    curr_task.value = taskList[0];
    curr_plateNum.value = truckList.value.filter(
      item => item.task === curr_task.value
    )[0].plateNum;
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
      plateNums: [curr_plateNum.value],
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
    if (typeof res.data == "object") {
      const { sj } = res.data;
      const time =
        sj.slice(0, 4) +
        "-" +
        sj.slice(4, 6) +
        "-" +
        sj.slice(6, 8) +
        " " +
        sj.slice(8, 10) +
        ":" +
        sj.slice(10, 12) +
        ":" +
        sj.slice(12, 14);
      nowTime.value = time;

      const clean_data = clean(res.data);

      formData1.value = [
        clean_data.dpfdjzs,
        clean_data.dpfdjnj,
        clean_data.dpfdjfz,
        clean_data.dpdpdy,
        clean_data.dpdpkgdy,
        clean_data.dpzyxsj,
        clean_data.dpzlc,
        clean_data.dpjyyl,
        clean_data.dpjywd,
        clean_data.dplqyyl,
        clean_data.dplqywd,
        clean_data.dpsyyl,
        clean_data.dprywd,
        clean_data.dpzlqwd,
        clean_data.dpfdjfqwd,
        clean_data.dpjqgwd,
        clean_data.dpkqlyc,
        clean_data.dpryyw,
        clean_data.dpyhdc,
        clean_data.dpzyh,
        clean_data.dpryxhb,
        clean_data.dpymtb,
        clean_data.dpnsyw,
        clean_data.dpbsxyw,
        clean_data.dpbsxqqdw,
        clean_data.dpbsxdw
      ];

      formData2.value = [
        clean_data.Apfdjzs,
        clean_data.Apfdjnj,
        clean_data.Apfdjfz,
        clean_data.Apdpdy,
        clean_data.Apdpkgdy,
        clean_data.Apzyxsj,
        clean_data.Apzlc,
        clean_data.Apjyyl,
        clean_data.Apjywd,
        clean_data.Aplqyyl,
        clean_data.Aplqywd,
        clean_data.Apsyyl,
        clean_data.Aprywd,
        clean_data.Apzlqwd,
        clean_data.Apfdjfqwd,
        clean_data.Apjqgwd,
        clean_data.Apkqlyc,
        clean_data.Apryyw,
        clean_data.Apyhdc,
        clean_data.Apzyh,
        clean_data.Apryxhb,
        clean_data.Apymtb,
        clean_data.Apnsyw,
        clean_data.Apbsxyw,
        clean_data.Apbsxqqdw,
        clean_data.Apbsxdw
      ];

      formData3.value = [
        clean_data.Bpfdjzs,
        clean_data.Bpfdjnj,
        clean_data.Bpfdjfz,
        clean_data.Bpdpdy,
        clean_data.Bpdpkgdy,
        clean_data.Bpzyxsj,
        clean_data.Bpzlc,
        clean_data.Bpjyyl,
        clean_data.Bpjywd,
        clean_data.Bplqyyl,
        clean_data.Bplqywd,
        clean_data.Bpsyyl,
        clean_data.Bprywd,
        clean_data.Bpzlqwd,
        clean_data.Bpfdjfqwd,
        clean_data.Bpjqgwd,
        clean_data.Bpkqlyc,
        clean_data.Bpryyw,
        clean_data.Bpyhdc,
        clean_data.Bpzyh,
        clean_data.Bpryxhb,
        clean_data.Bpymtb,
        clean_data.Bpnsyw,
        clean_data.Bpbsxyw,
        clean_data.Bpbsxqqdw,
        clean_data.Bpbsxdw
      ];

      formData4.value = [
        clean_data.md,
        clean_data.Abyl,
        clean_data.Bbyl,
        clean_data.Abll,
        clean_data.Bbll,
        clean_data.Zssll,
        clean_data.Ablj,
        clean_data.Bblj,
        clean_data.Zlj,
        clean_data.Qsll,
        clean_data.Qslj,
        clean_data.AbDcll,
        clean_data.BbDcll,
        clean_data.AbDclllj,
        clean_data.BbDclllj,
        clean_data.Hffw,
        clean_data.Sffw,
        clean_data.Yw,
        clean_data.Abyy,
        clean_data.Abyw,
        clean_data.Bbyy,
        clean_data.Bbyw
      ];
    }
  };
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
</script>

<template>
  <div class="main">
    <el-card header="数据来源" v-if="taskList.length > 0">
      <el-form :inline="true">
        <el-form-item label="采集时间">
          <el-input v-model="nowTime" />
        </el-form-item>
        <el-form-item label="施工任务">
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
        <el-form-item label="设备编号">
          <el-radio-group v-model="curr_plateNum" @change="onPlateChange">
            <el-radio
              v-for="item in truckList"
              :key="item.id"
              :label="item.plateNum"
              v-show="item.task === curr_task"
            />
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-else>
      <empty title="当前无设备在线" />
    </el-card>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <board
          :type="connected ? 1 : 2"
          header="底盘通讯"
          :footer="curr_plateNum + ' 底盘柴油机'"
          :labels="labels1"
          :subs="subs1"
          :formData="formData2"
        />
      </el-col>
      <el-col :span="12">
        <board
          :type="connected ? 1 : 2"
          header="A侧动力通讯"
          :footer="curr_plateNum + ' 台上A侧参数'"
          :labels="labels1"
          :subs="subs1"
          :formData="formData1"
        />
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <board
          :type="connected ? 1 : 2"
          header="B侧动力通讯"
          :footer="curr_plateNum + ' 台上B侧参数'"
          :labels="labels1"
          :subs="subs1"
          :formData="formData3"
        />
      </el-col>
      <el-col :span="12">
        <board
          :type="connected ? 1 : 2"
          header="PLC通讯"
          :footer="curr_plateNum + ' 工程作业参数'"
          :labels="labels2"
          :subs="subs2"
          :formData="formData4"
        />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
::v-deep(.el-form-item) {
  margin-right: 40px;
}
</style>
