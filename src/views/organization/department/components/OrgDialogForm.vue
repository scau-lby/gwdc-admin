<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElNotification, FormInstance } from "element-plus";
import { getOrgList, editOrg, addOrg } from "/@/api/organization";
import { handleTree } from "@pureadmin/utils";

const orgProps = {
  checkStrictly: true,
  value: "orgId",
  label: "orgName",
  children: "children",
  emitPath: false
};

let orgList = ref([]);
let orgOptions = ref([]);

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
      if (formData.value.pid > 0) {
        formData.value.layer =
          orgList.value.filter(item => item.orgId === formData.value.pid)[0]
            .layer + 1;
      }
      if (formData.value.orgId > 0) {
        editOrg({
          orgId: formData.value.orgId,
          orgName: formData.value.orgName
        }).then(() => {
          getOrgOptions();
          ElNotification({
            title: "操作成功",
            message: `编辑机构 【${formData.value.orgName}】`,
            type: "success"
          });
          formVisible.value = false;
          resetForm(formEl);
          emits("refresh");
        });
      } else {
        const { orgId, ...params } = formData.value;
        console.log(orgId);
        addOrg({
          ...params
        }).then(() => {
          getOrgOptions();
          ElNotification({
            title: "操作成功",
            message: `新增机构 【${formData.value.orgName}】`,
            type: "success"
          });
          formVisible.value = false;
          resetForm(formEl);
          emits("refresh");
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
  orgName: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
  pid: [
    {
      required: true,
      message: "请选择上级机构",
      trigger: "change"
    }
  ]
};

function getOrgOptions() {
  getOrgList().then(({ data }) => {
    orgList.value = JSON.parse(data);
    orgOptions.value = handleTree(JSON.parse(data), "orgId", "pid");
  });
}

onMounted(() => {
  getOrgOptions();
});
</script>

<template>
  <el-dialog
    v-model="formVisible"
    :title="formData.orgId > 0 ? '编辑机构' : '新增机构'"
    :width="680"
    draggable
    :before-close="closeDialog"
  >
    <!-- 表单内容 -->
    <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="机构ID" prop="orgId" style="display: none">
        <el-input v-model="formData.orgId" />
      </el-form-item>
      <el-form-item label="机构名称" prop="orgName">
        <el-input v-model="formData.orgName" placeholder="请输入机构名称" />
      </el-form-item>
      <el-form-item label="当前层级" prop="layer" style="display: none">
        <el-input v-model="formData.layer" />
      </el-form-item>
      <el-form-item
        label="上级机构"
        prop="pid"
        :style="{ display: formData.orgId > 0 ? 'none' : '' }"
      >
        <el-cascader
          v-model="formData.pid"
          :options="orgOptions"
          :props="orgProps"
          :show-all-levels="false"
          clearable
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
