<script setup lang="ts">
import { useColumns } from "./columns";
import { getOnlineTruckList } from "/@/api/truck";
import { ref, onMounted } from "vue";
// import { ElNotification } from "element-plus";
// import { type FormInstance } from "element-plus";
// import { type PaginationProps } from "@pureadmin/table";
// import { TableProBar } from "/@/components/ReTable";
// import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

defineOptions({
  name: "HisData"
});

let dataList = ref([]);
let loading = ref(true);
const { columns } = useColumns();

async function onSearch() {
  loading.value = true;
  let { data } = await getOnlineTruckList();

  setTimeout(() => {
    dataList.value = data;
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
