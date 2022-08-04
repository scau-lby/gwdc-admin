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
      label: "操作人员",
      prop: "operator",
      width: 200
    },
    {
      label: "操作方式",
      prop: "type",
      width: 100
    },
    {
      label: "操作时间",
      prop: "createtime",
      formatter: ({ createtime }) =>
        dayjs(createtime).format("YYYY-MM-DD HH:mm:ss"),
      width: 200
    },
    {
      label: "操作内容",
      prop: "remark"
    }
  ]);

  return {
    columns
  };
}
