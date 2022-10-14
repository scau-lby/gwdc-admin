<script setup lang="ts">
import { useColumns } from "./columns";
import { getOnlineTruckList } from "/@/api/truck";
import { ref, onMounted } from "vue";

import axios from "axios";

import { useDetail } from "./hooks";
const { toDetail } = useDetail();

let dataList = ref([]);
let loading = ref(true);
const { columns } = useColumns();

// 进入实时监控
function onLive(row) {
  toDetail(row.plateNum);
}

async function onSearch() {
  loading.value = true;
  let { data } = await getOnlineTruckList();
  let res = [];
  if (Array.isArray(data) && data.length > 0) {
    let location = "";
    data.forEach(item => {
      if (item.jd && item.wd) {
        location += `${item.jd},${item.wd}|`;
      } else {
        location += `120,40|`;
      }
    });

    location = location.substring(0, location.lastIndexOf("|"));
    let { status, data: info } = await axios.get(
      `https://restapi.amap.com/v3/geocode/regeo?key=705fd85820edb50fe963340206a708b3&location=${location}&batch=true`
    );

    if (status === 200) {
      res = data.map((item, index) => {
        return {
          ...item,
          position: info.regeocodes[index].formatted_address
        };
      });
    } else {
      res = data;
    }
  }

  setTimeout(() => {
    dataList.value = res;
    loading.value = false;
  }, 500);
}

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div>
    <PureTable
      border
      align="center"
      row-key="id"
      table-layout="auto"
      showOverflowTooltip
      :data="dataList"
      :columns="columns"
      :header-cell-style="{
        backgroundColor: 'rgba(0,21,41,.7)',
        color: '#d0d0d0'
      }"
    >
      <template #operation="{ row }">
        <el-button
          class="reset-margin"
          plain
          round
          size="small"
          @click="onLive(row)"
        >
          进入实时监控
        </el-button>
      </template>
    </PureTable>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-scrollbar__view) {
  width: 100%;
}

:deep(.el-table__body) {
  width: 100% !important;
}
</style>
