<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElNotification, FormInstance } from "element-plus";
import { handleTree } from "@pureadmin/utils";

// api
import { getOrgList, setOrgPermit } from "/@/api/org";
import { getTruckList } from "/@/api/truck";

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
      setOrgPermit(
        formData.value.orgId,
        formData.value.plate_nums.join(",")
      ).then(() => {
        ElNotification({
          title: "操作成功",
          message: `机构 【${
            formData.value.orgName
          }】授权车辆【${formData.value.plate_nums.join(",")}】`,
          type: "success"
        });
        formVisible.value = false;
        resetForm(formEl);
        emits("refresh");
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

const orgOptions = ref([]);
const orgProps = {
  children: "children",
  label: "orgName"
};

const truckList = ref([]);

async function getTrucks() {
  let { data } = await getTruckList({
    pageNum: 1,
    pageSize: 10000
  });

  truckList.value = data.records;

  let { data: orgData } = await getOrgList();
  const orgList = JSON.parse(orgData).map(item => {
    return {
      ...item,
      plateNums: truckList.value.filter(row => row.belongTo === item.orgName)
    };
  });
  orgOptions.value = handleTree(orgList, "orgId", "pid");
}

onMounted(() => {
  // getOrgOptions();
  getTrucks();
});
</script>

<template>
  <el-dialog
    v-model="formVisible"
    title="授权车辆"
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
        <el-input
          v-model="formData.orgName"
          placeholder="请输入机构名称"
          readonly
        />
      </el-form-item>
      <el-form-item label="授权车辆" prop="plate_nums">
        <el-checkbox-group v-model="formData.plate_nums">
          <el-tree
            :data="orgOptions"
            :props="orgProps"
            default-expand-all
            :expand-on-click-node="false"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <p style="height: 32px; line-height: 32px; color: #409eff">
                  {{ node.label }}
                </p>
                <el-row :gutter="20">
                  <el-col
                    :span="8"
                    v-for="item in data.plateNums"
                    :key="item.id"
                  >
                    <el-checkbox :label="item.plateNum">
                      {{ item.plateNum }}
                    </el-checkbox>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-tree>
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

::v-deep(.el-tree-node__content) {
  height: auto;
}
</style>
