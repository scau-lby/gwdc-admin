<script setup lang="ts">
import { useColumns } from "./columns";

import { reactive, ref, watch } from "vue";
import { type PaginationProps } from "@pureadmin/table";

defineOptions({
  name: "Chassis"
});

const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  },
  pageNum: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 20
  },
  total: {
    type: Number,
    default: 0
  }
});

const dataList = ref(props.dataList);
let loading = ref(true);
const { columns } = useColumns();

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 15,
  currentPage: 1,
  background: true
});

const emits = defineEmits(["pageNumChange", "pageSizeChange"]);

function onCurrentChange(val: number) {
  pagination.currentPage = val;
  emits("pageNumChange", val);
}

function onSizeChange(val: number) {
  pagination.pageSize = val;
  emits("pageSizeChange", val);
}

watch(
  () => props.dataList,
  val => {
    loading.value = true;
    dataList.value = val;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => props.total,
  val => {
    pagination.total = val;
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => props.pageSize,
  val => {
    pagination.pageSize = val;
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => props.pageNum,
  val => {
    pagination.currentPage = val;
  },
  {
    deep: true,
    immediate: true
  }
);
</script>

<template>
  <div v-loading="loading" element-loading-text="Loading...">
    <PureTable
      border
      align="center"
      table-layout="auto"
      size="medium"
      :data="dataList"
      :columns="columns"
      :pagination="pagination"
      :paginationSmall="true"
      :header-cell-style="{
        backgroundColor: 'rgba(0,21,41,.7)',
        color: '#d0d0d0'
      }"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
  </div>
</template>

<style scoped lang="scss"></style>
