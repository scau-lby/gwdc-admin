<script setup lang="ts">
import { useColumns } from "./columns";
import { handleTree } from "@pureadmin/utils";
import { ref, onMounted, nextTick } from "vue";
import { ElNotification } from "element-plus";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { TableProBar } from "/@/components/ReTable";

// api
import { getOrgList, deleteOrg, getOrgPermit } from "/@/api/org";
// components
import orgFormDialog from "./components/OrgFormDialog.vue";
import permitFormDialog from "./components/PermitFormDialog.vue";

defineOptions({
  name: "Department"
});
const orgList = ref([]);
const dataList = ref([]);
const loading = ref(true);
const { columns } = useColumns();

const tableRef = ref();

const initialOrgData = {
  orgId: 0,
  orgName: "",
  pid: 0,
  layer: 0
};

const orgFormDialogVisible = ref(false);
const orgFormData = ref({ ...initialOrgData });

function onAdd() {
  orgFormDialogVisible.value = true;
}

function onEdit(row) {
  orgFormDialogVisible.value = true;
  nextTick(() => {
    orgFormData.value = {
      orgId: row.orgId,
      orgName: row.orgName,
      pid: row.pid,
      layer: row.layer
    };
  });
}

function onDelete(row) {
  deleteOrg(row.orgId).then(({ status }) => {
    if (status === 200) {
      ElNotification({
        title: "操作成功",
        message: `删除机构 【${row.orgName}】`,
        type: "success"
      });
    }
    onSearch();
  });
}

async function onSearch() {
  loading.value = true;
  let { data } = await getOrgList();
  orgList.value = JSON.parse(data);
  dataList.value = handleTree(JSON.parse(data), "orgId", "pid");

  setTimeout(() => {
    loading.value = false;
  }, 500);
}

onMounted(() => {
  onSearch();
});

// 授权车辆
const initialPermitData = {
  orgId: 0,
  orgName: "",
  plate_nums: []
};

const permitFormDialogVisible = ref(false);
const permitFormData = ref({ ...initialPermitData });

function onPermit(row) {
  getOrgPermit(row.orgId).then(({ data }) => {
    nextTick(() => {
      permitFormData.value = {
        ...row,
        plate_nums: data
      };
      permitFormDialogVisible.value = true;
    });
  });
}
</script>

<template>
  <div class="main">
    <TableProBar
      title="部门列表"
      :loading="loading"
      :tableRef="tableRef?.getTableRef()"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon('plus')" @click="onAdd">
          新增组织机构
        </el-button>
      </template>
      <template v-slot="{ size, checkList }">
        <PureTable
          ref="tableRef"
          border
          align="center"
          row-key="orgId"
          table-layout="auto"
          default-expand-all
          :size="size"
          :data="dataList"
          :columns="columns"
          :checkList="checkList"
          :header-cell-style="{
            backgroundColor: 'rgba(0,21,41,.7)',
            color: '#d0d0d0'
          }"
        >
          <template #operation="{ row }">
            <el-link
              class="reset-margin"
              :size="size"
              :icon="useRenderIcon('edit-open')"
              @click="onEdit(row)"
              style="margin-right: 20px"
              type="primary"
            />
            <el-popconfirm title="是否确定删除该机构?" @confirm="onDelete(row)">
              <template #reference>
                <el-link
                  class="reset-margin"
                  :size="size"
                  :icon="useRenderIcon('delete')"
                  type="primary"
                />
              </template>
            </el-popconfirm>
            <el-tooltip content="授权车辆" placement="right">
              <el-link
                class="reset-margin"
                :size="size"
                :icon="useRenderIcon('van')"
                @click="onPermit(row)"
                style="margin-left: 20px"
                type="primary"
              />
            </el-tooltip>
          </template>
          <template #parentName="{ row }">
            {{
              row.pid === 0
                ? ""
                : orgList.filter(item => item.orgId === row.pid)[0].orgName
            }}
          </template>
        </PureTable>
      </template>
    </TableProBar>
    <orgFormDialog
      v-model:visible="orgFormDialogVisible"
      :data="orgFormData"
      @refresh="onSearch"
    />
    <permitFormDialog
      v-model:visible="permitFormDialogVisible"
      :data="permitFormData"
      @refresh="onSearch"
    />
  </div>
</template>
