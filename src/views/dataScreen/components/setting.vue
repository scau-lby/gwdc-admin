<script lang="ts" setup>
import { ref, PropType, watch } from "vue";

interface DataColumn {
  name: string;
  color: string;
}

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  data: {
    type: Array as PropType<DataColumn[]>,
    default: () => {
      return [];
    }
  },
  checked: {
    type: Array,
    default: () => {
      return [];
    }
  }
});
const index = ref(props.index);
watch(
  () => props.index,
  val => {
    if (val) {
      index.value = val;
    }
  }
);
const legend_data = ref(props.data);
watch(
  () => props.data,
  val => {
    if (val) {
      legend_data.value = val;
    }
  },
  { deep: true }
);
const checked = ref(props.checked);
watch(
  () => props.checked,
  val => {
    if (val) {
      checked.value = val;
    }
  },
  { deep: true }
);
const emit = defineEmits(["change"]);
function onCheckedChange(e) {
  emit("change", [1, [index.value, e]]); // index.value 定义settingComp
}
function onColorChange(color, index) {
  legend_data.value[index].color = color;
  emit("change", [2, [index, color]]); // index 定义legend_data 的第几个参数
}
</script>
<template>
  <el-popover placement="right" :width="200" trigger="click">
    <template #reference>
      <div class="setting">显示设置</div>
    </template>
    <el-checkbox-group v-model="checked" @change="onCheckedChange" :max="5">
      <div v-for="(item, index) in legend_data" :key="item.name">
        <el-checkbox :label="item.name" />
        <el-color-picker
          v-model="item.color"
          size="small"
          :teleported="false"
          @change="onColorChange($event, index)"
        />
        <br />
      </div>
    </el-checkbox-group>
  </el-popover>
</template>
<style lang="scss" scoped>
.setting {
  border: 1px solid #ffffff;
  border-radius: 35px;
  padding: 0 10px;
  margin: 7.5px 0;
  line-height: 20px;
  color: #ffffff;
  font-size: 0.6rem;
  cursor: pointer;
  float: right;
}
</style>
