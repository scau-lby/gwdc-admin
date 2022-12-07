<script setup lang="ts">
import { ref, watch } from "vue";
// store
import { useHisDataStoreHook } from "/@/store/modules/hisData";
// api
import { getTruckList } from "/@/api/truck";
import { getHistoryReal, getFixedHistoryReal } from "/@/api/well";
// header
import multiHeader from "/@/components/HisHeader/MultiHeader.vue";
// 合并
import mixedTable from "/@/components/dataTable/Mixed/index.vue";
// 双机车、双机橇
import dualTable from "/@/components/dataTable/Dual/index.vue";
// 单机车、单机橇
import singleTable from "/@/components/dataTable/Single/index.vue";

defineOptions({
  name: "HisData"
});

const dataList = ref([]),
  pageNum = ref(1),
  pageSize = ref(15),
  total = ref(0),
  equType = ref("单机车");

let mixed = ref(0),
  wellName = useHisDataStoreHook().getWellName,
  wellType = useHisDataStoreHook().getWellType,
  plate = useHisDataStoreHook().getPlate,
  plates = useHisDataStoreHook().getPlates,
  beginTime = useHisDataStoreHook().getBeginTime,
  endTime = useHisDataStoreHook().getEndTime;

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
    wellName = value;
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => useHisDataStoreHook().getWellType,
  value => {
    wellType = value;
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => useHisDataStoreHook().getPlate,
  value => {
    plate = value;
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => useHisDataStoreHook().getPlates,
  value => {
    plates = value;
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => useHisDataStoreHook().getBeginTime,
  value => {
    beginTime = value;
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => useHisDataStoreHook().getEndTime,
  value => {
    endTime = value;
  },
  {
    deep: true,
    immediate: true
  }
);

async function getTableData() {
  dataList.value = [];
  if (mixed.value === 0) {
    let res = await getTruckList({
      pageNum: 1,
      pageSize: 1,
      plateNum: plate
    });
    equType.value = res.data.records[0].equType;

    // 单机
    const { data } = await getHistoryReal({
      wellName,
      wellType,
      plateNum: plate,
      beginTime,
      endTime,
      pageNum: pageNum.value,
      pageSize: pageSize.value
    });
    dataList.value = data.records.map(item => clean(item));
    total.value = data.total;
  } else {
    // 合并
    equType.value = "合并";
    const { data } = await getFixedHistoryReal({
      wellName,
      wellType,
      plateNums: plates.join(","),
      beginTime,
      endTime,
      pageNum: pageNum.value,
      pageSize: pageSize.value
    });
    dataList.value = data.records.map(item => clean(item));
    total.value = data.total;
  }
}

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

function pageNumChange(val) {
  pageNum.value = val;
  getTableData();
}

function pageSizeChange(val) {
  pageSize.value = val;
  getTableData();
}
</script>
<template>
  <div class="main">
    <multiHeader :type="2" @getTableData="getTableData" />

    <singleTable
      v-if="['单机车', '单机橇'].indexOf(equType) > -1"
      :dataList="dataList"
      :total="total"
      :pageNum="pageNum"
      :pageSize="pageSize"
      @pageNumChange="pageNumChange"
      @pageSizeChange="pageSizeChange"
      style="margin-top: 15px"
    />
    <dualTable
      v-else-if="['双机车', '双机橇'].indexOf(equType) > -1"
      :dataList="dataList"
      :total="total"
      :pageNum="pageNum"
      :pageSize="pageSize"
      @pageNumChange="pageNumChange"
      @pageSizeChange="pageSizeChange"
      style="margin-top: 15px"
    />
    <mixedTable
      v-else-if="equType === '合并'"
      :dataList="dataList"
      :total="total"
      :pageNum="pageNum"
      :pageSize="pageSize"
      @pageNumChange="pageNumChange"
      @pageSizeChange="pageSizeChange"
      style="margin-top: 15px"
    />
  </div>
</template>

<style scoped lang="scss"></style>
