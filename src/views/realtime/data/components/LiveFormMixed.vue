<script setup lang="ts">
import { ref, watch, defineEmits } from "vue";

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  formData: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const index = ref(props.index);
watch(
  () => props.index,
  val => {
    index.value = val;
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

const emit = defineEmits(["type"]);

function emitType(val) {
  legend_selected.value[val] = !legend_selected.value[val];
  emit("type", {
    type: val,
    idx: index.value
  });
}

const legend_selected = ref({
  混浆密度: true,
  施工压力: true,
  合并瞬时排量: true,
  泵替瞬时流量: true,
  合并累计排量: true,
  泵替累计流量: true
});
</script>

<template>
  <!-- 表单内容 -->
  <el-form
    :key="index"
    :model="formData"
    label-width="130px"
    label-position="left"
  >
    <el-form-item>
      <template #label>
        <span
          :style="{
            color: legend_selected['混浆密度'] ? '#5470c6' : '#9e9e9e'
          }"
          @click="emitType('混浆密度')"
        >
          混浆密度
        </span>
      </template>
      <el-input v-model="formData.md" readonly />
    </el-form-item>
    <el-divider />
    <el-form-item>
      <template #label>
        <span
          :style="{
            color: legend_selected['施工压力'] ? '#91cc75' : '#9e9e9e'
          }"
          @click="emitType('施工压力')"
        >
          施工压力
        </span>
      </template>
      <el-input v-model="formData.Abyl" readonly />
    </el-form-item>
    <el-divider />
    <el-form-item>
      <template #label>
        <span
          :style="{
            color: legend_selected['合并瞬时排量'] ? '#fac858' : '#9e9e9e'
          }"
          @click="emitType('合并瞬时排量')"
        >
          合并瞬时排量
        </span>
      </template>
      <el-input v-model="formData.Zssll" readonly />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span
          :style="{
            color: legend_selected['泵替瞬时流量'] ? '#ee6666' : '#9e9e9e'
          }"
          @click="emitType('泵替瞬时流量')"
        >
          泵替瞬时流量
        </span>
      </template>
      <el-input v-model="formData.BbDcll" readonly />
    </el-form-item>
    <el-divider />
    <el-form-item>
      <template #label>
        <span
          :style="{
            color: legend_selected['合并累计排量'] ? '#fac858' : '#9e9e9e'
          }"
          @click="emitType('合并累计排量')"
        >
          合并累计排量
        </span>
      </template>
      <el-input v-model="formData.Zlj" readonly />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span
          :style="{
            color: legend_selected['泵替累计流量'] ? '#ee6666' : '#9e9e9e'
          }"
          @click="emitType('泵替累计流量')"
        >
          泵替累计流量
        </span>
      </template>
      <el-input v-model="formData.AbDclllj" readonly />
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
::v-deep(.el-form-item__label) {
  cursor: pointer;
}
</style>
