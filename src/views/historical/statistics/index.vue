<script setup lang="ts">
import { onMounted, ref } from "vue";
// header
import multiHeader from "/@/components/HisHeader/MultiHeader.vue";
// 合并
import mixedForm from "/@/components/dataForm/MixedForm.vue";
import mixedLine from "/@/components/dataLine/MixedLine.vue";
// 双机车、双机橇
import dualForm from "/@/components/dataForm/DualForm.vue";
import dualLine from "/@/components/dataLine/DualLine.vue";
// 单机车、单机橇
import singleForm from "/@/components/dataForm/SingleForm.vue";
import singleLine from "/@/components/dataLine/SingleLine.vue";
defineOptions({
  name: "HisStatistics"
});
const chartRef = ref(null);

onMounted(() => {});
</script>
<template>
  <div class="main">
    <multiHeader />

    <div class="live-container" style="margin-top: 10px" v-if="mixed === 1">
      <el-card
        class="live-line"
        :header="task_selected + ' / 作业实时曲线(' + keys + ')'"
      >
        <mixedLine
          ref="chartRef"
          :index="100"
          :plateNum="msgData[0].plateNum"
          :wellName="msgData[0].wellName"
          :wellType="msgData[0].wellType"
          :data="msgData[0].detail"
        />
      </el-card>
      <el-card
        class="live-form"
        :header="task_selected + ' / 作业实时数据(' + keys + ')'"
      >
        <mixedForm :formData="msgData[0].detail" :index="100" @type="getType" />
      </el-card>
    </div>
    <div
      style="margin-top: 10px; display: flex; justify-content: space-between"
      v-else
    >
      <div
        v-for="(item, index) in keys"
        :key="item"
        class="live-container"
        :style="{ width: keys.length > 1 ? '49.8%' : '100%' }"
      >
        <template
          v-if="
            msgData[index].equType === '单机橇' ||
            msgData[index].equType === '单机车'
          "
        >
          <el-card
            class="live-line"
            :header="task_selected + ' / ' + keys[index] + ' - 作业实时曲线'"
            style="width: 100%"
          >
            <singleLine
              ref="chartRef"
              :data="msgData[index].detail"
              :index="index"
              :plateNum="msgData[index].plateNum"
              :wellName="msgData[index].wellName"
              :wellType="msgData[index].wellType"
              :key="msgData[index].plateNum + timer"
            />
          </el-card>
          <el-card
            class="live-form"
            :header="task_selected + ' / ' + keys[index] + ' - 作业实时数据'"
          >
            <singleForm
              :formData="msgData[index].detail"
              :index="index"
              :key="msgData[index].plateNum + timer"
              @type="getType"
            />
          </el-card>
        </template>
        <template v-else>
          <el-card
            class="live-line"
            :header="task_selected + ' / ' + keys[index] + ' - 作业实时曲线'"
            style="width: 100%"
          >
            <dualLine
              ref="chartRef"
              :data="msgData[index].detail"
              :index="index"
              :plateNum="msgData[index].plateNum"
              :wellName="msgData[index].wellName"
              :wellType="msgData[index].wellType"
              :key="msgData[index].plateNum + timer"
            />
          </el-card>
          <el-card
            class="live-form"
            :header="task_selected + ' / ' + keys[index] + ' - 作业实时数据'"
          >
            <dualForm
              :formData="msgData[index].detail"
              :index="index"
              :key="msgData[index].plateNum + timer"
              @type="getType"
            />
          </el-card>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.live-form {
  min-width: 260px;
  max-width: 260px;
  margin-left: 10px;

  ::v-deep(.el-form-item) {
    margin-bottom: 0px;
  }
}

.live-container {
  display: flex !important;
  flex-direction: row;
}

.live-line {
  width: calc(100% - 270px);
}
</style>
