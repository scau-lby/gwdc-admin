import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    { label: "序号", type: "index", width: 60 },
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
    { label: "混浆密度", prop: "md" },
    { label: "A泵压力", prop: "abyl" },
    { label: "A泵瞬时排量", prop: "abll" },
    { label: "A泵累计排量", prop: "ablj" },
    { label: "清水瞬时流量", prop: "qsll" },
    { label: "清水累计流量", prop: "qslj" },
    { label: "A泵泵替瞬时排量", prop: "abdcll" },
    { label: "A泵泵替累计流量", prop: "abdclllj" }
  ]);

  return {
    columns
  };
}
