<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
// store
import { useHisDataStoreHook } from "/@/store/modules/hisData";
// api
import { getTruckList } from "/@/api/truck";
import {
  getHistoryReal,
  getFixedHistoryReal,
  getPlanSimulateByStep
} from "/@/api/well";
// header
import multiHeader from "/@/components/HisHeader/MultiHeader.vue";
// 合并
import mixedLine from "/@/components/dataLine/MixedLine.vue";
// 双机车、双机橇
import dualLine from "/@/components/dataLine/DualLine.vue";
// 单机车、单机橇
import singleLine from "/@/components/dataLine/SingleLine.vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

defineOptions({
  name: "HisData"
});

let timer = null;

const index = ref(0),
  dataList = ref([]),
  simulateData = ref([]),
  pageSize = ref(500),
  equType = ref("");

let mixed = ref(0),
  wellName = ref(useHisDataStoreHook().getWellName),
  wellType = ref(useHisDataStoreHook().getWellType),
  plate = ref(useHisDataStoreHook().getPlate),
  plates = ref(useHisDataStoreHook().getPlates),
  beginTime = ref(useHisDataStoreHook().getBeginTime),
  endTime = ref(useHisDataStoreHook().getEndTime);

const simulateVisible = ref(false);

const initialSteps = [
  {
    content: "注前置液",
    zero: false,
    timestamp: ""
  },
  {
    content: "注领浆",
    zero: false,
    timestamp: ""
  },
  {
    content: "注中间液",
    zero: false,
    timestamp: ""
  },
  {
    content: "注尾浆",
    zero: false,
    timestamp: ""
  },
  {
    content: "替压塞液",
    zero: false,
    timestamp: ""
  },
  {
    content: "替钻井液",
    zero: false,
    timestamp: ""
  },
  {
    content: "替清水",
    zero: false,
    timestamp: ""
  }
];
const steps = ref(initialSteps);

const curr_step = ref("注前置液");

function getPlanSimulate() {
  simulateVisible.value = true;
}

async function getSimulate(i) {
  const next_i = i + 1;
  if (next_i < steps.value.length) {
    const step = steps.value.filter((item, index) => index === i)[0];
    let { data } = await getPlanSimulateByStep(
      wellName.value,
      wellType.value,
      step.timestamp,
      step.content
    );
    curr_step.value = steps.value[next_i].content;
    if (data.length > 0) {
      const sj = data[data.length - 1].sj;
      steps.value[next_i].timestamp =
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
      simulateData.value[0] = {
        time:
          data[0].sj.slice(8, 10) +
          ":" +
          data[0].sj.slice(10, 12) +
          ":" +
          data[0].sj.slice(12, 14),
        mnmd: parseFloat(data[0].md),
        mnabll: parseFloat(data[0].abll),
        mnabljll: parseFloat(data[0].ablj)
      };
      simulateData.value[1] = {
        time:
          data[data.length - 1].sj.slice(8, 10) +
          ":" +
          data[data.length - 1].sj.slice(10, 12) +
          ":" +
          data[data.length - 1].sj.slice(12, 14),
        mnmd: parseFloat(data[data.length - 1].md),
        mnabll: parseFloat(data[data.length - 1].abll),
        mnabljll: parseFloat(data[data.length - 1].ablj)
      };
      console.log(simulateData.value);
    }
  } else {
    curr_step.value = "";
  }
}

