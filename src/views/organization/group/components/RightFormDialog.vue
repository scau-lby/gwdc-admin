<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { ElNotification, FormInstance } from "element-plus";
import { getRightList, saveRoleRights } from "/@/api/role";

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
      saveRoleRights(formData.value.gid, formData.value.rids.join(",")).then(
        ({ status }) => {
          if (status === 200) {
            ElNotification({
              title: "操作成功",
              message: `角色【${
                formData.value.groupName
              }】设置权限 【${formData.value.rids.join(",")}】`,
              type: "success"
            });
            emits("refresh");
            formVisible.value = false;
            resetForm(formEl);
          }
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
  groupName: [{ required: true, message: "请输入用户组名称", trigger: "blur" }],
  rids: [
    {
      type: "array",
      required: true,
      message: "请至少设置一项权限",
      trigger: "change"
    }
  ]
};

const rightList = ref([]);

async function getRights() {
  let { data } = await getRightList();
  rightList.value = data;
}

onMounted(() => {
  getRights();
});
</script>

<template>
  <el-dialog
    v-model="formVisible"
    title="权限设置"
    :width="680"
    draggable
    :before-close="closeDialog"
    center
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
        <el-input
          v-model="formData.groupName"
          placeholder="请输入用户组名称"
          readonly
        />
      </el-form-item>
      <el-form-item label="用户组权限" prop="rids">
        <el-checkbox-group v-model="formData.rids">
          <template v-for="item in rightList" :key="item.rid">
            <el-checkbox :label="item.rid">
              {{ item.funcInfo }}
            </el-checkbox>
            <br />
          </template>
        </el-checkbox-group>
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

<style lang="scss" scoped>
::v-deep(.el-checkbox-group) {
  width: 100%;
  max-height: 500px !important;
  overflow-y: auto;
}
</style>
