<script setup lang="ts">
import { watch, ref } from "vue";
// store
import { useHisDataStoreHook } from "/@/store/modules/hisData";
// header
import radioHeader from "/@/components/HisHeader/RadioHeader.vue";
// api
import { getHistoryReal } from "/@/api/well";
// components
import chassis from "./components/Chassis/index.vue";
import plc from "./components/PLC/index.vue";
import sideA from "./components/SideA/index.vue";
import sideB from "./components/SideB/index.vue";

let flag = ref(useHisDataStoreHook().getFlag),
  wellName = useHisDataStoreHook().getWellName,
  wellType = useHisDataStoreHook().getWellType,
  plateNum = useHisDataStoreHook().getPlate,
  beginTime = useHisDataStoreHook().getBeginTime,
  endTime = useHisDataStoreHook().getEndTime;

const dataList = ref([]),
  pageNum = ref(1),
  pageSize = ref(15),
  total = ref(0);

defineOptions({
  name: "HisPower"
});

watch(
  () => useHisDataStoreHook().getFlag,
  value => {
    flag.value = value;
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
    plateNum = value;
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
  let { data } = await getHistoryReal({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    plateNum,
    wellName,
    wellType,
    beginTime,
    endTime
  });
  dataList.value = data.records.map(item => clean(item));
  total.value = data.total;
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
    <radioHeader @getTableData="getTableData" />
    <chassis
      :dataList="dataList"
      :total="total"
      :pageNum="pageNum"
      :pageSize="pageSize"
      @pageNumChange="pageNumChange"
      @pageSizeChange="pageSizeChange"
      style="margin-top: 15px"
      v-if="flag === '底盘'"
    />
    <plc
      :dataList="dataList"
      :total="total"
      :pageNum="pageNum"
      :pageSize="pageSize"
      @pageNumChange="pageNumChange"
      @pageSizeChange="pageSizeChange"
      style="margin-top: 15px"
      v-else-if="flag === 'PLC'"
    />
    <sideA
      :dataList="dataList"
      :total="total"
      :pageNum="pageNum"
      :pageSize="pageSize"
      @pageNumChange="pageNumChange"
      @pageSizeChange="pageSizeChange"
      style="margin-top: 15px"
      v-else-if="flag === 'A侧'"
    />
    <sideB
      :dataList="dataList"
      :total="total"
      :pageNum="pageNum"
      :pageSize="pageSize"
      @pageNumChange="pageNumChange"
      @pageSizeChange="pageSizeChange"
      style="margin-top: 15px"
      v-else-if="flag === 'B侧'"
    />
  </div>
</template>

<style scoped lang="scss"></style>
