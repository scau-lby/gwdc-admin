<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElNotification, FormInstance } from "element-plus";
import { addTruck, editTruck } from "/@/api/truck";

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
// console.log(formData.value);

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      if (formData.value.id > 0) {
        editTruck({
          ...formData.value,
          belongTo: "兴隆台项目部"
        }).then(() => {
          ElNotification({
            title: "操作成功",
            message: `编辑设备 【${formData.value.plateNum}】`,
            type: "success"
          });

          formVisible.value = false;
          resetForm(formEl);
        });
      } else {
        delete formData.value?.id;
        addTruck({
          ...formData.value,
          belongTo: "兴隆台项目部"
        }).then(() => {
          ElNotification({
            title: "操作成功",
            message: `新增设备 【${formData.value.plateNum}】`,
            type: "success"
          });

          formVisible.value = false;
          resetForm(formEl);
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
  plateNum: [{ required: true, message: "请输入设备编号", trigger: "blur" }],
  // belongTo: [
  //   {
  //     required: true,
  //     message: "请选择所属单位",
  //     trigger: "change"
  //   }
  // ],
  equType: [
    {
      required: true,
      message: "请选择设备类型",
      trigger: "change"
    }
  ],
  dataSimCard: [
    { required: true, message: "请输入数据SIM卡号", trigger: "blur" }
  ],
  subject: [{ required: true, message: "请输入数据订阅主题", trigger: "blur" }],
  dataState: [
    {
      required: true,
      message: "请选择数据状态",
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
    title="新增/编辑设备"
    :width="600"
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
      <el-form-item label="设备编号" prop="plateNum">
        <el-input v-model="formData.plateNum" placeholder="请输入设备编号" />
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
      <el-form-item label="设备类型" prop="equType">
        <el-radio-group v-model="formData.equType">
          <el-radio label="双机车">双机车</el-radio>
          <el-radio label="单机车">单机车</el-radio>
          <el-radio label="双机橇">双机橇</el-radio>
          <el-radio label="单机橇">单机橇</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="数据SIM卡号" prop="dataSimCard">
        <el-input
          v-model="formData.dataSimCard"
          placeholder="请输入数据SIM卡号"
        />
      </el-form-item>
      <el-form-item label="数据订阅主题" prop="subject">
        <el-input v-model="formData.subject" placeholder="请输入数据订阅主题" />
      </el-form-item>
      <el-form-item label="数据状态" prop="dataState">
        <el-radio-group v-model="formData.dataState">
          <el-radio :label="1">激活</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="视频SIM卡号" prop="videoSimCard">
        <el-input
          v-model="formData.videoSimCard"
          placeholder="请输入视频SIM卡号"
        />
      </el-form-item>
      <el-form-item label="视频IP地址" prop="videoIp">
        <el-input v-model="formData.videoIp" placeholder="请输入视频IP地址" />
      </el-form-item>
      <el-form-item label="视频状态" prop="videoState">
        <el-radio-group v-model="formData.videoState">
          <el-radio :label="1">激活</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="视频状态" prop="videoState">
        <el-date-picker
          v-model="formData.installDate"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-value="new Date()"
        />
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input
          v-model="formData.note"
          placeholder="请输入备注"
          type="textarea"
        />
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
