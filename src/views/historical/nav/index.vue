<script setup lang="ts">
import { useColumns } from "./columns";
import { getOnlineTruckList } from "/@/api/truck";
import { reactive, ref, onMounted, nextTick } from "vue";
// import { ElNotification } from "element-plus";
import { type FormInstance } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { TableProBar } from "/@/components/ReTable";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import editFormDialog from "./components/EditFormDialog.vue";

defineOptions({
  name: "HisData"
});

const form = reactive({
  task: "",
  plateNum: ""
});

const formRef = ref<FormInstance>();

const initialData = {
  plateNum: "",
  wellName: "",
  wellType: "",
  taskDepartment: "",
  commander: "",
  opreatePerson: ""
};
const formDialogVisible = ref(false);
const formData = ref({ ...initialData });

let dataList = ref([]);
let loading = ref(true);
const { columns } = useColumns();

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

function onView(row) {
  console.log(row);
}

function onEdit(row) {
  const {
    plateNum,
    wellName,
    wellType,
    taskDepartment,
    commander,
    opreatePerson
  } = row;
  formDialogVisible.value = true;
  nextTick(() => {
    formData.value = {
      plateNum,
      wellName,
      wellType,
      taskDepartment,
      commander,
      opreatePerson
    };
  });
}

function onDelete(row) {
  console.log(row);
  // deleteRole(row.gid).then(({ status }) => {
  //   if (status === 200) {
  //     ElNotification({
  //       title: "操作成功",
  //       message: `删除用户组 【${row.groupName}】`,
  //       type: "success"
  //     });
  //     if (dataList.value.length === 1) {
  //       pagination.currentPage =
  //         pagination.currentPage > 1 ? pagination.currentPage - 1 : 1;
  //     }
  //     onSearch();
  //   }
  // });
}

function onPush(row) {
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
  let { data } = await getOnlineTruckList({
    pageNum: pagination.currentPage,
    pageSize: pagination.pageSize,
    task: form.task,
    plateNum: form.plateNum
  });
  // dataList.value = data.records;
  dataList.value = data;
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
      class="bg-white w-99/100 pl-4 pt-4"
    >
      <el-form-item label="施工任务" prop="task">
        <el-input v-model="form.task" placeholder="请输入施工任务" clearable />
      </el-form-item>
      <el-form-item label="设备编号" prop="plateNum">
        <el-input
          v-model="form.plateNum"
          placeholder="请输入设备编号"
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
      title="作业导航"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons />
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
            <el-tooltip content="查看作业记录" placement="left">
              <el-link
                class="reset-margin"
                type="primary"
                :size="size"
                @click="onView(row)"
                :icon="useRenderIcon('view')"
                style="margin-right: 15px"
              />
            </el-tooltip>
            <el-link
              class="reset-margin"
              type="primary"
              :size="size"
              @click="onEdit(row)"
              :icon="useRenderIcon('edit-open')"
              style="margin-right: 15px"
            />
            <el-popconfirm
              title="是否确定删除该作业记录?"
              @confirm="onDelete(row)"
            >
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
            <el-tooltip content="数据推送" placement="right">
              <el-link
                class="reset-margin"
                type="primary"
                :size="size"
                @click="onPush(row)"
                :icon="useRenderIcon('promotion')"
              />
            </el-tooltip>
          </template>
        </PureTable>
      </template>
    </TableProBar>
    <editFormDialog
      v-model:visible="formDialogVisible"
      :data="formData"
      @refresh="onSearch"
    />
  </div>
</template>
