<script setup lang="ts">
import { useColumns } from "./columns";
import {
  getWellList,
  addFavorite,
  delFavorite,
  getWellMoreInfo
} from "/@/api/well";
import { ref, reactive, onMounted, nextTick } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import moreInfoDialog from "./MoreInfoDialog.vue";
import updateDialog from "./UpdateFormDialog.vue";

let dataList = ref([{}]);
let loading = ref(true);
const { columns } = useColumns();

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 5,
  currentPage: 1,
  background: true
});

// 口井 - 添加收藏
async function onFavoriteAdd(row) {
  let { data } = await addFavorite(row.wellName, row.wellType);
  if (data) {
    pagination.currentPage = 1;
    onSearch();
  }
}

// 口井 - 删除收藏
async function onFavoriteDel(row) {
  let { data } = await delFavorite(row.wellName, row.wellType);
  if (data) {
    pagination.currentPage = 1;
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
  updateDialogVisible.value = true;
  nextTick(() => {
    updateData.value = {
      ...row
    };
  });
}

function onCurrentChange(val: number) {
  pagination.currentPage = val;
  onSearch();
}

function onSizeChange(val: number) {
  pagination.pageSize = val;
  onSearch();
}

async function onSearch() {
  loading.value = true;
  let { data } = await getWellList({
    pageSize: pagination.pageSize,
    pageNum: pagination.currentPage
  });

  const res = data.records.map(item => {
    return {
      ...item,
      hasMore: false
    };
  });
  dataList.value = res;
  pagination.total = data.total;
  getMore();
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

function getMore() {
  dataList.value.forEach((item, index) => {
    getWellMoreInfo(item.wellName)
      .then(({ status }) => {
        if (status === 200) {
          dataList.value[index].hasMore = true;
        } else {
          dataList.value[index].hasMore = false;
        }
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
      :pagination="pagination"
      :paginationSmall="true"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
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
    <moreInfoDialog
      v-model:visible="formDialogVisible"
      :wellName="curr_wellName"
    />
    <updateDialog
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
