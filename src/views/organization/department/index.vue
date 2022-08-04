<script setup lang="ts">
import { useColumns } from "./columns";
import { getOrgList, deleteOrg } from "/@/api/organization";
import { handleTree } from "@pureadmin/utils";
import dialogForm from "./components/DialogForm.vue";
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
  console.log(row);
  deleteOrg({
    orgId: row.id
  }).then(({ status }) => {
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
  let { data } = await getOrgList({});
  const dataArray = JSON.parse(data);

  const list = dataArray.map(item => {
    // if (item.pid > 0) {
    //   item.parentName = dataArray.filter(
    //     row => row.orgId === item.pid
    //   )[0].orgName;
    // } else {
    //   item.parentName = "-";
    // }
    const { orgId, pid } = item;
    return {
      id: orgId,
      parentId: pid,
      ...item
    };
  });

  dataList.value = handleTree(list);

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
      :tableRef="tableRef?.getTableRef()"
      title="组织机构"
      :loading="loading"
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
          row-key="id"
          table-layout="auto"
          showOverflowTooltip
          default-expand-all
          :size="size"
          :data="dataList"
          :columns="columns"
          :checkList="checkList"
          :header-cell-style="{ background: '#fafafa', color: '#606266' }"
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
    <dialogForm
      v-model:visible="formDialogVisible"
      :data="formData"
      @refresh="onSearch"
    />
  </div>
</template>
