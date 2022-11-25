<script setup lang="ts">
import { onMounted } from "vue";
// store
// import { useHisDataStoreHook } from "/@/store/modules/hisData";
// header
import multiHeader from "/@/components/HisHeader/MultiHeader.vue";
// 合并
// import mixedTable from "/@/components/dataTabel/MixedTable.vue";
// 双机车、双机橇
// import dualTable from "/@/components/dataTabel/DualTable.vue";
// 单机车、单机橇
// import singleTable from "/@/components/dataTabel/SingleTable.vue";

defineOptions({
  name: "HisData"
});

// console.log(useHisDataStoreHook().getMixed);
// console.log(useHisDataStoreHook().getPlateNums);

onMounted(() => {});
</script>
<template>
  <div class="main">
    <multiHeader />
  </div>
</template>

<style scoped lang="scss"></style>
