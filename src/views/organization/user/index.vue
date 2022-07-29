<script setup lang="ts">
import dialogForm from "./components/DialogForm.vue";
import tree from "./tree.vue";
import { useColumns } from "./columns";
import { getUserList, setPwd, deleteUser } from "/@/api/organization";
// import { message } from "@pureadmin/components";
import { ElMessageBox, ElNotification } from "element-plus";
import { reactive, ref, onMounted } from "vue";
import { type FormInstance } from "element-plus";
import { TableProBar } from "/@/components/ReTable";
import { type PaginationProps } from "@pureadmin/table";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

defineOptions({
  name: "User"
});

const form = reactive({
  BelongTo: "固井公司",
  username: "",
  // mobile: "",
  state: ""
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
  formDialogVisible.value = true;
}

function onSetPwd(row) {
  console.log(row);
  ElMessageBox.prompt(
    `用户 【${row.username}】 的密码将被重新设置`,
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
  )
    .then(({ value }) => {
      setPwd({
        id: row.ID,
        PassWord: value
      }).then(({ ResultCode, Msg }) => {
        if (ResultCode === 0) {
          ElNotification({
            title: "操作成功",
            message: `重设用户 【${row.username}】 密码`,
            type: "success"
          });
        } else {
          ElNotification({
            title: "操作失败",
            message: `重设用户 【${row.username}】 密码，提示：${Msg}`,
            type: "error"
          });
        }
      });
    })
    .catch(() => {
      ElNotification({
        title: "操作放弃",
        message: `重设用户 【${row.username}】 密码`,
        type: "info"
      });
    });
}

function onEdit(row) {
  console.log(row);
  formDialogVisible.value = true;
  // nextTick(() => {
  //   formData.value = { ...product, status: product?.isSetup ? "1" : "0" };
  // });
}

function onDelete(row) {
  deleteUser({ id: row.ID }).then(({ ResultCode }) => {
    if (ResultCode === 0) {
      ElNotification({
        title: "操作成功",
        message: `删除用户 【${row.LoginName}】`,
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

function onSelectionChange(val) {
  pagination.currentPage = 1;
  console.log("onSelectionChange", val);
  onSearch();
}

async function onSearch() {
  loading.value = true;
  let { ResultCode, Count, data } = await getUserList({
    BelongTo: form.BelongTo,
    pageSize: pagination.pageSize,
    pageNum: pagination.currentPage,
    username: form.username,
    state: form.state
  });
  if (ResultCode !== 0) {
    // 接口错误
  }
  dataList.value = data;
  pagination.total = Count;
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

const INITIAL_DATA = {
  LoginName: "",
  UserName: "",
  BelongTo: "",
  AdminOrg: 0,
  state: 1
};

const formDialogVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
</script>

<template>
  <div class="main flex">
    <tree />
    <div class="flex-1 ml-4">
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        class="bg-white w-99/100 pl-8 pt-4"
      >
        <el-form-item label="用户名称：" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名称"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item label="手机号码：" prop="mobile">
          <el-input
            v-model="form.mobile"
            placeholder="请输入手机号码"
            clearable
          />
        </el-form-item> -->
        <el-form-item label="状态：" prop="state">
          <el-select v-model="form.state" placeholder="请选择" clearable>
            <el-option label="已激活" :value="1" />
            <el-option label="未激活" :value="0" />
          </el-select>
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
          <el-button
            :icon="useRenderIcon('refresh')"
            @click="resetForm(formRef)"
          >
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
          <el-button
            type="primary"
            :icon="useRenderIcon('plus')"
            @click="onAdd"
          >
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
            @selection-change="onSelectionChange"
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
                  @click="onSetPwd(row)"
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
                />
              </el-tooltip>
            </template>
          </PureTable>
        </template>
      </TableProBar>
    </div>
    <dialogForm v-model:visible="formDialogVisible" :data="formData" />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
