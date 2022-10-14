<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { FormInstance } from "element-plus";
// import { addGroup, editGroup } from "/@/api/organization";
import { getOrgList } from "/@/api/organization";

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
      // editGroup(formData.value).then(({ status }) => {
      //   if (status === 200) {
      //     ElNotification({
      //       title: "操作成功",
      //       message: `编辑用户组 【${formData.value.groupName}】`,
      //       type: "success"
      //     });
      //     emits("refresh");
      //     formVisible.value = false;
      //     resetForm(formEl);
      //   }
      // });
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

const rules = {};

onMounted(() => {
  getOrgList().then(res => {
    console.log(res);
  });
});
</script>

<template>
  <el-dialog
    v-model="formVisible"
    title="编辑"
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
      <el-form-item label="设备编号" prop="plateNum">
        <el-input v-model="formData.plateNum" readonly />
      </el-form-item>
      <el-form-item label="施工井号" prop="wellName">
        <el-input v-model="formData.wellName" placeholder="请输入施工井号" />
      </el-form-item>
      <el-form-item label="施工任务" prop="wellType">
        <el-input v-model="formData.wellType" placeholder="请输入施工任务" />
      </el-form-item>
      <el-form-item label="作业单位" prop="taskDepartment" />
      <el-form-item label="施工指挥" prop="commander">
        <el-input v-model="formData.commander" placeholder="请输入施工指挥" />
      </el-form-item>
      <el-form-item label="操作人员" prop="opreatePerson">
        <el-input
          v-model="formData.opreatePerson"
          placeholder="请输入操作人员"
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
