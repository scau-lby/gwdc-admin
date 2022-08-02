<script setup lang="ts">
import { useColumns } from "./columns";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted } from "vue";
import { FormInstance } from "element-plus";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { TableProBar } from "/@/components/ReTable";

defineOptions({
  name: "Records"
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
  {
    id: 1,
    operator: "管理员",
    type: "恢复",
    createtime: "1653206845000",
    remark: "洼21-31油层工程数据"
  }
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

function onCurrentChange(val: number) {
  pagination.currentPage = val;
  onSearch();
}

function onSizeChange(val: number) {
  pagination.pageSize = val;
  onSearch();
}

function onSelectionChange(val) {
  console.log("onSelectionChange", val);
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
      class="bg-white w-99/100 pl-8 pt-4"
    >
      <el-form-item label="操作人员姓名" prop="operator">
        <el-input
          v-model="form.operator"
          placeholder="请输入操作人员姓名"
          clearable
        />
      </el-form-item>
      <el-form-item label="操作时间" prop="createtime">
        <el-date-picker
          v-model="form.createtime"
          type="datetimerange"
          range-separator="至"
          :start-placeholder="form.createtime[0]"
          :end-placeholder="form.createtime[1]"
        />
      </el-form-item>
      <el-form-item label="操作内容关键字" prop="remark">
        <el-input
          v-model="form.remark"
          placeholder="请输入操作内容关键字"
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
      title="组织机构"
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
          :header-cell-style="{ background: '#fafafa', color: '#606266' }"
          @selection-change="onSelectionChange"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        />
      </template>
    </TableProBar>
  </div>
</template>
