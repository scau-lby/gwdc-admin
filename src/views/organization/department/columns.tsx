import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    {
      label: "序号",
      type: "index",
      width: 60,
      align: "left",
      fixed: "left",
      hide: ({ checkList }) => !checkList.includes("序号列")
    },
    {
      label: "操作",
      width: 100,
      slot: "operation",
      fixed: "right"
    },
    {
      label: "机构名称",
      prop: "orgName",
      width: 200,
      align: "left"
    },
    {
      label: "当前层级",
      prop: "layer",
      width: 100
    },
    // {
    //   label: "上级机构",
    //   prop: "parentName",
    //   width: 200
    // },
    {
      label: "虚拟机构可查看设备",
      prop: "remark"
    }
  ]);

  return {
    columns
  };
}
