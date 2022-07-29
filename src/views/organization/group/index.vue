<script setup lang="ts">
import { useColumns } from "./columns";
import { getGroupList } from "/@/api/organization";
import { reactive, ref, onMounted } from "vue";
import { type FormInstance } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { TableProBar } from "/@/components/ReTable";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

defineOptions({
  name: "Group"
});

const form = reactive({
  name: "",
  code: "",
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

function handleAdd() {
  console.log("add");
}

function handleEdit(row) {
  console.log(row);
}

function handleDelete(row) {
  console.log(row);
}

function handleCurrentChange(val: number) {
  console.log(`current page: ${val}`);
}

function handleSizeChange(val: number) {
  console.log(`${val} items per page`);
}

function handleSelectionChange(val) {
  console.log("handleSelectionChange", val);
}

async function onSearch() {
  loading.value = true;
  let { data } = await getGroupList({});
  dataList.value = data.list;
  pagination.total = data.total;
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
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-white w-99/100 pl-8 pt-4"
    >
      <el-form-item label="用户组名" prop="name">
        <el-input v-model="form.name" placeholder="请输入角色名称" clearable />
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
      title="用户组"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon('plus')"
          @click="handleAdd"
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
              link
              type="primary"
              :size="size"
              @click="handleEdit(row)"
              :icon="useRenderIcon('menu')"
            >
              权限设置
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleEdit(row)"
              :icon="useRenderIcon('edit-open')"
            >
              编辑
            </el-button>
            <el-popconfirm title="是否确定删除该用户组?">
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('delete')"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </PureTable>
      </template>
    </TableProBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
