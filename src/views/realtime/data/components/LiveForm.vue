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
  emit("type", {
    type: val,
    idx: index.value
  });
}
</script>

<template>
  <!-- 表单内容 -->

  <el-form :model="formData" label-width="130px" label-position="left">
    <el-form-item>
      <template #label>
        <span style="color: #5470c6" @click="emitType('密度')">混浆密度</span>
      </template>
      <el-input v-model="formData.md" />
    </el-form-item>
    <el-divider />
    <el-form-item>
      <template #label>
        <span style="color: #91cc75" @click="emitType('A泵压力')">A泵压力</span>
      </template>
      <el-input v-model="formData.Abyl" />
    </el-form-item>
    <el-form-item label="B泵压力">
      <template #label>
        <span style="color: #fac858" @click="emitType('B泵压力')">B泵压力</span>
      </template>
      <el-input v-model="formData.Bbyl" />
    </el-form-item>
    <el-divider />
    <el-form-item>
      <template #label>
        <span style="color: #ee6666" @click="emitType('A泵瞬时流量')">
          A泵瞬时流量
        </span>
      </template>
      <el-input v-model="formData.Abll" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span style="color: #73c0de" @click="emitType('B泵瞬时流量')">
          B泵瞬时流量
        </span>
      </template>
      <el-input v-model="formData.Bbll" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span style="color: #3ba272" @click="emitType('双泵瞬时流量')">
          双泵瞬时流量
        </span>
      </template>
      <el-input v-model="formData.Zssll" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span style="color: #fc8452" @click="emitType('清水瞬时流量')">
          清水瞬时流量
        </span>
      </template>
      <el-input v-model="formData.Qsll" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span style="color: #9a60b4" @click="emitType('A泵泵替瞬时流量')">
          A泵泵替瞬时流量
        </span>
      </template>
      <el-input v-model="formData.AbDcll" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span style="color: #ea7ccc" @click="emitType('B泵泵替瞬时流量')">
          B泵泵替瞬时流量
        </span>
      </template>
      <el-input v-model="formData.BbDcll" />
    </el-form-item>
    <el-divider />
    <el-form-item>
      <template #label>
        <span style="color: #b5954a" @click="emitType('A泵累计排量')">
          A泵累计排量
        </span>
      </template>
      <el-input v-model="formData.Ablj" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span style="color: #1c707a" @click="emitType('B泵累计排量')">
          B泵累计排量
        </span>
      </template>
      <el-input v-model="formData.Bblj" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span style="color: #a21bf4" @click="emitType('双泵累计排量')">
          双泵累计排量
        </span>
      </template>
      <el-input v-model="formData.Zlj" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span style="color: #e56f18" @click="emitType('清水累计排量')">
          清水累计排量
        </span>
      </template>
      <el-input v-model="formData.Qslj" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span style="color: #37ca84" @click="emitType('A泵泵替累计流量')">
          A泵泵替累计流量
        </span>
      </template>
      <el-input v-model="formData.AbDclllj" />
    </el-form-item>
    <el-form-item>
      <template #label>
        <span style="color: #0c3433" @click="emitType('B泵泵替累计流量')">
          B泵泵替累计流量
        </span>
      </template>
      <el-input v-model="formData.BbDclllj" />
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
::v-deep(.el-form-item__label) {
  cursor: pointer;
}
</style>
