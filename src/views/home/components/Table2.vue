<script setup lang="ts">
import { PropType } from "vue";
import { Table2Item } from "./data";
let props = defineProps({
  tableData: {
    type: Array as PropType<Array<Table2Item>>,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  page: {
    type: Number,
    default: () => 1
  },
  size: {
    type: Number,
    default: 5
  }
});
const handleSizeChange = () => {};
const handleCurrentChange = () => {};
const onJump = row => {
  console.log("onJump", row);
};
</script>

<template>
  <el-table
    :data="props.tableData"
    style="width: 100%; margin-top: 20px"
    :header-cell-style="{
      backgroundColor: 'rgba(0,21,41,.7)',
      color: '#d0d0d0'
    }"
    :max-height="300"
  >
    <el-table-column label="操作" width="120" align="center" fixed>
      <template #default="scope">
        <el-button size="small" @click="onJump(scope.row)">
          进入实时监控
        </el-button>
      </template>
    </el-table-column>
    <el-table-column label="序号" width="60" align="center" type="index" />
    <el-table-column label="施工任务" align="center" prop="address" />
    <el-table-column
      label="作业单位"
      align="center"
      prop="danwei"
      :default-sort="{ prop: 'danwei', order: 'descending' }"
    />
    <el-table-column label="设备编号" align="center" prop="truckPlate" />
    <el-table-column label="施工指挥" align="center" prop="" />
    <el-table-column label="操作人员" align="center" prop="operator" />
    <el-table-column label="当前状态" align="center">
      <template #default="scope">
        <span v-if="scope.row.online">在线传输</span>
        <span v-else>传输暂停</span>
      </template>
    </el-table-column>
    <el-table-column label="设备所属单位" align="center" prop="wellNum" />
    <el-table-column label="在线时长" align="center" prop="type" />
    <el-table-column label="关注度" align="center" prop="" />
    <el-table-column label="施工位置" align="center" prop="address" />
  </el-table>
  <div
    style="
      background-color: #fff;
      padding: 10px 0;
      display: flex;
      justify-content: center;
    "
  >
    <el-pagination
      :currentPage="props.page"
      :page-size="props.size"
      :page-sizes="[5, 10, 20, 30]"
      small
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="props.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped></style>
