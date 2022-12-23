<script setup lang="ts">
import { useColumns } from "./columns";
import { reactive, ref, onMounted, nextTick } from "vue";
import { ElNotification } from "element-plus";
import { type FormInstance } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { TableProBar } from "/@/components/ReTable";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

// components
import groupFormDialog from "./components/GroupFormDialog.vue";
import rightFormDialog from "./components/RightFormDialog.vue";

// 接口
import { getRoleList, deleteRole, getRoleRights } from "/@/api/role";

defineOptions({
  name: "Group"
});

const form = reactive({
  groupName: ""
});

const formRef = ref<FormInstance>();

let dataList = ref([]);
let loading = ref(true);
const { columns } = useColumns();

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 15,
  currentPage: 1,
  background: true
});

const initialGroupData = {
  gid: 0,
  groupName: "",
  note: ""
};

const groupFormDialogVisible = ref(false);
const groupFormData = ref({ ...initialGroupData });

function onAdd() {
  groupFormDialogVisible.value = true;
}

function onEdit(row) {
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

const initalRightFormData = {
  gid: 0,
  groupName: "",
  rids: []
};

const rightFormDialogVisible = ref(false);
const rightFormData = ref({ ...initalRightFormData });

function onSetRights(row) {
  getRoleRights(row.gid).then(({ data }) => {
    let rids = [];
    if (data.length > 0) {
      rids = data.map(item => item.rid);
    }
    rightFormDialogVisible.value = true;
    nextTick(() => {
      rightFormData.value = {
        gid: row.gid,
        groupName: row.groupName,
        rids
      };
    });
  });
}
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
        <el-button
          type="primary"
          :icon="useRenderIcon('plus')"
          @click="onAdd"
          v-auth="'84'"
        >
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
              <el-link
                class="reset-margin"
                type="primary"
                :size="size"
                @click="onSetRights(row)"
                :icon="useRenderIcon('menu')"
                style="margin-right: 15px"
                v-auth="'113'"
              />
            </el-tooltip>
            <el-link
              class="reset-margin"
              type="primary"
              :size="size"
              @click="onEdit(row)"
              :icon="useRenderIcon('edit-open')"
              style="margin-right: 15px"
              v-auth="'67'"
            />
            <el-popconfirm
              title="是否确定删除该用户组?"
              @confirm="onDelete(row)"
              v-auth="'69'"
            >
              <template #reference>
                <el-link
                  class="reset-margin"
                  type="primary"
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

    <rightFormDialog
      v-model:visible="rightFormDialogVisible"
      :data="rightFormData"
      @refresh="onSearch"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
