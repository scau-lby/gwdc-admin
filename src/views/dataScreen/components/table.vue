<script lang="ts" setup>
import { ref, PropType, watch } from "vue";

interface TableColumn {
  label: string;
  key: string;
  show: boolean;
  color: string;
  value: Number;
}

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  data: {
    type: Array as PropType<TableColumn[]>,
    default: () => {
      return [];
    }
  }
});
const tableData = ref(props.data);
watch(
  () => props.data,
  val => {
    if (val) {
      tableData.value = val;
    }
  },
  { deep: true }
);
</script>
<template>
  <table style="width: 100%">
    <tr>
      <td
        v-for="item in tableData"
        :key="item.key"
        v-show="item.show"
        :style="{ color: item.color }"
      >
        {{ item.label }}
      </td>
    </tr>
    <tr style="background: #666666">
      <td
        v-for="item in tableData"
        :key="item.key"
        v-show="item.show"
        :style="{ color: item.color }"
      >
        {{ item.value }}
      </td>
    </tr>
  </table>
</template>
<style lang="scss" scoped>
td {
  text-align: center;
}
</style>
