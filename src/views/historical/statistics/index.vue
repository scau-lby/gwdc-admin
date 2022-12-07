<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
// store
import { useHisDataStoreHook } from "/@/store/modules/hisData";
// api
import { getTruckList } from "/@/api/truck";
import { getHistoryReal, getFixedHistoryReal } from "/@/api/well";
// header
import multiHeader from "/@/components/HisHeader/MultiHeader.vue";
// 合并
import mixedLine from "/@/components/dataLine/MixedLine.vue";
// 双机车、双机橇
import dualLine from "/@/components/dataLine/DualLine.vue";
// 单机车、单机橇
import singleLine from "/@/components/dataLine/SingleLine.vue";

defineOptions({
  name: "HisData"
});

let timer = null;

const index = ref(0),
  dataList = ref([]),
  pageSize = ref(500),
  equType = ref("");

let mixed = ref(0),
  wellName = ref(useHisDataStoreHook().getWellName),
  wellType = ref(useHisDataStoreHook().getWellType),
  plate = ref(useHisDataStoreHook().getPlate),
  plates = ref(useHisDataStoreHook().getPlates),
  beginTime = ref(useHisDataStoreHook().getBeginTime),
  endTime = ref(useHisDataStoreHook().getEndTime);

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
    console.log(value);
    beginTime.value = value;
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
      }
    })
    .catch(() => {
      clearInterval(timer);
      timer = null;
    });
}

function clean(params: object) {
  const res = {};
  for (var i in params) {
    if (params[i] != 0 && ["jd", "wd", "sj", "flag"].indexOf(i) === -1) {
      res[i] = parseFloat(params[i]).toFixed(3);
      if (i === "md" && parseFloat(params[i]) < 0) {
        res[i] = 0;
      }
    } else if (i === "sj") {
      res["time"] =
        params["sj"].slice(8, 10) +
        ":" +
        params["sj"].slice(10, 12) +
        ":" +
        params["sj"].slice(12, 14);
    } else {
      res[i] = params[i];
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
</script>
<template>
  <div class="main">
    <multiHeader @getTableData="getTableData" />
    <!-- :header="
        equType === '合并'
          ? wellName +
            ' @ ' +
            wellType +
            ' / 工程曲线（' +
            plates.join('/') +
            '）'
          : wellName + ' @ ' + wellType + ' / 工程曲线（' + plate + '）'
      " -->
    <el-card style="margin-top: 15px">
      <singleLine
        v-if="['单机车', '单机橇'].indexOf(equType) > -1"
        :index="index"
        :dataList="dataList"
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
  </div>
</template>

<style scoped lang="scss"></style>
