<style lang="scss" scoped>
:deep(.el-input-group__append) {
  width: 60px;
}

.el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
</style>

<script setup lang="ts">
import { ref, watch } from "vue";
import { FormInstance } from "element-plus";
import { getWellMoreInfo } from "/@/api/well";
import dayjs from "dayjs";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  wellName: {
    type: String,
    default: () => ""
  }
});

const initialData = {
  requestTime: null,
  BITDEP: null,
  BLOCKCOMP: null,
  DEPTH: null,
  FLOWIN: null,
  FLOWOUTPC: null,
  HKLD: null,
  MWIN: null,
  MWOUT: null,
  PUMP1: null,
  PUMP2: null,
  PUMP3: null,
  SPP: null,
  SURF_RPM: null,
  TGAS_OUT: null,
  WOB: null,
  wellName: null
};
const formData = ref({ ...initialData });

function getDetail() {
  getWellMoreInfo(wellName.value)
    .then(({ status, data }) => {
      if (status === 200) {
        formData.value = {
          ...data,
          requestTime: dayjs(data.requestTime * 1000).format(
            "YYYY-MM-DD HH:mm:ss"
          )
        };
      } else {
        if (timer.value !== null) {
          clearInterval(timer.value);
        }
      }
    })
    .catch(() => {
      if (timer.value !== null) {
        clearInterval(timer.value);
      }
    });
}

const timer = ref(null);

const formVisible = ref(false),
  wellName = ref(null),
  ruleFormRef = ref<FormInstance>();

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const closeDialog = () => {
  wellName.value = null;

  resetForm(ruleFormRef.value);
  if (timer.value !== null) {
    clearInterval(timer.value);
  }

  formVisible.value = false;
};

const emits = defineEmits(["update:visible"]);

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
  () => props.wellName,
  val => {
    if (val !== null) {
      wellName.value = val;
      getDetail();
      timer.value = setInterval(() => {
        getDetail();
      }, 1000);
    }
  }
);
</script>

<template>
  <el-dialog
    v-model="formVisible"
    width="45%"
    draggable
    :before-close="closeDialog"
    title="井队作业关键参数"
    center
  >
    <!-- 表单内容 -->
    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="formData"
      label-width="100px"
    >
      <el-form-item label="井号" prop="wellName">
        <el-input v-model="formData.wellName" readonly>
          <template #append>/</template>
        </el-input>
      </el-form-item>

      <el-form-item label="时间" prop="requestTime">
        <el-input v-model="formData.requestTime" readonly>
          <template #append>/</template>
        </el-input>
      </el-form-item>

      <el-form-item label="实测井深" prop="DEPTH">
        <el-input v-model="formData.DEPTH" readonly>
          <template #append>m</template>
        </el-input>
      </el-form-item>

      <el-form-item label="钻头参数" prop="BITDEP">
        <el-input v-model="formData.BITDEP" readonly>
          <template #append>m</template>
        </el-input>
      </el-form-item>

      <el-form-item label="钻压" prop="WOB">
        <el-input v-model="formData.WOB" readonly>
          <template #append>MPa</template>
        </el-input>
      </el-form-item>

      <el-form-item label="泵压" prop="SPP">
        <el-input v-model="formData.SPP" readonly>
          <template #append>MPa</template>
        </el-input>
      </el-form-item>

      <el-form-item label="泵冲1" prop="PUMP1">
        <el-input v-model="formData.PUMP1" readonly>
          <template #append>spm</template>
        </el-input>
      </el-form-item>

      <el-form-item label="泵冲2" prop="PUMP2">
        <el-input v-model="formData.PUMP2" readonly>
          <template #append>spm</template>
        </el-input>
      </el-form-item>

      <el-form-item label="泵冲3" prop="PUMP3">
        <el-input v-model="formData.PUMP3" readonly>
          <template #append>spm</template>
        </el-input>
      </el-form-item>

      <el-form-item label="入口流量" prop="FLOWIN">
        <el-input v-model="formData.FLOWIN" readonly>
          <template #append>l/s</template>
        </el-input>
      </el-form-item>

      <el-form-item label="出口流量" prop="FLOWOUTPC">
        <el-input v-model="formData.FLOWOUTPC" readonly>
          <template #append>%</template>
        </el-input>
      </el-form-item>

      <el-form-item label="入口密度" prop="MWIN">
        <el-input v-model="formData.MWIN" readonly>
          <template #append>g/cm³</template>
        </el-input>
      </el-form-item>

      <el-form-item label="出口密度" prop="MWOUT">
        <el-input v-model="formData.MWOUT" readonly>
          <template #append>g/cm³</template>
        </el-input>
      </el-form-item>

      <el-form-item label="总体积" prop="PITTOT">
        <el-input v-model="formData.PITTOT" readonly>
          <template #append>m³</template>
        </el-input>
      </el-form-item>

      <el-form-item label="总池增减体积" prop="GAINLOSSTOT">
        <el-input v-model="formData.GAINLOSSTOT" readonly>
          <template #append>m³</template>
        </el-input>
      </el-form-item>

      <el-form-item label="总烃" prop="TGAS_OUT">
        <el-input v-model="formData.TGAS_OUT" readonly>
          <template #append>%</template>
        </el-input>
      </el-form-item>

      <el-form-item label="大钩负荷" prop="HKLD">
        <el-input v-model="formData.HKLD" readonly>
          <template #append>KN</template>
        </el-input>
      </el-form-item>

      <el-form-item label="大钩位置" prop="BLOCKCOMP">
        <el-input v-model="formData.BLOCKCOMP" readonly>
          <template #append>m</template>
        </el-input>
      </el-form-item>

      <el-form-item label="转速" prop="SURF_RPM">
        <el-input v-model="formData.SURF_RPM" readonly>
          <template #append>rpm</template>
        </el-input>
      </el-form-item>

      <el-form-item label="转速" style="visibility: hidden">
        <el-input readonly>
          <template #append>rpm</template>
        </el-input>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
