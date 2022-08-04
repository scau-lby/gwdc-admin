<script setup lang="ts">
import truckFormDialog from "./components/TruckFormDialog.vue";
import { deleteTruck } from "/@/api/truck";
import { getTruckList } from "/@/api/truck";
import { useColumns } from "./columns";
import { type PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, nextTick } from "vue";
import { ElNotification, type FormInstance } from "element-plus";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { TableProBar } from "/@/components/ReTable";

defineOptions({
  name: "Truck"
});

const orgList = ref([]);

const form = reactive({
  orgName: "",
  equType: "",
  dataState: "",
  videoState: "",
  plateNum: ""
});

let dataList = ref([
  {
    id: 1,
    belongTo: "兴隆台项目部",
    equType: "双机车",
    plateNum: "测试001",
    subject: "",
    dataState: 1,
    videoSimCard: "",
    videoIp: "",
    videoState: 0,
    installDate: "1653206815000",
    note: "其他"
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

function onAdd() {
  truckFormDialogVisible.value = true;
}

function onEdit(row) {
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
  // getOrgList({}).then(({ ResultCode, data }) => {
  //   if (ResultCode === 0) {
  //     orgList.value = data;
  //   } else {
  //     ElNotification({
  //       title: "操作失败",
  //       message: `获取组织机构列表, 提示：${Msg}`,
  //       type: "error"
  //     });
  //   }
  // });
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
      class="bg-white w-99/100 pl-8 pt-4"
    >
      <el-form-item label="所属单位" prop="orgName">
        <el-select
          v-model="form.orgName"
          placeholder="请选择所属单位"
          clearable
        >
          <el-option
            v-for="item in orgList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
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
          :header-cell-style="{ background: '#fafafa', color: '#606266' }"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
          style="width: 100%"
        >
          <template #operation="{ row }">
            <el-popconfirm title="是否确认删除该设备?" @confirm="onDelete(row)">
              <template #reference>
                <el-button
                  class="reset-margin"
                  type="text"
                  :size="size"
                  :icon="useRenderIcon('delete')"
                />
              </template>
            </el-popconfirm>

            <el-button
              class="reset-margin"
              type="text"
              :size="size"
              :icon="useRenderIcon('edit')"
              @click="onEdit(row)"
            />
          </template>
        </PureTable>
      </template>
    </TableProBar>
    <truckFormDialog
      v-model:visible="truckFormDialogVisible"
      :data="truckFormData"
    />
  </div>
</template>
