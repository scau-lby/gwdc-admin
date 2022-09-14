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
    console.log(res);
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

      formData1.value = [
        res.data.dpfdjzs,
        res.data.dpfdjnj,
        res.data.dpfdjfz,
        res.data.dpdpdy,
        res.data.dpdpkgdy,
        res.data.dpzyxsj,
        res.data.dpzlc,
        res.data.dpjyyl,
        res.data.dpjywd,
        res.data.dplqyyl,
        res.data.dplqywd,
        res.data.dpsyyl,
        res.data.dprywd,
        res.data.dpzlqwd,
        res.data.dpfdjfqwd,
        res.data.dpjqgwd,
        res.data.dpkqlyc,
        res.data.dpryyw,
        res.data.dpyhdc,
        res.data.dpzyh,
        res.data.dpryxhb,
        res.data.dpymtb,
        res.data.dpnsyw,
        res.data.dpbsxyw,
        res.data.dpbsxqqdw,
        res.data.dpbsxdw
      ];

      formData2.value = [
        res.data.Apfdjzs,
        res.data.Apfdjnj,
        res.data.Apfdjfz,
        res.data.Apdpdy,
        res.data.Apdpkgdy,
        res.data.Apzyxsj,
        res.data.Apzlc,
        res.data.Apjyyl,
        res.data.Apjywd,
        res.data.Aplqyyl,
        res.data.Aplqywd,
        res.data.Apsyyl,
        res.data.Aprywd,
        res.data.Apzlqwd,
        res.data.Apfdjfqwd,
        res.data.Apjqgwd,
        res.data.Apkqlyc,
        res.data.Apryyw,
        res.data.Apyhdc,
        res.data.Apzyh,
        res.data.Apryxhb,
        res.data.Apymtb,
        res.data.Apnsyw,
        res.data.Apbsxyw,
        res.data.Apbsxqqdw,
        res.data.Apbsxdw
      ];

      formData3.value = [
        res.data.Bpfdjzs,
        res.data.Bpfdjnj,
        res.data.Bpfdjfz,
        res.data.Bpdpdy,
        res.data.Bpdpkgdy,
        res.data.Bpzyxsj,
        res.data.Bpzlc,
        res.data.Bpjyyl,
        res.data.Bpjywd,
        res.data.Bplqyyl,
        res.data.Bplqywd,
        res.data.Bpsyyl,
        res.data.Bprywd,
        res.data.Bpzlqwd,
        res.data.Bpfdjfqwd,
        res.data.Bpjqgwd,
        res.data.Bpkqlyc,
        res.data.Bpryyw,
        res.data.Bpyhdc,
        res.data.Bpzyh,
        res.data.Bpryxhb,
        res.data.Bpymtb,
        res.data.Bpnsyw,
        res.data.Bpbsxyw,
        res.data.Bpbsxqqdw,
        res.data.Bpbsxdw
      ];

      formData4.value = [
        res.data.md,
        res.data.Abyl,
        res.data.Bbyl,
        res.data.Abll,
        res.data.Bbll,
        res.data.Zssll,
        res.data.Ablj,
        res.data.Bblj,
        res.data.Zlj,
        res.data.Qsll,
        res.data.Qslj,
        res.data.AbDcll,
        res.data.BbDcll,
        res.data.AbDclllj,
        res.data.BbDclllj,
        res.data.Hffw,
        res.data.Sffw,
        res.data.Yw,
        res.data.Abyy,
        res.data.Abyw,
        res.data.Bbyy,
        res.data.Bbyw
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
          :type="1"
          header="底盘通讯"
          :footer="curr_plateNum + ' 底盘柴油机'"
          :labels="labels1"
          :subs="subs1"
          :formData="formData1"
        />
      </el-col>
      <el-col :span="12">
        <board
          :type="1"
          header="A侧动力通讯"
          :footer="curr_plateNum + ' 台上A侧参数'"
          :labels="labels1"
          :subs="subs1"
          :formData="formData2"
        />
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <board
          :type="1"
          header="B侧动力通讯"
          :footer="curr_plateNum + ' 台上B侧参数'"
          :labels="labels1"
          :subs="subs1"
          :formData="formData3"
        />
      </el-col>
      <el-col :span="12">
        <board
          :type="2"
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
