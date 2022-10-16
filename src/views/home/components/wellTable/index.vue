<script setup lang="ts">
import { useColumns } from "./columns";
import {
  getWellList,
  addFavorite,
  delFavorite,
  getMoreInfo
} from "/@/api/well";
import { ref, onMounted, nextTick } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import detailDialogForm from "./DetailDialogForm.vue";
import wellDialogForm from "./WellDialogForm.vue";

let dataList = ref([{}]);
let loading = ref(true);
const { columns } = useColumns();

// 口井 - 添加收藏
async function onFavoriteAdd(row) {
  let { data } = await addFavorite(row.id);
  if (data) {
    onSearch();
  }
}

// 口井 - 删除收藏
async function onFavoriteDel(row) {
  let { data } = await delFavorite(row.id);
  if (data) {
    onSearch();
  }
}

const formDialogVisible = ref(false);
const curr_wellName = ref(null);

function onView(row) {
  curr_wellName.value = row.wellName;
  formDialogVisible.value = true;
}

const initialUpdateData = {
  belongTo: null,
  commander: null,
  drillCompany: null,
  drillTeamNo: null,
  favorite: false,
  id: 0,
  opreatePerson: null,
  push: 0,
  schedule: null,
  state: 0,
  trucks: null,
  wellName: null,
  wellRank: null,
  wellType: null
};
const updateDialogVisible = ref(false);
const updateData = ref({ ...initialUpdateData });

function onUpdate(row) {
  console.log(row);
  updateDialogVisible.value = true;
  nextTick(() => {
    updateData.value = {
      ...row
    };
  });
}

// 只有首次获取口井数据时需要查询是否有更多信息，否则不查询
let hasGetMore = false;

async function onSearch() {
  loading.value = true;
  let { data } = await getWellList();

  const res = data.map(item => {
    return {
      ...item,
      hasMore: false
    };
  });
  dataList.value = res;

  setTimeout(() => {
    loading.value = false;
    if (!hasGetMore) {
      getMore();
      hasGetMore = true;
    }
  }, 500);
}

function getMore() {
  dataList.value.forEach((item, index) => {
    getMoreInfo(item.wellName)
      .then(() => {
        dataList.value[index].hasMore = true;
      })
      .catch(() => {
        dataList.value[index].hasMore = false;
      });
  });
}

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div v-loading="loading" element-loading-text="Loading...">
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
        <el-button
          class="reset-margin"
          plain
          round
          size="small"
          @click="onUpdate(row)"
          style="margin-left: 15px"
        >
          更新
        </el-button>
      </template>
      <template #operation1="{ row }">
        <el-button
          class="reset-margin"
          plain
          round
          size="small"
          @click="onView(row)"
          :disabled="!row.hasMore"
        >
          了解详情
        </el-button>
      </template>
    </PureTable>
    <detailDialogForm
      v-model:visible="formDialogVisible"
      :wellName="curr_wellName"
    />
    <wellDialogForm
      v-model:visible="updateDialogVisible"
      :data="updateData"
      @refresh="onSearch"
    />
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
