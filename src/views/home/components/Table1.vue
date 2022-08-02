<script setup lang="ts">
import { PropType, ref, reactive } from "vue";
import { Table1Item } from "./data";
let props = defineProps({
  tableData: {
    type: Array as PropType<Array<Table1Item>>,
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

let dialogFormVisible = ref(false);
const form = reactive({
  wellNum: "高4-10-2H",
  time: "2022-05-22 14:12:23",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: ""
});
const handleSizeChange = () => {};
const handleCurrentChange = () => {};
const onTop = row => {
  console.log("onTop", row);
};
const onToggle = row => {
  console.log("onToggle", row);
};
const onPush = row => {
  console.log("onPush", row);
};
const onDetail = row => {
  dialogFormVisible.value = true;
  console.log(row, dialogFormVisible);
};
</script>

<template>
  <el-dialog
    v-model="dialogFormVisible"
    title="井队作业关键参数"
    draggable
    center
    :modal="false"
    custom-class="dialog-detail"
  >
    <div class="header">
      <div class="header-item">
        <div class="header-label">井号</div>
        <div class="header-content">
          {{ form.wellNum }}
        </div>
      </div>
      <div class="header-item">
        <div class="header-label">时间</div>
        <div class="header-content">
          {{ form.time }}
        </div>
      </div>
    </div>
    <div class="body">
      <div class="body-item">
        <div class="body-label">实测井深</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">m</div>
      </div>
      <div class="body-item">
        <div class="body-label">入口流量</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">l/s</div>
      </div>
      <div class="body-item">
        <div class="body-label">大钩负荷</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">KN</div>
      </div>
      <div class="body-item">
        <div class="body-label">钻头参数</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">m</div>
      </div>
      <div class="body-item">
        <div class="body-label">出口流量</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">%</div>
      </div>
      <div class="body-item">
        <div class="body-label">大钩位置</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">m</div>
      </div>
      <div class="body-item">
        <div class="body-label">钻压</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">MPa</div>
      </div>
      <div class="body-item">
        <div class="body-label">入口密度</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">g/cm³</div>
      </div>
      <div class="body-item">
        <div class="body-label">转速</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">rpm</div>
      </div>
      <div class="body-item">
        <div class="body-label">泵压</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">MPa</div>
      </div>
      <div class="body-item">
        <div class="body-label">出口密度</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">g/cm³</div>
      </div>
      <div class="body-item">
        <div class="body-label">泵冲1</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">spm</div>
      </div>
      <div class="body-item">
        <div class="body-label">泵冲2</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">spm</div>
      </div>
      <div class="body-item">
        <div class="body-label">泵冲3</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">spm</div>
      </div>
      <div class="body-item">
        <div class="body-label">总体积</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">m³</div>
      </div>
      <div class="body-item">
        <div class="body-label">总池增减体积</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">spm</div>
      </div>
      <div class="body-item">
        <div class="body-label">总烃</div>
        <div class="body-content">{{}}</div>
        <div class="body-extra">%</div>
      </div>
      <div class="body-item" />
    </div>
  </el-dialog>
  <el-table
    :data="props.tableData"
    style="width: 100%; margin-top: 20px"
    :header-cell-style="{
      backgroundColor: 'rgba(0,21,41,.7)',
      color: '#d0d0d0'
    }"
    :max-height="300"
  >
    <el-table-column label="操作" width="210" align="center" fixed>
      <template #default="scope">
        <IconifyIconOffline
          :icon="scope.row.show ? 'heart-fill' : 'heart-line'"
          @click="onTop"
          :color="scope.row.show ? '#E5404F' : ''"
          style="display: inline-block; margin-right: 10px; font-size: 20px"
        />
        <el-button size="small" @click="onToggle(scope.row)">
          取消显示
        </el-button>
        <el-button size="small" @click="onPush(scope.row)">
          数据推送
        </el-button>
      </template>
    </el-table-column>
    <el-table-column label="序号" width="60" align="center" type="index" />
    <el-table-column label="作业单位" align="center" prop="address" />
    <el-table-column label="钻井公司" align="center" prop="company" />
    <el-table-column label="钻井队号" align="center" prop="" />
    <el-table-column label="井号" align="center" prop="wellNum" />
    <el-table-column label="固井类型" align="center" prop="type" />
    <el-table-column label="固井级别" align="center" prop="" />
    <el-table-column label="当前进度" align="center" prop="" />
    <el-table-column label="作业设备" align="center" prop="truckPlate" />
    <el-table-column label="施工指挥" align="center" prop="" />
    <el-table-column label="操作人员" align="center" prop="operator" />
    <el-table-column
      label="井队作业关键参数"
      width="100"
      align="center"
      fixed="right"
    >
      <template #default="scope">
        <el-button size="small" @click="onDetail(scope.row)">
          了解详情
        </el-button>
      </template>
    </el-table-column>
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

<style scoped lang="scss">
.dialog-detail {
  background-color: #000;
}

::v-deep(.el-dialog__header) {
  background-color: rgba(0, 0, 0, 0.5) !important;
}

.body {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;

  .body-item {
    width: 30%;
    height: 30px;
    line-height: 30px;
    margin: 5px 0;
    display: flex;
    justify-content: space-between;

    .body-label {
      width: 35%;
    }

    .body-content {
      width: 50%;
      border: 1px solid #ccc;
    }

    .body-extra {
      width: 15%;
      padding-left: 5px;
    }
  }
}
</style>
