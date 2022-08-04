import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: ({ checkList }) => !checkList.includes("序号列")
    },
    {
      label: "用户组名称",
      prop: "GroupName",
      width: 200
    },
    {
      label: "用户组权限描述",
      prop: "Note"
    },
    {
      label: "操作",
      width: 150,
      slot: "operation",
      fixed: "left"
    }
  ]);

  return {
    columns
  };
}
