<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { getToken } from "/@/utils/auth";
import { getOnlineTruckList } from "/@/api/truck";

// components
import empty from "/@/views/common/empty.vue";
import board from "./components/Board.vue";

let selected_task = ref(""), // 当前选中任务
  taskList = ref([]), // 当前任务列表
  checked_plateNum = ref(""), // 当前选中设备
  // curr_equType = ref(""),
  truckList = ref([]), // 当前在线设备列表
  nowTime = ref(""), // 采集时间
  formData1 = ref([]),
  formData2 = ref([]),
  formData3 = ref([]),
  formData4 = ref([]),
  flag_arr = ref(["0", "0", "0", "0"]);

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
  checked_plateNum.value = truckList.value.filter(
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
    if (!taskList.value.includes(task)) taskList.value.push(task);
    truckList.value.push({ task, ...item });
  });
  if (data.length > 0) {
    selected_task.value = taskList.value[0];
    checked_plateNum.value = truckList.value.filter(
      item => item.task === selected_task.value
    )[0].plateNum;
    initWebSocket();
  }
}

// A泵、底盘、B泵 非负整数
function clean1(params: object) {
  const res = {};
  for (var i in params) {
    if (params[i] < 0) {
      res[i] = 0;
    } else {
      res[i] = parseFloat(params[i]).toFixed(0);
    }
  }
  return res;
}

// plc 保留三位小数
function clean2(params: object) {
  const res = {};
  for (var i in params) {
    if (params[i] != 0 && ["jd", "wd", "sj", "flag"].indexOf(i) === -1) {
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
      plateNums: [checked_plateNum.value],
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
      const { sj, flag } = res.data;
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

      flag_arr.value = (flag + "").split("");

      const data1 = [
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

      formData1.value = clean1(data1);

      const data2 = [
        res.data.apfdjzs,
        res.data.apfdjnj,
        res.data.apfdjfz,
        res.data.apdpdy,
        res.data.apdpkgdy,
        res.data.apzyxsj,
        res.data.apzlc,
        res.data.apjyyl,
        res.data.apjywd,
        res.data.aplqyyl,
        res.data.aplqywd,
        res.data.apsyyl,
        res.data.aprywd,
        res.data.apzlqwd,
        res.data.apfdjfqwd,
        res.data.apjqgwd,
        res.data.apkqlyc,
        res.data.apryyw,
        res.data.apyhdc,
        res.data.apzyh,
        res.data.apryxhb,
        res.data.apymtb,
        res.data.apnsyw,
        res.data.apbsxyw,
        res.data.apbsxqqdw,
        res.data.apbsxdw
      ];

      formData2.value = clean1(data2);

      const data3 = [
        res.data.bpfdjzs,
        res.data.bpfdjnj,
        res.data.bpfdjfz,
        res.data.bpdpdy,
        res.data.bpdpkgdy,
        res.data.bpzyxsj,
        res.data.bpzlc,
        res.data.bpjyyl,
        res.data.bpjywd,
        res.data.bplqyyl,
        res.data.bplqywd,
        res.data.bpsyyl,
        res.data.bprywd,
        res.data.bpzlqwd,
        res.data.bpfdjfqwd,
        res.data.bpjqgwd,
        res.data.bpkqlyc,
        res.data.bpryyw,
        res.data.bpyhdc,
        res.data.bpzyh,
        res.data.bpryxhb,
        res.data.bpymtb,
        res.data.bpnsyw,
        res.data.bpbsxyw,
        res.data.bpbsxqqdw,
        res.data.bpbsxdw
      ];

      formData3.value = clean1(data3);

      const data4 = [
        res.data.md,
        res.data.abyl,
        res.data.bbyl,
        res.data.abll,
        res.data.bbll,
        res.data.zssll,
        res.data.ablj,
        res.data.bblj,
        res.data.zlj,
        res.data.qsll,
        res.data.qslj,
        res.data.abdcll,
        res.data.bbdcll,
        res.data.abdclllj,
        res.data.bbdclllj,
        res.data.hffw,
        res.data.sffw,
        res.data.yw,
        res.data.abyy,
        res.data.abyw,
        res.data.bbyy,
        res.data.bbyw
      ];

      formData4.value = clean2(data4);
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
    <template v-if="taskList.length > 0">
      <div class="source-card">
        <el-card>
          <el-form-item label="采集时间">
            <el-input v-model="nowTime" />
          </el-form-item>
        </el-card>
        <el-card>
          <el-form-item label="施工任务">
            <el-select
              v-model="selected_task"
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
        <el-card style="flex-grow: 1">
          <el-form-item label="设备编号">
            <el-radio-group v-model="checked_plateNum" @change="onPlateChange">
              <el-radio
                v-for="item in truckList"
                :key="item.id"
                :label="item.plateNum"
                v-show="item.task === selected_task"
              />
            </el-radio-group>
          </el-form-item>
        </el-card>
      </div>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <board
            :type="connected && flag_arr[2] === '1' ? 1 : 2"
            header="底盘通讯"
            :footer="checked_plateNum + ' 底盘柴油机'"
            :labels="labels1"
            :subs="subs1"
            :formData="formData2"
          />
        </el-col>
        <el-col :span="12">
          <board
            :type="connected && flag_arr[1] === '1' ? 1 : 2"
            header="A侧动力通讯"
            :footer="checked_plateNum + ' 台上A侧参数'"
            :labels="labels1"
            :subs="subs1"
            :formData="formData1"
          />
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <board
            :type="connected && flag_arr[3] === '1' ? 1 : 2"
            header="B侧动力通讯"
            :footer="checked_plateNum + ' 台上B侧参数'"
            :labels="labels1"
            :subs="subs1"
            :formData="formData3"
          />
        </el-col>
        <el-col :span="12">
          <board
            :type="connected && flag_arr[0] === '1' ? 1 : 2"
            header="PLC通讯"
            :footer="checked_plateNum + ' 工程作业参数'"
            :labels="labels2"
            :subs="subs2"
            :formData="formData4"
          />
        </el-col>
      </el-row>
    </template>

    <el-card v-else>
      <empty title="当前无设备在线" />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.source-card {
  display: flex;

  .el-card + .el-card {
    margin-left: 15px;
  }

  ::v-deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 0;
  }
}
</style>
