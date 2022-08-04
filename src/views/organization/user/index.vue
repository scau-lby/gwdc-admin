<script setup lang="ts">
import addUserFormDialog from "./components/AddUserFormDialog.vue";
import editUserFormDialog from "./components/EditUserFormDialog.vue";
import userGroupFormDialog from "./components/UserGroupFormDialog.vue";
import { useColumns } from "./columns";
import { getUserList, resetPwd, deleteUser } from "/@/api/organization";
import { reactive, ref, onMounted, nextTick } from "vue";
import { ElMessageBox, ElNotification } from "element-plus";
import { type FormInstance } from "element-plus";
import { TableProBar } from "/@/components/ReTable";
import { type PaginationProps } from "@pureadmin/table";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

defineOptions({
  name: "User"
});

const form = reactive({
  belongTo: "",
  loginName: "",
  state: ""
  // status: ""
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
  addUserFormDialogVisible.value = true;
}

function onResetPwd(row) {
  ElMessageBox.prompt(
    `用户 【${row.userName}】 的密码将被重新设置`,
    "重设密码",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern:
        /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/,
      inputErrorMessage: "密码格式应为8-18位数字、字母、符号的任意两种组合",
      type: "warning",
      draggable: true,
      center: true
    }
  ).then(({ value }) => {
    resetPwd({
      loginName: row.loginName,
      passwd: value
    }).then(() => {
      ElNotification({
        title: "操作成功",
        message: `重设用户 【${row.userName}】 密码`,
        type: "success"
      });
    });
  });
}

function onEdit(row) {
  editUserFormDialogVisible.value = true;
  const { passWord, onLine, loginTimes, createTime, ...params } = row;
  console.log(passWord, onLine, loginTimes, createTime);
  nextTick(() => {
    userFormData.value = { ...params };
  });
}

function onDelete(row) {
  deleteUser({ id: row.ID }).then(() => {
    ElNotification({
      title: "操作成功",
      message: `删除用户 【${row.userName}】`,
      type: "success"
    });
    if (dataList.value.length === 1) {
      pagination.currentPage =
        pagination.currentPage > 1 ? pagination.currentPage - 1 : 1;
    }
    onSearch();
  });
}

function onSetGroups(row) {
  userGroupFormDialogVisible.value = true;
  nextTick(() => {
    userGroupFormData.value = {
      userId: row.ID,
      loginName: row.loginName,
      userName: row.userName,
      group_ids: row.groups.split(",")
    };
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
  let { data } = await getUserList({
    ...form,
    pageSize: pagination.pageSize,
    pageNum: pagination.currentPage
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

const initialUFData = {
  userId: 0,
  loginName: "",
  userName: "",
  passWord: "1234qwer",
  belongTo: "",
  email: "",
  phone: "",
  state: 1,
  adminOrg: 0,
  groups: ""
};

const addUserFormDialogVisible = ref(false);
const editUserFormDialogVisible = ref(false);
const userFormData = ref({ ...initialUFData });

const initialUGFData = {
  userId: 0,
  loginName: "",
  userName: "",
  group_ids: ""
};
const userGroupFormDialogVisible = ref(false);
const userGroupFormData = ref({ ...initialUGFData });
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-white w-99/100 pl-8 pt-4"
    >
      <el-form-item label="所属单位" prop="belongTo">
        <el-select v-model="form.belongTo" placeholder="请选择" clearable />
      </el-form-item>
      <el-form-item label="用户状态" prop="state">
        <el-select v-model="form.state" placeholder="请选择" clearable>
          <el-option label="已激活" :value="1" />
          <el-option label="未激活" :value="0" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="用户当前状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择" clearable>
            <el-option label="在线" :value="1" />
            <el-option label="离线" :value="0" />
          </el-select>
        </el-form-item> -->
      <el-form-item label="用户姓名" prop="loginName">
        <el-input
          v-model="form.loginName"
          placeholder="请输入用户姓名"
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
      title="用户管理"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon('plus')" @click="onAdd">
          新增用户
        </el-button>
      </template>
      <template v-slot="{ size, checkList }">
        <PureTable
          border
          align="center"
          table-layout="auto"
          :size="size"
          :data="dataList"
          :columns="columns"
          :checkList="checkList"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{ background: '#fafafa', color: '#606266' }"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        >
          <template #operation="{ row }">
            <el-tooltip content="重设密码" placement="left">
              <el-button
                class="reset-margin"
                type="text"
                :size="size"
                :icon="useRenderIcon('password')"
                @click="onResetPwd(row)"
              />
            </el-tooltip>
            <el-button
              class="reset-margin"
              type="text"
              :size="size"
              :icon="useRenderIcon('edit-open')"
              @click="onEdit(row)"
            />
            <el-popconfirm title="是否确认删除?" @confirm="onDelete(row)">
              <template #reference>
                <el-button
                  class="reset-margin"
                  type="text"
                  :size="size"
                  :icon="useRenderIcon('delete')"
                />
              </template>
            </el-popconfirm>
            <el-tooltip content="设置分组" placement="right">
              <el-button
                class="reset-margin"
                type="text"
                :size="size"
                :icon="useRenderIcon('role')"
                @click="onSetGroups(row)"
              />
            </el-tooltip>
          </template>
        </PureTable>
      </template>
    </TableProBar>

    <addUserFormDialog
      v-model:visible="addUserFormDialogVisible"
      :data="userFormData"
    />
    <editUserFormDialog
      v-model:visible="editUserFormDialogVisible"
      :data="userFormData"
    />
    <userGroupFormDialog
      v-model:visible="userGroupFormDialogVisible"
      :data="userGroupFormData"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
