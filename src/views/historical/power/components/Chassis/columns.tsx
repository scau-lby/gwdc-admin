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
      prop: "apfdjzs",
      width: 100
    },
    {
      label: "发动机扭矩",
      prop: "apfdjnj",
      width: 100
    },
    {
      label: "发动机负载",
      prop: "apfdjfz",
      width: 100
    },
    {
      label: "电瓶电压",
      prop: "apdpdy",
      width: 90
    },
    {
      label: "开关后电压",
      prop: "apdpkgdy",
      width: 100
    },
    {
      label: "总运行时间",
      prop: "apzyxsj",
      width: 100
    },
    {
      label: "车辆总里程",
      prop: "apzlc",
      width: 100
    },
    {
      label: "机油压力",
      prop: "apjyyl",
      width: 90
    },
    {
      label: "机油温度",
      prop: "apjywd",
      width: 90
    },
    {
      label: "冷却液压力",
      prop: "aplqyyl",
      width: 100
    },
    {
      label: "冷却液温度",
      prop: "aplqywd",
      width: 100
    },
    {
      label: "输油压力",
      prop: "apsyyl",
      width: 90
    },
    {
      label: "燃油温度",
      prop: "aprywd",
      width: 90
    },
    {
      label: "中冷器温度",
      prop: "apzlqwd",
      width: 100
    },
    {
      label: "废气温度",
      prop: "apfdjfqwd",
      width: 90
    },
    {
      label: "进歧管温度",
      prop: "apjqgwd",
      width: 100
    },
    {
      label: "空滤压差",
      prop: "apkqlyc",
      width: 90
    },
    {
      label: "燃油液位",
      prop: "apryyw",
      width: 90
    },
    {
      label: "当前油耗",
      prop: "apyhdc",
      width: 90
    },
    {
      label: "总燃油消耗",
      prop: "apzyh",
      width: 100
    },
    {
      label: "燃油消耗率",
      prop: "apryxhb",
      width: 100
    },
    {
      label: "油门开度",
      prop: "apymtb",
      width: 90
    },
    {
      label: "尿素液位",
      prop: "apnsyw",
      width: 90
    },
    {
      label: "变速箱油温",
      prop: "apbsxyw",
      width: 100
    },
    {
      label: "请求档位",
      prop: "apbsxqqdw",
      width: 100
    },
    {
      label: "实际档位",
      prop: "apbsxdw",
      width: 90
    }
  ]);

  return {
    columns
  };
}
