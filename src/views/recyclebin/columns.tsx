import { ref } from "vue";
import dayjs from "dayjs";

export function useColumns() {
  const columns = ref([
    {
      label: "序号",
      type: "index",
      width: 60,
      align: "left",
      hide: ({ checkList }) => !checkList.includes("序号列")
    },
    {
      label: "操作",
      fixed: "left",
      width: 100,
      slot: "operation"
    },
    {
      label: "操作人员",
      prop: "operator",
      width: 200
    },
    {
      label: "删除时间",
      prop: "createtime",
      formatter: ({ createtime }) =>
        dayjs(createtime).format("YYYY-MM-DD HH:mm:ss"),
      width: 200
    },
    {
      label: "删除内容",
      prop: "remark"
    }
  ]);

  return {
    columns
  };
}
