<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElNotification, FormInstance } from "element-plus";
import { changeUserPwd } from "/@/api/user";
import { router } from "/@/router";
import { storageSession } from "/@/utils/storage";

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

const formVisible = ref(false);
const formData = ref(props.data);

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      changeUserPwd({
        newPasswd: formData.value.newPasswd,
        oldPasswd: formData.value.oldPasswd
      }).then(({ status }) => {
        if (status === 200) {
          ElNotification({
            title: "操作成功",
            message: `重置密码`,
            type: "success"
          });
          storageSession.removeItem("authorized-token");
          router.push("/login");
        }
        formVisible.value = false;
        resetForm(formEl);
      });
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

const emit = defineEmits(["update:visible"]);
watch(
  () => formVisible.value,
  val => {
    emit("update:visible", val);
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

const validateNewPwd = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入新密码"));
  } else {
    if (formData.value.newPasswd2 !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("newPasswd2", () => null);
    }
    callback();
  }
};
const validateNewPwd2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入新密码"));
  } else if (value !== formData.value.newPasswd) {
    callback(new Error("两次输入的新密码不一致"));
  } else {
    callback();
  }
};

const rules = {
  oldPasswd: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  newPasswd: [{ validator: validateNewPwd, trigger: "blur" }],
  newPasswd2: [{ validator: validateNewPwd2, trigger: "blur" }]
};

onMounted(() => {});
</script>

<template>
  <el-dialog
    v-model="formVisible"
    title="重置密码"
    :width="500"
    draggable
    :before-close="closeDialog"
  >
    <!-- 表单内容 -->
    <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="请输入旧密码" prop="oldPasswd">
        <el-input
          v-model="formData.oldPasswd"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="请输入新密码" prop="newPasswd">
        <el-input
          v-model="formData.newPasswd"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="请确认新密码" prop="newPasswd2">
        <el-input
          v-model="formData.newPasswd2"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
