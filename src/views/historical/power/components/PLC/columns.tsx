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
      label: "混浆密度",
      prop: "md",
      width: 90
    },
    {
      label: "A泵压力",
      prop: "abyl",
      width: 90
    },
    {
      label: "B泵压力",
      prop: "bbyl",
      width: 90
    },
    {
      label: "A泵瞬时",
      prop: "abll",
      width: 90
    },
    {
      label: "B泵瞬时",
      prop: "bbll",
      width: 90
    },
    {
      label: "双泵瞬时",
      prop: "zssll",
      width: 90
    },
    {
      label: "A泵累计",
      prop: "ablj",
      width: 90
    },
    {
      label: "B泵累计",
      prop: "bblj",
      width: 90
    },
    {
      label: "双泵累计",
      prop: "zlj",
      width: 90
    },
    {
      label: "清水瞬时",
      prop: "qsll",
      width: 90
    },
    {
      label: "清水累计",
      prop: "qslj",
      width: 90
    },
    {
      label: "A泵替瞬时",
      prop: "abdcll",
      width: 100
    },
    {
      label: "B泵替瞬时",
      prop: "bbdcll",
      width: 100
    },
    {
      label: "A泵替累计",
      prop: "abdclllj",
      width: 100
    },
    {
      label: "B泵替累计",
      prop: "bbdclllj",
      width: 100
    },
    {
      label: "灰阀阀位",
      prop: "hffw",
      width: 90
    },
    {
      label: "水阀阀位",
      prop: "sffw",
      width: 90
    },
    {
      label: "混浆液位",
      prop: "yw",
      width: 90
    },
    {
      label: "A泵油压",
      prop: "abyy",
      width: 90
    },
    {
      label: "A泵油温",
      prop: "abyw",
      width: 90
    },
    {
      label: "B泵油压",
      prop: "bbyy",
      width: 90
    },
    {
      label: "B泵油温",
      prop: "bbyw",
      width: 90
    }
  ]);

  return {
    columns
  };
}
