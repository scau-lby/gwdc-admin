import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    {
      label: "操作",
      width: 140,
      slot: "operation",
      fixed: "left"
    },
    {
      label: "序号",
      type: "index",
      width: 60
    },
    {
      label: "施工任务",
      prop: "task",
      width: 200,
      cellRenderer: scope => scope.row.wellName + " " + scope.row.wellType
    },
    {
      label: "作业单位",
      prop: "taskDepartment"
    },
    {
      label: "设备编号",
      prop: "plateNum"
    },
    {
      label: "设备类型",
      prop: "equType"
    },
    {
      label: "施工指挥",
      prop: "commander"
    },
    {
      label: "操作人员",
      prop: "opreatePerson"
    },
    {
      label: "当前状态",
      prop: "state",
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={
            row.state === -1
              ? "danger"
              : row.state === 0
              ? "warning"
              : "success"
          }
          effect="plain"
        >
          {row.state === -1 ? "离线" : row.state === 0 ? "无数据" : "有数据"}
        </el-tag>
      )
    },
    {
      label: "设备所属单位",
      prop: "belongTo"
    },
    {
      label: "在线时长",
      prop: "totalMin"
    },
    {
      label: "关注度",
      prop: "maxOlAttention"
    },
    {
      label: "施工位置",
      prop: "position",
      width: 350
    }
  ]);

  return {
    columns
  };
}
