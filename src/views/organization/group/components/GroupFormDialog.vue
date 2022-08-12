<script setup lang="ts">
import { ref, watch } from "vue";
import { ElNotification, FormInstance } from "element-plus";
import { addGroup, editGroup } from "/@/api/organization";

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
      if (formData.value.gid > 0) {
        editGroup(formData.value).then(({ status }) => {
          if (status === 200) {
            ElNotification({
              title: "操作成功",
              message: `编辑用户组 【${formData.value.groupName}】`,
              type: "success"
            });
            emits("refresh");
            formVisible.value = false;
            resetForm(formEl);
          }
        });
      } else {
        addGroup({
          groupName: formData.value.groupName,
          note: formData.value.note
        }).then(({ status }) => {
          if (status === 200) {
            ElNotification({
              title: "操作成功",
              message: `新增用户组 【${formData.value.groupName}】`,
              type: "success"
            });
            emits("refresh");
            formVisible.value = false;
            resetForm(formEl);
          }
        });
      }
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
  groupName: [{ required: true, message: "请输入用户组名称", trigger: "blur" }],
  note: [{ required: true, message: "请输入用户组描述", trigger: "blur" }]
};
</script>

<template>
  <el-dialog
    v-model="formVisible"
    :title="formData.gid > 0 ? '编辑用户组' : '新增用户组'"
    :width="680"
    draggable
    :before-close="closeDialog"
  >
    <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="用户组ID" prop="gid" style="display: none">
        <el-input v-model="formData.gid" />
      </el-form-item>
      <el-form-item label="用户组名称" prop="groupName">
        <el-input v-model="formData.groupName" placeholder="请输入用户组名称" />
      </el-form-item>
      <el-form-item label="用户组描述" prop="note">
        <el-input
          type="textarea"
          v-model="formData.note"
          placeholder="请输入用户组描述"
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
