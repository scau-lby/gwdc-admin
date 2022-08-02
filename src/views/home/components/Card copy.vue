<script setup lang="ts">
import monitor from "/@/assets/home/monitor.png";
import sensor from "/@/assets/home/sensor.png";
import online from "/@/assets/home/online.png";
import deactivate from "/@/assets/home/deactivate.png";
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card class="box-card">
        <div class="box-icon">
          <img :src="monitor" alt="" />
        </div>

        <div class="box-main">
          <p class="box-title">数据传输装置安装</p>
          <p class="box-content">
            <span class="text-danger">{{ 52 }}</span> 台
          </p>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="box-card">
        <div class="box-icon">
          <img :src="sensor" alt="" />
        </div>
        <div class="box-main">
          <p class="box-title">视频传输装置安装</p>
          <p class="box-content">
            <span class="text-danger">{{ 11 }}</span> 台
          </p>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="box-card">
        <div class="box-icon">
          <img :src="online" alt="" />
        </div>
        <div class="box-main">
          <p class="box-title">当前在线设备数量</p>
          <p class="box-content">
            <span class="text-danger">{{ 4 }}</span> 台
          </p>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="box-card">
        <div class="box-icon">
          <img :src="deactivate" alt="" />
        </div>
        <div class="box-main">
          <p class="box-title">当前停用设备数量</p>
          <p class="box-content">
            <span class="text-danger">{{ 0 }}</span> 台
          </p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.box-card {
  ::v-deep(.el-card__body) {
    display: flex;
  }

  .box-icon {
    width: 80px;
    height: 80px;
    border-radius: 80px;
    border: 1px solid #204bad;
    padding: 10px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .box-main {
    width: calc(100% - 100px);
    text-align: center;
  }

  .box-title {
    line-height: 30px;
  }
}

.text-danger {
  color: #ca4b00;
  font-size: 1.8rem;
  font-weight: 700;
}
</style>
