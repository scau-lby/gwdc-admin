<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElNotification, FormInstance } from "element-plus";
import { userBindGroup } from "/@/api/organization";

let groups = ref([]);
// async function getUserGroupList() {
//   let { ResultCode, data, Msg } = await getGroupList({});
//   if (ResultCode === 0) {
//     groups.value = data;
//   } else {
//     ElNotification({
//       title: "操作失败",
//       message: `获取用户分组, 提示：${Msg}`,
//       type: "error"
//     });
//   }
// }

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

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      userBindGroup({
        uid: formData.value.uid,
        group_ids: formData.value.group_ids.join(",")
      }).then(() => {
        ElNotification({
          title: "操作成功",
          message: `用户 【${
            formData.value.UserName
          }】绑定分组 【${formData.value.group_ids.join(",")}】`,
          type: "success"
        });

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

const rules = {
  group_ids: [
    {
      type: "array",
      required: true,
      message: "请至少为用户选择一个分组",
      trigger: "change"
    }
  ]
};

onMounted(() => {
  // getUserGroupList();
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
      <el-form-item prop="LoginName">
        <el-input
          v-model="formData.LoginName"
          :style="{ width: '480px' }"
          readonly
        />
      </el-form-item>
      <el-form-item prop="UserName">
        <el-input
          v-model="formData.UserName"
          :style="{ width: '480px' }"
          readonly
        />
      </el-form-item>
      <el-form-item prop="group_ids">
        <el-checkbox-group v-model="formData.group_ids">
          <template v-for="item in groups" :key="item.GID">
            <el-checkbox :label="item.GID + ''">
              {{ item.GroupName }}
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
