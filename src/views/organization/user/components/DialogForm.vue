<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElNotification, FormInstance } from "element-plus";
import { getOrgTree } from "/@/api/organization";
const BelongToProps = {
  checkStrictly: true,
  value: "id",
  label: "label",
  children: "children"
};
let BelongToOptions = ref([]);
async function getTree() {
  let { ResultCode, data, Msg } = await getOrgTree({});
  if (ResultCode === 0) {
    BelongToOptions = data;
    console.log(BelongToOptions);
  } else {
    ElNotification({
      title: "操作失败",
      message: `获取组织机构树, 提示：${Msg}`,
      type: "error"
    });
  }
}

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
      ElNotification({
        title: "操作成功",
        message: `新增/编辑用户 【${formData.value.UserName}】`,
        type: "success"
      });
      formVisible.value = false;
      resetForm(formEl);
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

const validateMobile = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入手机号码"));
  } else if (!/^1(3|4|5|6|7|8|9)d{9}$/.test(value)) {
    callback(new Error("手机号码格式错误"));
  } else {
    callback();
  }
};

const validateEmail = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入电子邮箱"));
  } else if (
    !/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(
      value
    )
  ) {
    callback(new Error("电子邮箱格式错误"));
  } else {
    callback();
  }
};

// const validateEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;

const rules = {
  LoginName: [{ required: true, message: "请输入登录名称", trigger: "blur" }],
  UserName: [{ required: true, message: "请输入用户姓名", trigger: "blur" }],
  BelongTo: [
    {
      required: true,
      message: "请选择所属单位",
      trigger: "change"
    }
  ],
  mobile: [{ validator: validateMobile, trigger: "blur" }],
  email: [{ validator: validateEmail, trigger: "blur" }]
};

onMounted(() => {
  getTree();
});
</script>

<template>
  <el-dialog
    v-model="formVisible"
    title="新增用户"
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
      <el-form-item label="登录名称" prop="LoginName">
        <el-input
          v-model="formData.LoginName"
          :style="{ width: '480px' }"
          placeholder="请输入登录名称"
        />
      </el-form-item>
      <el-form-item label="用户姓名" prop="UserName">
        <el-input
          v-model="formData.UserName"
          :style="{ width: '480px' }"
          placeholder="请输入用户姓名"
        />
      </el-form-item>
      <el-form-item label="所属单位" prop="BelongTo">
        <el-cascader
          :options="BelongToOptions"
          :props="BelongToProps"
          clearable
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input
          v-model="formData.mobile"
          :style="{ width: '480px' }"
          placeholder="请输入联系电话"
        />
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input
          v-model="formData.email"
          :style="{ width: '480px' }"
          placeholder="请输入电子邮箱"
        />
      </el-form-item>
      <el-form-item label="是否激活" prop="state">
        <el-radio-group v-model="formData.state">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
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
