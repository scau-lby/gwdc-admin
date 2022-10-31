<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  type: {
    type: Number,
    default: 0
  },
  header: {
    type: String,
    default: ""
  },
  footer: {
    type: String,
    default: ""
  },
  labels: {
    type: Array,
    default: () => []
  },
  subs: {
    type: Array,
    default: () => []
  },
  formData: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const type = ref(props.type);
watch(
  () => props.type,
  val => {
    type.value = val;
  }
);

const header = ref(props.header);
watch(
  () => props.header,
  val => {
    header.value = val;
  }
);

const footer = ref(props.footer);
watch(
  () => props.footer,
  val => {
    footer.value = val;
  }
);

const labels = ref(props.labels);
watch(
  () => props.labels,
  val => {
    labels.value = val;
  },
  {
    deep: true,
    immediate: true
  }
);

const subs = ref(props.subs);
watch(
  () => props.subs,
  val => {
    subs.value = val;
  },
  {
    deep: true,
    immediate: true
  }
);

const formData = ref(props.formData);
watch(
  () => props.formData,
  val => {
    formData.value = val;
  },
  {
    deep: true,
    immediate: true
  }
);
</script>

<template>
  <!-- 表单内容 -->
  <div class="mc-board">
    <div class="mc-header">
      <div class="circle">
        <div :class="[type === 1 ? 'green twinkling' : 'red']" class="round" />
      </div>
      <div class="mc-content">{{ header }}</div>
    </div>
    <div class="mc-body">
      <div class="mc-card" v-for="(item, index) in formData" :key="index">
        <div class="mc-main">{{ item }}</div>
        <div class="mc-sub">{{ subs[index] }}</div>
        <div class="mc-label">{{ labels[index] }}</div>
      </div>
    </div>
    <div class="mc-footer">{{ footer }}</div>
  </div>
</template>

<style scoped lang="scss">
.mc-board {
  background-color: #3771b1;
}

.mc-header {
  display: flex;
  flex-direction: row;
  padding: 5px;
  height: 30px;
  line-height: 30px;
  color: #fff;
}

.circle {
  width: 15px;
  height: 15px;
  border: 1px solid #fff;
  border-radius: 50%;
  margin: 7.5px;
  padding: 2px;
}

.round {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.green {
  background-color: #0f0;
}

.red {
  background-color: #f00;
}

.twinkling {
  animation: twinkling 800ms infinite;
}

@keyframes twinkling {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  to {
    opacity: 1;
  }
}

.mc-body {
  padding: 15px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
}

.mc-card {
  border-radius: 6px;
  width: 12%;
  overflow: hidden;
  text-align: center;
  margin: 0 8px 10px;
}

.mc-card:last-child:nth-child(7n - 2) {
  margin-right: calc(24% + 11% / 2);
}

.mc-card:last-child:nth-child(7n - 6) {
  margin-right: calc(72% + 28% / 2);
}

.mc-main,
.mc-sub {
  background-color: #fff;
}

.mc-main {
  color: #727272;
  height: 35px;
  line-height: 35px;
  font-size: 1.4rem;
}

.mc-sub {
  color: #909090;
  text-align: right;
  padding-right: 10px;
  height: 16px;
  line-height: 16px;
  font-size: 0.8rem;
}

.mc-label {
  background-color: #727272;
  color: #fff;
  height: 30px;
  line-height: 30px;
}

.mc-footer {
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #fff;
  background-color: #000;
}
</style>
