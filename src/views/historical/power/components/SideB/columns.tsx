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
      prop: "bpfdjzs",
      width: 100
    },
    {
      label: "发动机扭矩",
      prop: "bpfdjnj",
      width: 100
    },
    {
      label: "发动机负载",
      prop: "bpfdjfz",
      width: 100
    },
    {
      label: "电瓶电压",
      prop: "bpdpdy",
      width: 90
    },
    {
      label: "开关后电压",
      prop: "bpdpkgdy",
      width: 100
    },
    {
      label: "总运行时间",
      prop: "bpzyxsj",
      width: 100
    },
    {
      label: "车辆总里程",
      prop: "bpzlc",
      width: 100
    },
    {
      label: "机油压力",
      prop: "bpjyyl",
      width: 90
    },
    {
      label: "机油温度",
      prop: "bpjywd",
      width: 90
    },
    {
      label: "冷却液压力",
      prop: "bplqyyl",
      width: 100
    },
    {
      label: "冷却液温度",
      prop: "bplqywd",
      width: 100
    },
    {
      label: "输油压力",
      prop: "bpsyyl",
      width: 90
    },
    {
      label: "燃油温度",
      prop: "bprywd",
      width: 90
    },
    {
      label: "中冷器温度",
      prop: "bpzlqwd",
      width: 100
    },
    {
      label: "废气温度",
      prop: "bpfdjfqwd",
      width: 90
    },
    {
      label: "进歧管温度",
      prop: "bpjqgwd",
      width: 100
    },
    {
      label: "空滤压差",
      prop: "bpkqlyc",
      width: 90
    },
    {
      label: "燃油液位",
      prop: "bpryyw",
      width: 90
    },
    {
      label: "当前油耗",
      prop: "bpyhdc",
      width: 90
    },
    {
      label: "总燃油消耗",
      prop: "bpzyh",
      width: 100
    },
    {
      label: "燃油消耗率",
      prop: "bpryxhb",
      width: 100
    },
    {
      label: "油门开度",
      prop: "bpymtb",
      width: 90
    },
    {
      label: "尿素液位",
      prop: "bpnsyw",
      width: 90
    },
    {
      label: "变速箱油温",
      prop: "bpbsxyw",
      width: 100
    },
    {
      label: "请求档位",
      prop: "bpbsxqqdw",
      width: 100
    },
    {
      label: "实际档位",
      prop: "bpbsxdw",
      width: 90
    }
  ]);

  return {
    columns
  };
}
