<script setup lang="ts">
import groupFormDialog from "./components/GroupFormDialog.vue";
import { useColumns } from "./columns";
import { getRoleList, deleteRole } from "/@/api/organization";
import { reactive, ref, onMounted, nextTick } from "vue";
import { ElNotification } from "element-plus";
import { type FormInstance } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { TableProBar } from "/@/components/ReTable";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

defineOptions({
  name: "Group"
});

const form = reactive({
  groupName: ""
});

let dataList = ref([]);
let loading = ref(true);
const { columns } = useColumns();

const formRef = ref<FormInstance>();

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

function onAdd() {
  groupFormDialogVisible.value = true;
}

function onEdit(row) {
  console.log(row);
  groupFormDialogVisible.value = true;
  nextTick(() => {
    groupFormData.value = {
      ...row
    };
  });
}

function onDelete(row) {
  deleteRole(row.gid).then(({ status }) => {
    if (status === 200) {
      ElNotification({
        title: "操作成功",
        message: `删除用户组 【${row.groupName}】`,
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
  let { data } = await getRoleList({
    pageNum: pagination.currentPage,
    pageSize: pagination.pageSize,
    groupName: form.groupName
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

const initialData = {
  gid: 0,
  groupName: "",
  note: ""
};

const groupFormDialogVisible = ref(false);
const groupFormData = ref({ ...initialData });
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-white w-99/100 pl-4 pt-4"
    >
      <el-form-item label="用户组名" prop="groupName">
        <el-input
          v-model="form.groupName"
          placeholder="请输入用户组名称"
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

    <TableProBar
      title="用户组"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon('plus')" @click="onAdd">
          新增用户组
        </el-button>
      </template>
      <template v-slot="{ size, checkList }">
        <PureTable
          border
          align="center"
          showOverflowTooltip
          table-layout="auto"
          :size="size"
          :checkList="checkList"
          :data="dataList"
          :columns="columns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            backgroundColor: 'rgba(0,21,41,.7)',
            color: '#d0d0d0'
          }"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        >
          <template #operation="{ row }">
            <el-tooltip content="权限设置" placement="left">
              <el-button
                class="reset-margin"
                type="text"
                :size="size"
                @click="onEdit(row)"
                :icon="useRenderIcon('menu')"
              />
            </el-tooltip>
            <el-button
              class="reset-margin"
              type="text"
              :size="size"
              @click="onEdit(row)"
              :icon="useRenderIcon('edit-open')"
            />
            <el-popconfirm
              title="是否确定删除该用户组?"
              @confirm="onDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  type="text"
                  :size="size"
                  :icon="useRenderIcon('delete')"
                />
              </template>
            </el-popconfirm>
          </template>
        </PureTable>
      </template>
    </TableProBar>
    <groupFormDialog
      v-model:visible="groupFormDialogVisible"
      :data="groupFormData"
      @refresh="onSearch"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
