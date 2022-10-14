<script setup lang="ts">
import truckFormDialog from "./components/TruckFormDialog.vue";
import { getTruckList, deleteTruck } from "/@/api/truck";
import { getOrgList } from "/@/api/organization";
import { useColumns } from "./columns";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, nextTick } from "vue";
import { ElNotification, type FormInstance } from "element-plus";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { TableProBar } from "/@/components/ReTable";
import { handleTree } from "/@/utils/tree";

defineOptions({
  name: "Truck"
});

const orgProps = {
  checkStrictly: true,
  value: "orgName",
  label: "orgName",
  children: "children",
  emitPath: false
};

let orgOptions = ref([]);

async function getOrgOptions() {
  let { data } = await getOrgList();
  orgOptions.value = handleTree(JSON.parse(data), "orgId", "pid");
}

const form = reactive({
  orgName: "",
  equType: "",
  dataState: "",
  videoState: "",
  plateNum: ""
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
  truckFormDialogVisible.value = true;
}

function onEdit(row) {
  console.log(row);
  truckFormDialogVisible.value = true;
  nextTick(() => {
    truckFormData.value = { ...row };
  });
}

function onDelete(row) {
  deleteTruck(row.id).then(() => {
    ElNotification({
      title: "操作成功",
      message: `删除设备【${row.plateNum}】`,
      type: "success"
    });
    if (dataList.value.length <= 1) {
      pagination.currentPage =
        pagination.currentPage > 1 ? pagination.currentPage - 1 : 1;
    }
    onSearch();
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
  let { data } = await getTruckList({
    pageSize: pagination.pageSize,
    pageNum: pagination.currentPage,
    ...form
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
  getOrgOptions();
  onSearch();
});

const initialData = {
  id: 0,
  belongTo: "",
  dataSimCard: "",
  dataState: 1,
  equType: "",
  note: "",
  plateNum: "",
  subject: "",
  videoIp: "",
  videoSimCard: "",
  videoState: 0,
  installDate: ""
};

const truckFormDialogVisible = ref(false);
const truckFormData = ref({ ...initialData });
</script>
<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-white w-99/100 pl-4 pt-4"
    >
      <el-form-item label="所属机构" prop="orgName">
        <el-cascader
          v-model="form.orgName"
          :options="orgOptions"
          :props="orgProps"
          :show-all-levels="false"
          clearable
        />
      </el-form-item>
      <el-form-item label="设备类型" prop="equType">
        <el-select
          v-model="form.equType"
          placeholder="请选择设备类型"
          clearable
        >
          <el-option label="双机车" value="双机车" />
          <el-option label="单机车" value="单机车" />
          <el-option label="双机橇" value="双机橇" />
          <el-option label="单机橇" value="单机橇" />
        </el-select>
      </el-form-item>
      <el-form-item label="数据状态" prop="dataState">
        <el-select
          v-model="form.dataState"
          placeholder="请选择数据状态"
          clearable
        >
          <el-option label="已激活" :value="1" />
          <el-option label="未激活" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="视频状态" prop="videoState">
        <el-select
          v-model="form.videoState"
          placeholder="请选择视频状态"
          clearable
        >
          <el-option label="已激活" :value="1" />
          <el-option label="未激活" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备编号" prop="plateNum">
        <el-input v-model="form.plateNum" placeholder="设备名称" clearable />
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
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon('plus')" @click="onAdd">
          新增设备
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
          :header-cell-style="{
            backgroundColor: 'rgba(0,21,41,.7)',
            color: '#d0d0d0'
          }"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
          style="width: 100%"
        >
          <template #operation="{ row }">
            <el-popconfirm title="是否确认删除该设备?" @confirm="onDelete(row)">
              <template #reference>
                <el-link
                  class="reset-margin"
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('delete')"
                />
              </template>
            </el-popconfirm>

            <el-link
              class="reset-margin"
              type="primary"
              :size="size"
              :icon="useRenderIcon('edit')"
              @click="onEdit(row)"
              style="margin-left: 10px"
            />
          </template>
        </PureTable>
      </template>
    </TableProBar>
    <truckFormDialog
      v-model:visible="truckFormDialogVisible"
      :data="truckFormData"
      @refresh="onSearch"
    />
  </div>
</template>
