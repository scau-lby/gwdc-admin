<script setup lang="ts">
import { useColumns } from "./columns";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted } from "vue";
import { FormInstance } from "element-plus";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { TableProBar } from "/@/components/ReTable";

defineOptions({
  name: "RecycleBin"
});

const form = reactive({
  operator: "",
  createtime: [
    new Date().setDate(new Date().getDate() - 7) + "",
    new Date() + ""
  ],
  remark: ""
});

let dataList = ref([
  // {
  //   id: 1,
  //   operator: "管理员",
  //   createtime: "1653206815000",
  //   remark: "洼21-31油层工程数据"
  // }
]);
let loading = ref(true);
const { columns } = useColumns();

const formRef = ref<FormInstance>();

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

function onDelete(row) {
  console.log(row);
}

function onRecover(row) {
  console.log(row);
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
  // let { data } = await getOrgList({
  //   pageSize: pagination.pageSize,
  //   pageNum: pagination.currentPage
  // });
  // dataList.value = data;
  // pagination.total = data.length;
  pagination.total = 1;
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
      class="bg-white w-100/100 pl-4 pt-4"
    >
      <el-form-item label="操作人员姓名" prop="operator">
        <el-input
          v-model="form.operator"
          placeholder="请输入删除操作人员姓名"
          clearable
        />
      </el-form-item>
      <el-form-item label="删除时间" prop="createtime">
        <el-date-picker
          v-model="form.createtime"
          type="datetimerange"
          range-separator="至"
          :start-placeholder="form.createtime[0]"
          :end-placeholder="form.createtime[1]"
        />
      </el-form-item>
      <el-form-item label="删除内容关键字" prop="remark">
        <el-input
          v-model="form.remark"
          placeholder="请输入删除内容关键字"
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
      title="回收站"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons />

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
          :header-cell-style="{
            backgroundColor: 'rgba(0,21,41,.7)',
            color: '#d0d0d0'
          }"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        >
          <template #operation="{ row }">
            <el-popconfirm title="是否确认彻底删除?" @confirm="onDelete(row)">
              <template #reference>
                <el-link
                  class="reset-margin"
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('delete')"
                  style="margin-right: 15px"
                />
              </template>
            </el-popconfirm>
            <el-tooltip content="恢复" placement="right">
              <el-link
                class="reset-margin"
                type="primary"
                :size="size"
                :icon="useRenderIcon('refresh')"
                @click="onRecover(row)"
              />
            </el-tooltip>
          </template>
        </PureTable>
      </template>
    </TableProBar>
  </div>
</template>
