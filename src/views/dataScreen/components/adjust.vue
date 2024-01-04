<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";

interface TableColumn {
  name: string;
  jcz: string;
  sjz: string;
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
    tableData.value = val;
  },
  { deep: true }
);

const inputRef: any = ref(null);
const tableRowEditIndex = ref(null), // 正在编辑的行
  tableColumnEditIndex = ref(null); // 正在编辑的列

const dbClickCell = (scope: any) => {
  tableRowEditIndex.value = scope.$index;
  tableColumnEditIndex.value = scope.column.id;
  nextTick(() => {
    inputRef.value.focus();
  });
};

const onInputBlur = (scope: any) => {
  tableRowEditIndex.value = null;
  tableColumnEditIndex.value = null;
  // const id = scope.row.id;
  const key = scope.column.property;
  const value = scope.row[key];
  console.log(key, value);
  // 更新给后端的数据接口
  // 提交数据........
};

function onAdd(row) {
  console.log(row);
}

function onSub(row) {
  console.log(row);
}
</script>
<template>
  <div style="width: 100%">
    <h5 style="text-align: center; line-height: 40px; font-size: 16px">
      作业参数调整
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
      <el-table-column prop="name" label="项目" width="110" />
      <el-table-column prop="jcz" label="监测值" />
      <el-table-column prop="sjz" label="设计值">
        <template #default="scope">
          <!-- 判断为编辑状态 -->
          <el-input
            v-if="
              tableRowEditIndex === scope.$index &&
              tableColumnEditIndex == scope.column.id
            "
            ref="inputRef"
            v-model="scope.row.sjz"
            @keyup.enter="
              $event => {
                $event.target.blur();
              }
            "
            @blur="onInputBlur(scope)"
          />
          <!-- 判断为显示状态 -->
          <p v-else class="eidt-row-p" @dblclick="dbClickCell(scope)">
            {{ scope.row.sjz }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="调整" align="center" width="60">
        <template #default="scope">
          <div class="flex-around">
            <IconifyIconOffline icon="caret-top" @click="onAdd(scope.row)" />
            <IconifyIconOffline icon="caret-bottom" @click="onSub(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style lang="scss" scoped>
.eidt-row-p {
  width: 100%;
  height: 32px;
  line-height: 32px;
  text-align: center;
  margin: 0;
}

:deep(.el-table) {
  --el-table-border-color: #595959;
  --el-table-row-hover-bg-color: transparent;
  background-color: transparent !important;
  border-color: #595959 !important;
}

:deep(.el-table__expanded-cell) {
  background-color: transparent !important;
}

:deep(.el-table tr, .el-table td) {
  background: transparent !important;
  color: #ffffff;
}

.flex-around {
  display: flex;
  justify-content: space-around;
}
</style>
