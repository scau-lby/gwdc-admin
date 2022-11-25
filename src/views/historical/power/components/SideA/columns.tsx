import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    {
      label: "序号",
      type: "index",
      width: 60
    },
    {
      label: "作业时间",
      prop: "sj",
      width: 90,
      cellRenderer: ({ row }) =>
        row.sj.slice(8, 10) +
        ":" +
        row.sj.slice(10, 12) +
        ":" +
        row.sj.slice(12, 14)
    },
    {
      label: "发动机转速",
      prop: "dpfdjzs",
      width: 100
    },
    {
      label: "发动机扭矩",
      prop: "dpfdjnj",
      width: 100
    },
    {
      label: "发动机负载",
      prop: "dpfdjfz",
      width: 100
    },
    {
      label: "电瓶电压",
      prop: "dpdpdy",
      width: 90
    },
    {
      label: "开关后电压",
      prop: "dpdpkgdy",
      width: 100
    },
    {
      label: "总运行时间",
      prop: "dpzyxsj",
      width: 100
    },
    {
      label: "车辆总里程",
      prop: "dpzlc",
      width: 100
    },
    {
      label: "机油压力",
      prop: "dpjyyl",
      width: 90
    },
    {
      label: "机油温度",
      prop: "dpjywd",
      width: 90
    },
    {
      label: "冷却液压力",
      prop: "dplqyyl",
      width: 100
    },
    {
      label: "冷却液温度",
      prop: "dplqywd",
      width: 100
    },
    {
      label: "输油压力",
      prop: "dpsyyl",
      width: 90
    },
    {
      label: "燃油温度",
      prop: "dprywd",
      width: 90
    },
    {
      label: "中冷器温度",
      prop: "dpzlqwd",
      width: 100
    },
    {
      label: "废气温度",
      prop: "dpfdjfqwd",
      width: 90
    },
    {
      label: "进歧管温度",
      prop: "dpjqgwd",
      width: 100
    },
    {
      label: "空滤压差",
      prop: "dpkqlyc",
      width: 90
    },
    {
      label: "燃油液位",
      prop: "dpryyw",
      width: 90
    },
    {
      label: "当前油耗",
      prop: "dpyhdc",
      width: 90
    },
    {
      label: "总燃油消耗",
      prop: "dpzyh",
      width: 100
    },
    {
      label: "燃油消耗率",
      prop: "dpryxhb",
      width: 100
    },
    {
      label: "油门开度",
      prop: "dpymtb",
      width: 90
    },
    {
      label: "尿素液位",
      prop: "dpnsyw",
      width: 90
    },
    {
      label: "变速箱油温",
      prop: "dpbsxyw",
      width: 100
    },
    {
      label: "请求档位",
      prop: "dpbsxqqdw",
      width: 90
    },
    {
      label: "实际档位",
      prop: "dpbsxdw",
      width: 90
    }
  ]);

  return {
    columns
  };
}
