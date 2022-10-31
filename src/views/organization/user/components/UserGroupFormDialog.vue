<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElNotification, FormInstance } from "element-plus";
import { getRoleList } from "/@/api/role";
import { setUserToken } from "/@/api/user";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const ruleFormRef = ref<FormInstance>();
const groupList = ref([]);
const formVisible = ref(false);
const formData = ref(props.data);

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      setUserToken(formData.value.userId, formData.value.gids.join(",")).then(
        () => {
          emits("refresh");
          ElNotification({
            title: "操作成功",
            message: `用户 【${
              formData.value.userName
            }】绑定分组 【${formData.value.gids.join(",")}】`,
            type: "success"
          });
          formVisible.value = false;
          resetForm(formEl);
        }
      );
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const closeDialog = () => {
  formVisible.value = false;
  resetForm(ruleFormRef.value);
};

const emits = defineEmits(["update:visible", "refresh"]);
watch(
  () => formVisible.value,
  val => {
    emits("update:visible", val);
  }
);

watch(
  () => props.visible,
  val => {
    formVisible.value = val;
  }
);

watch(
  () => props.data,
  val => {
    formData.value = val;
  }
);

const rules = {
  loginName: [
    {
      required: true
    }
  ],
  userName: [
    {
      required: true
    }
  ],
  gids: [
    {
      type: "array",
      required: true,
      message: "请至少为用户选择一个分组",
      trigger: "change"
    }
  ]
};

async function getGroupList() {
  let { data } = await getRoleList({
    pageNum: 1,
    pageSize: 1000,
    groupName: ""
  });
  groupList.value = data.records;
}

onMounted(() => {
  getGroupList();
});
</script>

<template>
  <el-dialog
    v-model="formVisible"
    title="设置分组"
    :width="300"
    draggable
    :before-close="closeDialog"
  >
    <!-- 表单内容 -->
    <el-form ref="ruleFormRef" :model="formData" :rules="rules">
      <el-form-item prop="userId" style="display: none">
        <el-input v-model="formData.loginName" readonly />
      </el-form-item>
      <el-form-item label="登录名称" prop="loginName">
        <el-input v-model="formData.loginName" readonly />
      </el-form-item>
      <el-form-item label="用户姓名" prop="userName">
        <el-input v-model="formData.userName" readonly />
      </el-form-item>
      <el-form-item label="设置分组" prop="gids">
        <el-checkbox-group v-model="formData.gids">
          <template v-for="item in groupList" :key="item.gid">
            <el-checkbox :label="item.gid">
              {{ item.groupName }}
            </el-checkbox>
            <br />
          </template>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="onSubmit(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