watch(
  () => useHisDataStoreHook().getMixed,
  value => {
    mixed.value = value;
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => useHisDataStoreHook().getWellName,
  value => {
    wellName.value = value;
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => useHisDataStoreHook().getWellType,
  value => {
    wellType.value = value;
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => useHisDataStoreHook().getPlate,
  value => {
    plate.value = value;
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => useHisDataStoreHook().getPlates,
  value => {
    plates.value = value;
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => useHisDataStoreHook().getBeginTime,
  value => {
    beginTime.value = value;
    steps.value[0].timestamp =
      value.slice(0, 4) +
      "-" +
      value.slice(4, 6) +
      "-" +
      value.slice(6, 8) +
      " " +
      value.slice(8, 10) +
      ":" +
      value.slice(10, 12) +
      ":" +
      value.slice(12, 14);
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => useHisDataStoreHook().getEndTime,
  value => {
    endTime.value = value;
  },
  {
    deep: true,
    immediate: true
  }
);

async function getTableData() {
  index.value = new Date().getTime();
  dataList.value = [];
  simulateData.value = [];
  curr_step.value = "注前置液";

  steps.value = [];
  steps.value = initialSteps;

  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
  let pageNum = 1;
  if (mixed.value === 0) {
    const curr_plate = plate.value;
    const curr_beginTime = beginTime.value;
    const curr_endTime = endTime.value;
    let res = await getTruckList({
      pageNum: 1,
      pageSize: 1,
      plateNum: plate.value
    });
    equType.value = res.data.records[0].equType;
    // 单机
    const { status, data } = await getHistoryReal({
      wellName: wellName.value,
      wellType: wellType.value,
      plateNum: curr_plate,
      beginTime: curr_beginTime,
      endTime: curr_endTime,
      pageNum,
      pageSize: pageSize.value
    });
    if (status === 200) {
      dataList.value = data.records.map(item => clean(item));
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
      timer = setInterval(() => {
        if (pageNum < data.pages) {
          pageNum = pageNum + 1;
          getMoreRecords(0, curr_plate, curr_beginTime, curr_endTime, pageNum);
        } else {
          clearInterval(timer);
          timer = null;
        }
      }, 2000);
    }
  } else {
    // 合并
    equType.value = "合并";
    const curr_plates = plates.value.join(",");
    const curr_beginTime = beginTime.value;
    const curr_endTime = endTime.value;
    const { status, data } = await getFixedHistoryReal({
      wellName: wellName.value,
      wellType: wellType.value,
      plateNums: curr_plates,
      beginTime: curr_beginTime,
      endTime: curr_endTime,
      pageNum,
      pageSize: pageSize.value
    });
    if (status === 200) {
      dataList.value = data.records.map(item => clean(item));
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
      timer = setInterval(() => {
        if (pageNum < data.pages) {
          pageNum = pageNum + 1;
          getMoreFixedRecords(
            1,
            curr_plates,
            curr_beginTime,
            curr_endTime,
            pageNum
          );
        } else {
          clearInterval(timer);
          timer = null;
        }
      }, 2000);
    }
  }
}

function getMoreRecords(
  curr_mixed,
  curr_plate,
  curr_beginTime,
  curr_endTime,
  curr_pageNum
) {
  getHistoryReal({
    wellName: wellName.value,
    wellType: wellType.value,
    plateNum: curr_plate,
    beginTime: curr_beginTime,
    endTime: curr_endTime,
    pageNum: curr_pageNum,
    pageSize: pageSize.value
  })
    .then(res => {
      if (
        curr_mixed === mixed.value &&
        curr_plate === plate.value &&
        curr_beginTime === beginTime.value &&
        curr_endTime === endTime.value
      ) {
        dataList.value = res.data.records.map(item => clean(item));
      } else {
        index.value = new Date().getTime();
        simulateData.value = [];
      }
    })
    .catch(() => {
      clearInterval(timer);
      timer = null;
    });
}

function getMoreFixedRecords(
  curr_mixed,
  curr_plates,
  curr_beginTime,
  curr_endTime,
  curr_pageNum
) {
  getFixedHistoryReal({
    wellName: wellName.value,
    wellType: wellType.value,
    plateNums: curr_plates,
    beginTime: curr_beginTime,
    endTime: curr_endTime,
    pageNum: curr_pageNum,
    pageSize: pageSize.value
  })
    .then(res => {
      if (
        curr_mixed === mixed.value &&
        curr_plates === plates.value.join(",") &&
        curr_beginTime === beginTime.value &&
        curr_endTime === endTime.value
      ) {
        dataList.value = res.data.records.map(item => clean(item));
      } else {
        index.value = new Date().getTime();
        simulateData.value = [];
      }
    })
    .catch(() => {
      clearInterval(timer);
      timer = null;
    });
}

function clean(params: object) {
  const res = {};
  const arr = [
    "jd",
    "wd",
    "sj",
    "flag",
    "createTime",
    "id",
    "inch",
    "truckId",
    "unit",
    "deleted"
  ];
  for (var i in params) {
    if (i === "sj") {
      res["time"] =
        params["sj"].slice(8, 10) +
        ":" +
        params["sj"].slice(10, 12) +
        ":" +
        params["sj"].slice(12, 14);
    }
    if (arr.indexOf(i) === -1) {
      if (parseFloat(params[i]) < 0) {
        res[i] = 0;
      } else {
        res[i] = parseFloat(parseFloat(params[i]).toFixed(3));
      }
    }
  }
  return res;
}

onBeforeUnmount(() => {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
});

function onClose() {
  simulateVisible.value = false;
}
</script>
<template>
  <div class="main">
    <multiHeader
      @getTableData="getTableData"
      @getPlanSimulate="getPlanSimulate"
    />
    <el-card style="margin-top: 15px">
      <singleLine
        v-if="['单机车', '单机橇'].indexOf(equType) > -1"
        :index="index"
        :dataList="dataList"
        :simulateData="simulateData"
        :plateNum="plate"
        :wellName="wellName"
        :wellType="wellType"
        :legendVisible="true"
        :myTool1Visible="false"
        :title="wellName + ' @ ' + wellType + '（' + plate + '）'"
        :subtitle="
          beginTime.slice(0, 4) +
          '-' +
          beginTime.slice(4, 6) +
          '-' +
          beginTime.slice(6, 8)
        "
      />
      <dualLine
        v-else-if="['双机车', '双机橇'].indexOf(equType) > -1"
        :index="index"
        :dataList="dataList"
        :simulateData="simulateData"
        :plateNum="plate"
        :wellName="wellName"
        :wellType="wellType"
        :legendVisible="true"
        :myTool1Visible="false"
        :title="wellName + ' @ ' + wellType + '（' + plate + '）'"
        :subtitle="
          beginTime.slice(0, 4) +
          '-' +
          beginTime.slice(4, 6) +
          '-' +
          beginTime.slice(6, 8)
        "
      />
      <mixedLine
        v-else-if="equType === '合并'"
        :index="index"
        :dataList="dataList"
        :simulateData="simulateData"
        :plateNum="plates.join(',')"
        :wellName="wellName"
        :wellType="wellType"
        :legendVisible="true"
        :myTool1Visible="false"
        :title="wellName + ' @ ' + wellType + '（' + plates.join(',') + '）'"
        :subtitle="
          beginTime.slice(0, 4) +
          '-' +
          beginTime.slice(4, 6) +
          '-' +
          beginTime.slice(6, 8)
        "
      />
    </el-card>
    <el-dialog
      v-model="simulateVisible"
      title="获取注替计划模拟数据"
      width="40%"
      draggable
      destroy-on-close
      center
    >
      <el-timeline>
        <el-timeline-item
          v-for="(step, index) in steps"
          :key="index"
          :icon="step.content === curr_step ? useRenderIcon('check') : ''"
          :type="step.content === curr_step ? 'primary' : ''"
          :timestamp="step.timestamp"
          placement="top"
          size="large"
        >
          <el-form :model="step" inline>
            <el-form-item>
              <el-input v-model="step.content" readonly />
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="step.timestamp"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                :clearable="false"
              />
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="step.zero" label="是否清零" />
            </el-form-item>
            <el-form-item>
              <el-button
                :type="step.content === curr_step ? 'primary' : ''"
                style="margin-left: 10px"
                @click="getSimulate(index)"
                :disabled="step.content !== curr_step"
              >
                获取
              </el-button>
            </el-form-item>
          </el-form>
        </el-timeline-item>
      </el-timeline>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
