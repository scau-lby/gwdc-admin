<script setup lang="ts">
import { onMounted, ref } from "vue";

// store
import { useHisDataStoreHook } from "/@/store/modules/hisData";
// api
import { getHistoryWell, getHistoryList } from "/@/api/history";

defineOptions({
  name: "multiHeader"
});

let wellName = "",
  wellType = "",
  task = ref(""),
  plateList = ref([]), // 当前选中任务对应的设备列表
  plates_checked = ref([]), // 当前选中设备编号数组
  mixed = ref(0); // 0 单机 1 合并

function onPlateChange(value) {
  useHisDataStoreHook().SET_PLATENUMS(value);
}

// 切换订阅方式
function onMixedChange(value) {
  useHisDataStoreHook().SET_MIXED(value);
}

async function getPlateList() {
  let { data } = await getHistoryWell({
    wellName,
    wellType
  });
  plateList.value = data;
  plates_checked.value = [data[0].plateNum];
}

onMounted(() => {
  wellName = useHisDataStoreHook().getWellName;
  wellType = useHisDataStoreHook().getWellType;
  if (!wellName || !wellType) {
    getHistoryList({
      pageNum: 1,
      pageSize: 1
    }).then(({ data }) => {
      const records = data.records;
      useHisDataStoreHook().SET_WELLNAME(records[0].wellName);
      useHisDataStoreHook().SET_WELLTYPE(records[0].wellType);
      wellName = records[0].wellName;
      wellType = records[0].wellType;
      task.value = wellName + " @ " + wellType;
      getPlateList();
    });
  } else {
    task.value = wellName + " @ " + wellType;
    getPlateList();
  }
});
</script>
<template>
  <div class="source-card">
    <el-card header="施工任务" :body-style="{ padding: '10px' }">
      <el-input v-model="task" readonly />
    </el-card>
    <el-card header="订阅方式" :body-style="{ padding: '10px' }">
      <el-form-item>
        <el-radio-group v-model="mixed" @change="onMixedChange">
          <el-radio :label="0">单机</el-radio>
          <el-radio :label="1" v-if="plateList.length > 1"> 合并 </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-card>
    <el-card header="设备编号" :body-style="{ padding: '10px' }">
      <el-form-item>
        <el-checkbox-group v-model="plates_checked" @change="onPlateChange">
          <el-checkbox
            v-for="item in plateList"
            :key="item.id"
            :label="item.plateNum"
          />
        </el-checkbox-group>
      </el-form-item>
    </el-card>
    <el-card style="flex-grow: 1" :body-style="{ padding: '10px' }" />
  </div>
</template>

<style scoped lang="scss">
.source-card {
  display: flex;

  .el-card + .el-card {
    margin-left: 15px;
  }

  ::v-deep(.el-card__header) {
    text-align: center;
    padding: 10px 10px 0;
    border-bottom: none;
    font-weight: 600;
  }

  ::v-deep(.el-form-item) {
    margin-bottom: 0px;
  }

  ::v-deep(.el-input__inner) {
    text-align: center;
  }
}
</style>
