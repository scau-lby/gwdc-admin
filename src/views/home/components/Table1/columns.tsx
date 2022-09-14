import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    {
      label: "操作",
      width: 230,
      slot: "operation",
      fixed: "left"
    },
    {
      label: "序号",
      type: "index",
      width: 60
    },
    {
      label: "作业单位",
      prop: "orgName",
      width: 200
    },
    {
      label: "钻井公司",
      prop: "company"
    },
    {
      label: "钻井队号",
      prop: "num"
    },
    {
      label: "井号",
      prop: "num"
    },
    {
      label: "固井类型",
      prop: "num"
    },
    {
      label: "固井级别",
      prop: "num"
    },
    {
      label: "当前进度",
      prop: "num"
    },
    {
      label: "作业设备",
      prop: "num"
    },
    {
      label: "施工指挥",
      prop: "num"
    },
    {
      label: "操作人员",
      prop: "num"
    },
    {
      label: "井队作业关键参数",
      width: 150,
      slot: "operation1",
      fixed: "right"
    }
  ]);

  return {
    columns
  };
}
