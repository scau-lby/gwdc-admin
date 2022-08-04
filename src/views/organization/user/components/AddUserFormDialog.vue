<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElNotification, FormInstance } from "element-plus";
import { addUser } from "/@/api/organization";

const belongToProps = {
  checkStrictly: true,
  value: "label",
  label: "label",
  children: "children",
  emitPath: false
};

let belongToOptions = ref([]);

// async function getTree() {
//   let { ResultCode, data, Msg } = await getOrgTree({});
//   if (ResultCode === 0) {
//     belongToOptions.value = data;
//   } else {
//     ElNotification({
//       title: "操作失败",
//       message: `获取组织机构树, 提示：${Msg}`,
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
      delete formData.value?.userId;
      addUser({
        ...formData.value,
        belongTo: "固井公司",
        groups: "1,2,3"
      }).then(() => {
        ElNotification({
          title: "操作成功",
          message: `新增用户 【${formData.value.userName}】`,
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
//
const rules = {
  loginName: [{ required: true, message: "请输入登录名称", trigger: "blur" }],
  passWord: [
    { required: true, message: "请输入登录密码", trigger: "blur" },
    {
      pattern:
        /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/,
      message: "密码格式应为8-18位数字、字母、符号的任意两种组合",
      trigger: "change"
    }
  ],
  userName: [{ required: true, message: "请输入用户姓名", trigger: "blur" }],
  // belongTo: [
  //   {
  //     required: true,
  //     message: "请选择所属单位",
  //     trigger: "change"
  //   }
  // ],
  phone: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "手机号码格式不正确",
      trigger: "blur"
    }
  ],
  email: [
    { required: true, message: "请输入电子邮箱", trigger: "blur" },
    {
      pattern:
        /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
      message: "电子邮箱格式不正确",
      trigger: "blur"
    }
  ],
  groups: [
    {
      required: true,
      message: "请设置用户分组",
      trigger: "change"
    }
  ]
};

onMounted(() => {
  // getTree();
});
</script>

<template>
  <el-dialog
    v-model="formVisible"
    title="新增用户"
    :width="500"
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
      <el-form-item label="登录名称" prop="loginName">
        <el-input v-model="formData.loginName" placeholder="请输入登录名称" />
      </el-form-item>
      <el-form-item label="登录密码" prop="passWord">
        <el-input v-model="formData.passWord" placeholder="请输入登录密码" />
      </el-form-item>
      <el-form-item label="用户姓名" prop="userName">
        <el-input v-model="formData.userName" placeholder="请输入用户姓名" />
      </el-form-item>
      <el-form-item label="所属单位" prop="belongTo">
        <el-cascader
          v-model="formData.belongTo"
          :options="belongToOptions"
          :props="belongToProps"
          :show-all-levels="false"
          clearable
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入电子邮箱" />
      </el-form-item>
      <el-form-item label="是否激活" prop="state">
        <el-radio-group v-model="formData.state">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否管理员" prop="adminOrg">
        <el-radio-group v-model="formData.adminOrg">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
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
