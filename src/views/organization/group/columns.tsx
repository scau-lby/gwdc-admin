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
      prop: "groupName",
      width: 200
    },
    {
      label: "用户组权限描述",
      prop: "note"
    },
    {
      label: "操作",
      width: 120,
      slot: "operation",
      fixed: "left"
    }
  ]);

  return {
    columns
  };
}
