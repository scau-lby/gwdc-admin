<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { getOnlineTruckList } from "/@/api/truck";
import { getPreviewUrlByPlatenums } from "/@/api/video";

// components
// import empty from "/@/views/common/empty.vue";
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
      getPreviewUrlByPlatenums({
        plateNums: val.join(","),
        // plateNums: "Camera 01",
        wellName: task_selected.value.split(" @ ")[0],
        wellType: task_selected.value.split(" @ ")[1]
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
    <div class="source-card">
      <el-card>
        <el-form-item label="施工任务">
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
      </el-card>
      <el-card style="flex-grow: 1">
        <el-form-item label="在线设备">
          <el-checkbox-group v-model="plates_checked">
            <el-checkbox
              v-for="item in plateList"
              :key="item.id"
              :label="item.plateNum"
            />
          </el-checkbox-group>
        </el-form-item>
      </el-card>
    </div>
    <h5Player
      style="width: 100%; height: 75vh; margin-top: 10px"
      :urls="urls"
    />
  </div>
</template>

<style scoped lang="scss">
.source-card {
  display: flex;

  .el-card + .el-card {
    margin-left: 15px;
  }

  ::v-deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 0;
  }
}
</style>
