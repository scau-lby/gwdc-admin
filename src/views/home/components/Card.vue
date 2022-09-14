<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  icon: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  },
  data: {
    type: Number,
    default: 0
  }
});
const icon = ref(props.icon);
watch(
  () => props.icon,
  val => {
    icon.value = val;
  }
);
const title = ref(props.title);
watch(
  () => props.title,
  val => {
    title.value = val;
  }
);
const data = ref(props.data);
watch(
  () => props.data,
  val => {
    data.value = val;
  }
);
</script>

<template>
  <el-card class="box-card">
    <div class="box-icon">
      <img :src="icon" alt="" />
    </div>
    <div class="box-main">
      <p class="box-title">{{ title }}</p>
      <p class="box-content">
        <span class="text-danger">{{ data }}</span> 台
      </p>
    </div>
  </el-card>
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
