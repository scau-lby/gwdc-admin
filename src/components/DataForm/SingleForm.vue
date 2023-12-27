<script setup lang="ts">
import { ref, watch } from "vue";

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

const initialData = {
  time: "",
  md: "",
  abyl: "",
  abll: "",
  qsll: "",
  abdcll: "",
  ablj: "",
  qslj: "",
  abdclllj: ""
};

const formData = ref(initialData);
watch(
  () => props.formData,
  val => {
    if (val !== null) {
      formData.value = val;
    }
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
  A泵压力: true,
  A泵瞬时排量: true,
  清水瞬时流量: true,
  A泵泵替瞬时排量: true,
  A泵累计排量: true,
  清水累计排量: true,
  A泵泵替累计流量: true
});
</script>

<template>
  <!-- 表单内容 -->
  <el-form :model="formData" label-width="130px" label-position="left">
    <el-space direction="vertical" :size="10">
      <div>
        <el-form-item label="时间">
          <el-input v-model="formData.time" readonly />
        </el-form-item>
      </div>
      <div>
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
      </div>
      <div>
        <el-form-item>
          <template #label>
            <span
              :style="{
                color: legend_selected['A泵压力'] ? '#91cc75' : '#9e9e9e'
              }"
              @click="emitType('A泵压力')"
            >
              A泵压力
            </span>
          </template>
          <el-input v-model="formData.abyl" readonly />
        </el-form-item>
      </div>
      <div>
        <el-form-item>
          <template #label>
            <span
              :style="{
                color: legend_selected['A泵瞬时排量'] ? '#ee6666' : '#9e9e9e'
              }"
              @click="emitType('A泵瞬时排量')"
            >
              A泵瞬时排量
            </span>
          </template>
          <el-input v-model="formData.abll" readonly />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span
              :style="{
                color: legend_selected['清水瞬时流量'] ? '#fac858' : '#9e9e9e'
              }"
              @click="emitType('清水瞬时流量')"
            >
              清水瞬时流量
            </span>
          </template>
          <el-input v-model="formData.qsll" readonly />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span
              :style="{
                color: legend_selected['A泵泵替瞬时排量']
                  ? '#9a60b4'
                  : '#9e9e9e'
              }"
              @click="emitType('A泵泵替瞬时排量')"
            >
              A泵泵替瞬时排量
            </span>
          </template>
          <el-input v-model="formData.abdcll" readonly />
        </el-form-item>
      </div>
      <div>
        <el-form-item>
          <template #label>
            <span
              :style="{
                color: legend_selected['A泵累计排量'] ? '#ee6666' : '#9e9e9e'
              }"
              @click="emitType('A泵累计排量')"
            >
              A泵累计排量
            </span>
          </template>
          <el-input v-model="formData.ablj" readonly />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span
              :style="{
                color: legend_selected['清水累计排量'] ? '#fac858' : '#9e9e9e'
              }"
              @click="emitType('清水累计排量')"
            >
              清水累计排量
            </span>
          </template>
          <el-input v-model="formData.qslj" readonly />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span
              :style="{
                color: legend_selected['A泵泵替累计流量']
                  ? '#9a60b4'
                  : '#9e9e9e'
              }"
              @click="emitType('A泵泵替累计流量')"
            >
              A泵泵替累计流量
            </span>
          </template>
          <el-input v-model="formData.abdclllj" readonly />
        </el-form-item>
      </div>
    </el-space>
  </el-form>
</template>

<style scoped lang="scss">
::v-deep(.el-form-item__label) {
  cursor: pointer;
  width: 150px;
}
</style>
