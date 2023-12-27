<script lang="ts" setup>
import { ref, nextTick } from "vue";
const inputRef: any = ref(null);
const tableData = ref([
  {
    md: 1.45,
    yw: "35%",
    sfkd: "30%",
    hfkd: "25%"
  }
]);
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
</script>
<template>
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
    <el-table-column label="预混密度" prop="md" align="center">
      <template #default="scope">
        <!-- 判断为编辑状态 -->
        <el-input
          v-if="
            tableRowEditIndex === scope.$index &&
            tableColumnEditIndex == scope.column.id
          "
          ref="inputRef"
          v-model="scope.row.md"
          @keyup.enter="
            $event => {
              $event.target.blur();
            }
          "
          @blur="onInputBlur(scope)"
        />
        <!-- 判断为显示状态 -->
        <p v-else class="eidt-row-p" @dblclick="dbClickCell(scope)">
          {{ scope.row.md }}
        </p>
      </template>
    </el-table-column>
    <el-table-column label="预混液位" prop="yw" align="center" width="105">
      <template #default="scope">
        <!-- 判断为编辑状态 -->
        <el-input
          v-if="
            tableRowEditIndex === scope.$index &&
            tableColumnEditIndex == scope.column.id
          "
          ref="inputRef"
          v-model="scope.row.yw"
          @keyup.enter="
            $event => {
              $event.target.blur();
            }
          "
          @blur="onInputBlur(scope)"
        />
        <!-- 判断为显示状态 -->
        <p v-else class="eidt-row-p" @dblclick="dbClickCell(scope)">
          {{ scope.row.yw }}
        </p>
      </template>
    </el-table-column>
    <el-table-column label="水阀开度" prop="sfkd" align="center" width="105">
      <template #default="scope">
        <!-- 判断为编辑状态 -->
        <el-input
          v-if="
            tableRowEditIndex === scope.$index &&
            tableColumnEditIndex == scope.column.id
          "
          ref="inputRef"
          v-model="scope.row.sfkd"
          @keyup.enter="
            $event => {
              $event.target.blur();
            }
          "
          @blur="onInputBlur(scope)"
        />
        <!-- 判断为显示状态 -->
        <p v-else class="eidt-row-p" @dblclick="dbClickCell(scope)">
          {{ scope.row.sfkd }}
        </p>
      </template>
    </el-table-column>
    <el-table-column label="灰阀开度" prop="hfkd" align="center" width="105">
      <template #default="scope">
        <!-- 判断为编辑状态 -->
        <el-input
          v-if="
            tableRowEditIndex === scope.$index &&
            tableColumnEditIndex == scope.column.id
          "
          ref="inputRef"
          v-model="scope.row.hfkd"
          @keyup.enter="
            $event => {
              $event.target.blur();
            }
          "
          @blur="onInputBlur(scope)"
        />
        <!-- 判断为显示状态 -->
        <p v-else class="eidt-row-p" @dblclick="dbClickCell(scope)">
          {{ scope.row.hfkd }}
        </p>
      </template>
    </el-table-column>
  </el-table>
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
</style>
