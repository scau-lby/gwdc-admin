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

// async function getAddress(jd, wd) {
//   let { data, status } = await axios.get(
//     `https://restapi.amap.com/v3/geocode/regeo?key=705fd85820edb50fe963340206a708b3&location=${jd},${wd}`
//   );

//   if (status === 200) {
//     return data.regeocode.formatted_address;
//   } else {
//     return "error";
//   }
// }

// function getPosition(jd, wd) {
//   return new Promise(function (resolve) {
//     let p = getAddress(jd, wd);
//     console.log(p);
//     return resolve(p);
//   });
// }

// function getPosition(item) {
//   return new Promise(resolve => {
//     resolve(getAddress(item));
//   });
// }

async function onSearch() {
  loading.value = true;
  let { data } = await getOnlineTruckList();
  let res = [];
  if (Array.isArray(data) && data.length > 0) {
    let location = "";
    data.forEach(item => {
      location += `${item.jd},${item.wd}|`;
    });
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
    // res = data.map(item => {
    //   if (item.jd > 0 && item.wd > 0) {
    //     console.log(getPosition(item.jd, item.wd));
    //     return {
    //       ...item,
    //       position: getPosition(item.jd, item.wd)
    //     };
    //   } else {
    //     return {
    //       ...item,
    //       position: "暂无经纬度信息"
    //     };
    //   }
    // });
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
</template>
