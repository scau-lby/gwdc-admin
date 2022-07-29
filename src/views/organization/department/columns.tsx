import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    {
      type: "selection",
      width: 55,
      align: "left",
      hide: ({ checkList }) => !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      width: 60,
      align: "left",
      hide: ({ checkList }) => !checkList.includes("序号列")
    },
    {
      label: "操作",
      width: 100,
      slot: "operation",
      fixed: "left"
    },
    {
      label: "机构名称",
      prop: "label",
      width: 200,
      align: "left"
    },
    {
      label: "当前层级",
      prop: "sort",
      width: 100
    },
    {
      label: "上级机构",
      prop: "sort",
      width: 200
    },
    {
      label: "是否虚拟机构",
      prop: "status",
      width: 80,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === 1 ? "danger" : "success"}
          effect="plain"
        >
          {row.status === 0 ? "否" : "是"}
        </el-tag>
      )
    },
    {
      label: "虚拟机构可查看设备",
      prop: "remark"
    }
  ]);

  return {
    columns
  };
}
