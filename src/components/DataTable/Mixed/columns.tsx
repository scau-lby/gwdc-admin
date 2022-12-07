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
      cellRenderer: ({ row }) =>
        row.sj.slice(8, 10) +
        ":" +
        row.sj.slice(10, 12) +
        ":" +
        row.sj.slice(12, 14)
    },
    { prop: "md", label: "混浆密度" },
    { prop: "abyl", label: "A泵压力" },
    { prop: "zssll", label: "A泵瞬时排量" },
    { prop: "abdcll", label: "清水瞬时流量" },
    { prop: "zlj", label: "A泵泵替瞬时排量" },
    { prop: "abdclllj", label: "A泵累计排量" }
  ]);

  return {
    columns
  };
}
