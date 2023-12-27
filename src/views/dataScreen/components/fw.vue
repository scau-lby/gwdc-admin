<script lang="ts" setup>
import { ref, PropType, watch } from "vue";
interface TableColumn {
  name: string;
  kd: string;
}

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  data: {
    type: Array as PropType<TableColumn[]>,
    default: () => {
      return [];
    }
  }
});
const tableData = ref(props.data);
watch(
  () => props.data,
  val => {
    if (val) {
      tableData.value = val;
    }
  },
  { deep: true }
);
function onAdd(row) {
  console.log(row);
}
function onSub(row) {
  console.log(row);
}
</script>
<template>
  <div>
    <h5 style="text-align: center; line-height: 40px; font-size: 16px">
      灰/水阀调整
    </h5>
    <el-table
      :data="tableData"
      size="small"
      border
      fit
      style="width: 100%"
      :header-cell-style="{
        background: '#009f6b',
        color: '#ffffff'
      }"
    >
      <el-table-column prop="name" label="项目" />
      <el-table-column prop="kd" label="开度" />
      <el-table-column label="调整" align="center" width="60">
        <template #default="scope">
          <div class="flex-around">
            <IconifyIconOffline icon="caret-top" @click="onAdd(scope.row)" />
            <IconifyIconOffline icon="caret-bottom" @click="onSub(scope.row)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="设置" align="center" width="60">
        <template #default="scope">
          <div class="flex-around">
            <IconifyIconOffline
              icon="play-fill"
              v-if="scope.row.name == '灰阀'"
            />
            <span v-if="scope.row.name == '灰阀'">M</span>
            <IconifyIconOffline
              icon="pause-fill"
              v-if="scope.row.name == '水阀'"
            />
            <span v-if="scope.row.name == '水阀'">A</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style lang="scss" scoped>
.flex-around {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
