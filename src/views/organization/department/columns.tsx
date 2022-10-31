import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    {
      label: "操作",
      width: 180,
      slot: "operation",
      fixed: "right"
    },
    {
      label: "机构名称",
      prop: "orgName",
      align: "left",
      width: 400
    },
    {
      label: "当前层级",
      prop: "layer",
      cellRenderer: ({ row }) => `第 ${row.layer} 级 `
    },
    {
      label: "上级机构",
      slot: "parentName"
    }
  ]);

  return {
    columns
  };
}
