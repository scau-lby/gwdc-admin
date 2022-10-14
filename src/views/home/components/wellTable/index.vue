<script setup lang="ts">
import { useColumns } from "./columns";
import {
  getWellList,
  addFavorite,
  delFavorite,
  getDetailByWellName
} from "/@/api/well";
import { ref, onMounted, nextTick } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import detailDialogForm from "./DetailDialogForm.vue";
import wellDialogForm from "./WellDialogForm.vue";
import dayjs from "dayjs";

let dataList = ref([{}]);
let loading = ref(true);
const { columns } = useColumns();

// 口井 - 添加收藏
async function onFavoriteAdd(row) {
  let { data } = await addFavorite(row.id);
  if (data) {
    this.onSearch();
  }
}

// 口井 - 删除收藏
async function onFavoriteDel(row) {
  let { data } = await delFavorite(row.id);
  if (data) {
    this.onSearch();
  }
}

const initialData = {
  requestTime: null,
  BITDEP: null,
  BLOCKCOMP: null,
  DEPTH: null,
  FLOWIN: null,
  FLOWOUTPC: null,
  HKLD: null,
  MWIN: null,
  MWOUT: null,
  PUMP1: null,
  PUMP2: null,
  PUMP3: null,
  SPP: null,
  SURF_RPM: null,
  TGAS_OUT: null,
  WOB: null,
  wellName: null
};
const formDialogVisible = ref(false);
const formData = ref({ ...initialData });

async function onView(row) {
  let { data } = await getDetailByWellName(row.wellName);

  formDialogVisible.value = true;
  nextTick(() => {
    formData.value = {
      ...data,
      requestTime: dayjs(data.requestTime * 1000).format("YYYY-MM-DD HH:mm:ss")
    };
    console.log(formData.value);
  });
}

const initialUpdateData = {
  belongTo: "",
  drillCompany: "",
  drillTeamNo: "",
  commander: "string",
  favorite: true,
  id: 0,
  opreatePerson: "string",
  push: 0,
  schedule: "string",
  state: 0,
  trucks: "string",
  wellName: "string",
  wellRank: "string",
  wellType: "string"
};
const updateDialogVisible = ref(false);
const updateData = ref({ ...initialUpdateData });

async function onSearch() {
  loading.value = true;
  let { data } = await getWellList();
  dataList.value = data;

  setTimeout(() => {
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
        <el-link
          type="danger"
          :icon="useRenderIcon('heart')"
          @click="onFavoriteDel(row)"
          v-if="row.favorite"
        />

        <el-link
          type="danger"
          :icon="useRenderIcon('heart-o')"
          @click="onFavoriteAdd(row)"
          v-else
        />
      </template>
      <template #operation1="{ row }">
        <el-button
          class="reset-margin"
          plain
          round
          size="small"
          @click="onView(row)"
        >
          更新
        </el-button>
        <el-button
          class="reset-margin"
          plain
          round
          size="small"
          @click="onView(row)"
        >
          了解详情
        </el-button>
      </template>
    </PureTable>
    <detailDialogForm v-model:visible="formDialogVisible" :data="formData" />
    <wellDialogForm v-model:visible="updateDialogVisible" :data="updateData" />
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
