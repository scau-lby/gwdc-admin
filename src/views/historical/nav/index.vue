<script setup lang="ts">
// import {hasRight} from "/@/"
import { useColumns } from "./columns";
import { reactive, ref, onMounted, nextTick } from "vue";
import { type FormInstance, ElNotification } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
// import { TableProBar } from "/@/components/ReTable";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
// api
import { getHistoryList, deleteHistoryByWellId } from "/@/api/history";
// components
import updateFormDialog from "./components/UpdateFormDialog.vue";
// store
import { useHisDataStoreHook } from "/@/store/modules/hisData";
// router
import { useRouter } from "vue-router";
const router = useRouter();

defineOptions({
  name: "HisNav"
});

const form = reactive({
  wellName: "",
  plateNum: ""
});

const formRef = ref<FormInstance>();

const initialData = {
  id: 0,
  wellName: null,
  wellType: null,
  belongTo: null,
  commander: null,
  opreatePerson: null
};
const updateFormDialogVisible = ref(false);
const updateFormData = ref({ ...initialData });

let dataList = ref([]);
let loading = ref(true);
const { columns } = useColumns();

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 15,
  currentPage: 1,
  background: true
});

function onView(row) {
  useHisDataStoreHook().SET_WELLNAME(row.wellName);
  useHisDataStoreHook().SET_WELLTYPE(row.wellType);
  router.push({ name: "HisStatistics" });
}

function onUpdate(row) {
  const { id, wellName, wellType, belongTo, commander, opreatePerson } = row;
  updateFormDialogVisible.value = true;
  nextTick(() => {
    updateFormData.value = {
      id,
      wellName,
      wellType,
      belongTo,
      commander,
      opreatePerson
    };
  });
}

function onDelete(row) {
  deleteHistoryByWellId(row.id).then(({ status }) => {
    if (status === 200) {
      ElNotification({
        title: "操作成功",
        message: `删除数据 【${row.wellName}-${row.wellType}】`,
        type: "success"
      });
      if (dataList.value.length === 1) {
        pagination.currentPage =
          pagination.currentPage > 1 ? pagination.currentPage - 1 : 1;
      }
      onSearch();
    }
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
  let { data } = await getHistoryList({
    pageNum: pagination.currentPage,
    pageSize: pagination.pageSize,
    plateNum: form.plateNum,
    wellName: form.wellName
  });
  dataList.value = data.records;
  pagination.total = data.total;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  pagination.currentPage = 1;
  onSearch();
};

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-white pl-4 pt-4"
    >
      <el-form-item label="作业井号" prop="wellName">
        <el-input
          v-model="form.wellName"
          placeholder="请输入作业井号"
          clearable
        />
      </el-form-item>
      <el-form-item label="作业设备编号" prop="plateNum">
        <el-input
          v-model="form.plateNum"
          placeholder="请输入作业设备编号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('search')"
          :loading="loading"
          @click="(pagination.currentPage = 1), onSearch()"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon('refresh')" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <div
      style="margin-top: 15px"
      v-loading="loading"
      element-loading-text="Loading..."
    >
      <PureTable
        border
        align="center"
        showOverflowTooltip
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
      >
        <template #operation="{ row }">
          <el-tooltip content="查看作业记录" placement="left">
            <el-link
              class="reset-margin"
              type="primary"
              @click="onView(row)"
              :icon="useRenderIcon('view')"
              style="margin-right: 15px"
            />
          </el-tooltip>
          <el-link
            class="reset-margin"
            type="primary"
            @click="onUpdate(row)"
            :icon="useRenderIcon('edit-open')"
            style="margin-right: 15px"
          />
          <!-- v-if="hasRight('117')" -->
          <el-popconfirm
            title="是否确定删除该作业记录?"
            @confirm="onDelete(row)"
          >
            <template #reference>
              <el-link
                class="reset-margin"
                type="primary"
                :icon="useRenderIcon('delete')"
                style="margin-right: 15px"
              />
            </template>
          </el-popconfirm>
        </template>
      </PureTable>
    </div>
    <updateFormDialog
      v-model:visible="updateFormDialogVisible"
      :data="updateFormData"
      @refresh="onSearch"
    />
  </div>
</template>
