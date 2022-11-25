<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { getOnlineTruckList } from "/@/api/truck";
import { getpreviewUrlByPlatenums } from "/@/api/video";

// components
import empty from "/@/views/common/empty.vue";
import h5Player from "./components/H5Player.vue";

let onlineList = [], // 在线设备列表
  plateList = ref(null), // 当前选中任务对应的设备列表
  taskList = ref([]), // 任务列表
  task_selected = ref(""), // 当前任务
  plates_checked = ref([]); // 当前选中设备编号数组
const urls = ref([]);

// 获取在线设备列表
async function getOnline() {
  let { data } = await getOnlineTruckList();

  if (data.length > 0) {
    data.forEach(item => {
      const { id, plateNum, equType, wellName, wellType } = item,
        task = `${wellName} @ ${wellType}`;
      if (!taskList.value.includes(task)) taskList.value.push(task);
      onlineList.push({ id, task, plateNum, equType, wellName, wellType });
    });

    task_selected.value = taskList.value[0];
    plateList.value = onlineList.filter(
      item => item.task === task_selected.value
    );
    plateList.value.forEach(item => {
      plates_checked.value.push(item.plateNum);
    });
  }
}

// 切换施工任务
function onTaskChange(val) {
  plateList.value = onlineList.filter(item => item.task === val);
  plates_checked.value = [];
  plateList.value.forEach(item => {
    plates_checked.value.push(item.plateNum);
  });
}

watch(
  () => plates_checked.value,
  val => {
    if (val.length !== 0) {
      getpreviewUrlByPlatenums({
        plateNums: val.join(",")
        // plateNums: "辽LB9595"
      }).then(({ data }) => {
        urls.value = data;
      });
    }
  },
  {
    deep: true,
    immediate: true
  }
);

onMounted(() => {
  getOnline();
});
</script>

<template>
  <div class="main">
    <!-- <template v-if="taskList.length > 0"> -->
    <el-card class="source-card">
      <el-form :inline="true">
        <el-form-item label="数据来源" />
        <el-form-item label="施工任务" style="margin-left: 50px">
          <el-select
            v-model="task_selected"
            placeholder="请选择施工任务"
            @change="onTaskChange"
          >
            <el-option
              v-for="(item, index) in taskList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="在线设备">
          <el-checkbox-group v-model="plates_checked">
            <el-checkbox
              v-for="item in plateList"
              :key="item.id"
              :label="item.plateNum"
            />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-card>
    <h5Player
      style="width: 100%; height: 75vh; margin-top: 10px"
      :urls="urls"
    />
    <!-- </template>
    <el-card v-else>
      <empty title="当前无设备在线" />
    </el-card> -->
  </div>
</template>

<style scoped lang="scss">
.source-card {
  ::v-deep(.el-form-item) {
    margin-right: 40px;
    margin-bottom: 0px;
  }
}
</style>
