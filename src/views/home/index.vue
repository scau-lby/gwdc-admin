<script lang="ts" setup>
import { getPreview } from "/@/api/truck";

import WellTable from "./components/wellTable/index.vue";
import OnlineTable from "./components/onlineTable/index.vue";
import { HCard, HPie, HBar } from "./components";
import { onMounted, ref } from "vue";

import monitor from "/@/assets/home/monitor.png";
import sensor from "/@/assets/home/sensor.png";
import online from "/@/assets/home/online.png";
import deactivate from "/@/assets/home/deactivate.png";

defineOptions({
  name: "Home"
});

let translateDataInstall = ref(0),
  videoDepInstall = ref(0),
  onlineCount = ref(0),
  stopUsedCount = ref(0),
  pieLegend = ref([]),
  pieData = ref([]);

async function getPreviewData() {
  const { data } = await getPreview(0);
  translateDataInstall.value = data.translateDataInstall;
  videoDepInstall.value = data.videoDepInstall;
  onlineCount.value = data.onlineCount;
  stopUsedCount.value = data.stopUsedCount;
  const keys = Object.keys(data.distData);
  pieLegend.value = keys;
  pieData.value = [];
  pieData.value.push(["product", "数据传输", "视频传输"]);

  keys.forEach(item => {
    pieData.value.push([item, data.distData[item], data.distVideo[item]]);
  });
}

onMounted(() => {
  getPreviewData();
});
</script>

<template>
  <div class="main">
    <el-row :gutter="20" v-auth="'88'">
      <el-col :span="6">
        <HCard
          :icon="monitor"
          title="数据传输装置安装"
          :data="translateDataInstall"
        />
      </el-col>
      <el-col :span="6">
        <HCard
          :icon="sensor"
          title="视频传输装置安装"
          :data="videoDepInstall"
        />
      </el-col>
      <el-col :span="6">
        <HCard :icon="online" title="当前在线设备数量" :data="onlineCount" />
      </el-col>
      <el-col :span="6">
        <HCard
          :icon="deactivate"
          title="当前停用设备数量"
          :data="stopUsedCount"
        />
      </el-col>
    </el-row>
    <!-- 口井 -->
    <WellTable style="margin-top: 10px" v-auth="'91'" />
    <!-- 在线设备 -->
    <OnlineTable style="margin-top: 10px" v-auth="'87'" />
    <el-row :gutter="20" style="margin-top: 10px" v-auth="'88'">
      <el-col :span="12">
        <el-card>
          <HPie :pieLegend="pieLegend" :pieData="pieData" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <HBar />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
