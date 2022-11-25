<script setup lang="ts">
import { ref, watch } from "vue";
import { ElNotification, FormInstance } from "element-plus";
import { updateHistoryWell } from "/@/api/history";

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

const formVisible = ref(false);
const formData = ref({});
const ruleFormRef = ref<FormInstance>();

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const closeDialog = () => {
  resetForm(ruleFormRef.value);
  formVisible.value = false;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      updateHistoryWell({
        ...formData.value
      }).then(() => {
        ElNotification({
          title: "操作成功",
          message: `更新口井 【${formData.value?.wellName}】`,
          type: "success"
        });
        formVisible.value = false;
        resetForm(formEl);
        emits("refresh");
      });
    }
  });
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
</script>

<template>
  <el-dialog
    v-model="formVisible"
    width="600px"
    draggable
    :before-close="closeDialog"
    title="更新口井"
    center
  >
    <!-- 表单内容 -->
    <el-form ref="ruleFormRef" :model="formData" label-width="100px">
      <el-form-item label="ID" prop="id" style="display: none">
        <el-input v-model="formData.id" />
      </el-form-item>
      <el-form-item label="井号" prop="wellName">
        <el-input v-model="formData.wellName" readonly />
      </el-form-item>
      <el-form-item label="固井类型" prop="wellType">
        <el-input v-model="formData.wellType" readonly />
      </el-form-item>
      <el-form-item label="作业单位" prop="belongTo">
        <el-input v-model="formData.belongTo" />
      </el-form-item>
      <el-form-item label="施工指挥" prop="commander">
        <el-input v-model="formData.commander" />
      </el-form-item>
      <el-form-item label="操作人员" prop="opreatePerson">
        <el-input v-model="formData.opreatePerson" />
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
