<script setup lang="ts">
import { useColumns } from "./columns";
// import { geList } from "/@/api/home";
import { ref, onMounted } from "vue";
// import { ElNotification } from "element-plus";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
// import { TableProBar } from "/@/components/ReTable";

let dataList = ref([{}]);
let loading = ref(true);
const { columns } = useColumns();

function onToggle(row) {
  console.log(row);
}

function onPush(row) {
  console.log(row);
}

function onView(row) {
  console.log(row);
}

async function onSearch() {
  loading.value = true;
  // let { data } = await getOrgList({});
  // console.log(JSON.parse(data));
  // dataList.value = handleTree(JSON.parse(data));

  setTimeout(() => {
    loading.value = false;
  }, 500);
}

onMounted(() => {
  onSearch();
});
</script>

<template>
  <PureTable
    border
    align="center"
    row-key="id"
    table-layout="auto"
    showOverflowTooltip
    :data="dataList"
    :columns="columns"
    :header-cell-style="{ background: '#fafafa', color: '#606266' }"
  >
    <template #operation="{ row }">
      <el-button
        class="reset-margin"
        type="text"
        bg
        :icon="useRenderIcon('heart-broken')"
        @click="onToggle(row)"
      />
      <el-button
        class="reset-margin"
        plain
        round
        size="small"
        @click="onToggle(row)"
      >
        取消显示
      </el-button>
      <el-button
        class="reset-margin"
        plain
        round
        size="small"
        @click="onPush(row)"
      >
        数据推送
      </el-button>
    </template>
    <template #operation1="{ row }">
      <el-button
        class="reset-margin"
        plain
        round
        size="small"
        @click="onView(row)"
      >
        了解详情
      </el-button>
    </template>
  </PureTable>
</template>
