<script setup lang="ts">
import { useColumns } from "./columns";
import { getOrgList, deleteOrg } from "/@/api/organization";
// import { handleTree } from "@pureadmin/utils";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted } from "vue";
import { ElNotification, FormInstance } from "element-plus";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { TableProBar } from "/@/components/ReTable";

defineOptions({
  name: "Department"
});

const form = reactive({
  name: "",
  virtual: "",
  status: ""
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
  console.log("add");
  formDialogVisible.value = true;
}

function onEdit(row) {
  console.log(row);
}

function onDelete(row) {
  deleteOrg({
    OrgID: row.id
  }).then(({ ResultCode, Msg }) => {
    if (ResultCode === 0) {
      ElNotification({
        title: "操作成功",
        message: `删除机构 【${row.label}】`,
        type: "success"
      });
      if (dataList.value.length === 1) {
        pagination.currentPage =
          pagination.currentPage > 1 ? pagination.currentPage - 1 : 1;
      }
    } else {
      ElNotification({
        title: "操作失败",
        message: `删除机构 【${row.label}】，提示：${Msg}`,
        type: "danger"
      });
    }
    onSearch();
  });
}

function handleCurrentChange(val: number) {
  pagination.currentPage = val;
  onSearch();
}

function handleSizeChange(val: number) {
  pagination.pageSize = val;
  onSearch();
}

function handleSelectionChange(val) {
  console.log("handleSelectionChange", val);
}

async function onSearch() {
  loading.value = true;
  let { data } = await getOrgList({
    pageSize: pagination.pageSize,
    pageNum: pagination.currentPage
  });
  console.log(data);
  dataList.value = data;
  pagination.total = data.length;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
};

onMounted(() => {
  onSearch();
});

// const INITIAL_DATA = {
//   name: "",
//   status: "",
//   description: "",
//   type: "",
//   mark: ""
// };

const formDialogVisible = ref(false);
// const formData = ref({ ...INITIAL_DATA });
</script>
<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-white w-99/100 pl-8 pt-4"
    >
      <el-form-item label="是否虚拟机构" prop="name">
        <el-select
          v-model="form.virtual"
          placeholder="请选择是否为虚拟机构"
          clearable
        >
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态" clearable>
          <el-option label="开启" :value="1" />
          <el-option label="关闭" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入机构名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('search')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon('refresh')" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <TableProBar
      title="组织机构"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon('plus')" @click="onAdd">
          新增组织机构
        </el-button>
      </template>
      <template v-slot="{ size, checkList }">
        <PureTable
          border
          align="center"
          row-key="id"
          table-layout="auto"
          showOverflowTooltip
          :size="size"
          :data="dataList"
          :columns="columns"
          :checkList="checkList"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{ background: '#fafafa', color: '#606266' }"
          @selection-change="handleSelectionChange"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              type="text"
              :size="size"
              :icon="useRenderIcon('edit-open')"
              @click="onEdit(row)"
            />
            <el-popconfirm title="是否确定删除该机构?" @confirm="onDelete(row)">
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
  </div>
</template>
