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
      label: "作业日期",
      prop: "commander"
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
      label: "设备所属单位",
      prop: "belongTo"
    },
    {
      label: "作业时长",
      prop: "totalMin"
    }
  ]);

  return {
    columns
  };
}
