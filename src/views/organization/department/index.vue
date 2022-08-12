<script setup lang="ts">
import { useColumns } from "./columns";
import { getOrgList, deleteOrg } from "/@/api/organization";
import { handleTree } from "@pureadmin/utils";
import orgDialogForm from "./components/OrgDialogForm.vue";
import { ref, onMounted, nextTick } from "vue";
import { ElNotification } from "element-plus";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { TableProBar } from "/@/components/ReTable";

defineOptions({
  name: "Department"
});

let dataList = ref([]);
let loading = ref(true);
const { columns } = useColumns();

const tableRef = ref();

function onAdd() {
  formDialogVisible.value = true;
}

function onEdit(row) {
  formDialogVisible.value = true;
  nextTick(() => {
    formData.value = {
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

  dataList.value = handleTree(JSON.parse(data), "orgId", "pid");

  setTimeout(() => {
    loading.value = false;
  }, 500);
}

onMounted(() => {
  onSearch();
});

const initialData = {
  orgId: 0,
  orgName: "",
  pid: 0,
  layer: 0
};

const formDialogVisible = ref(false);
const formData = ref({ ...initialData });
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
            <el-button
              class="reset-margin"
              type="text"
              :size="size"
              :icon="useRenderIcon('edit-open')"
              @click="onEdit(row)"
            />
            <el-popconfirm title="是否确定删除该机构?" @confirm="onDelete(row)">
              <template #reference>
                <el-button
                  class="reset-margin"
                  type="text"
                  :size="size"
                  :icon="useRenderIcon('delete')"
                />
              </template>
            </el-popconfirm>
          </template>
        </PureTable>
      </template>
    </TableProBar>
    <orgDialogForm
      v-model:visible="formDialogVisible"
      :data="formData"
      @refresh="onSearch"
    />
  </div>
</template>
