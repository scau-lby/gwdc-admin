import { ref } from "vue";

export function useColumns() {
  const columns = ref([
    { label: "序号", type: "index", width: 60 },
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
    { label: "混浆密度", prop: "md", width: 90 },
    { label: "A泵压力", prop: "abyl", width: 90 },
    { label: "B泵压力", prop: "bbyl", width: 90 },
    { label: "A泵瞬时排量", prop: "abll", width: 110 },
    { label: "B泵瞬时排量", prop: "bbll", width: 110 },
    { prop: "zssll", label: "双泵瞬时排量", width: 110 },
    { prop: "qsll", label: "清水瞬时流量", width: 110 },
    { prop: "abdcll", label: "A泵泵替瞬时排量", width: 140 },
    { prop: "bbdcll", label: "B泵泵替瞬时排量", width: 140 },
    { prop: "ablj", label: "A泵累计排量", width: 110 },
    { prop: "bblj", label: "B泵累计排量", width: 110 },
    { prop: "zlj", label: "双泵累计排量", width: 110 },
    { prop: "qslj", label: "清水累计排量", width: 110 },
    { prop: "abdclllj", label: "A泵泵替累计流量", width: 140 },
    { prop: "bbdclllj", label: "B泵泵替累计流量", width: 140 }
  ]);

  return {
    columns
  };
}
