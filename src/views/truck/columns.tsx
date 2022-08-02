import { ref } from "vue";
import dayjs from "dayjs";

export function useColumns() {
  const columns = ref([
    {
      type: "selection",
      width: 55,
      align: "left",
      hide: ({ checkList }) => !checkList.includes("勾选列")
    },
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
      label: "所属单位",
      prop: "belongTo",
      width: 150
    },
    {
      label: "设备类型",
      prop: "equType",
      width: 100
    },
    {
      label: "设备编号",
      prop: "plateNum",
      width: 200
    },
    {
      label: "数据SIM卡号",
      prop: "dataSimCard",
      width: 200
    },
    {
      label: "数据订阅主题",
      prop: "subject",
      width: 300
    },
    {
      label: "数据状态",
      prop: "dataState",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.dataState === 1 ? "success" : "danger"}
          effect="plain"
        >
          {row.dataState === 1 ? "已激活" : "未激活"}
        </el-tag>
      )
    },
    {
      label: "视频SIM卡号",
      prop: "videoSimCard",
      width: 200
    },
    {
      label: "视频IP",
      prop: "videoIp"
    },
    {
      label: "视频状态",
      prop: "videoState",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.videoState === 1 ? "success" : "danger"}
          effect="plain"
        >
          {row.videoState === 1 ? "已激活" : "未激活"}
        </el-tag>
      )
    },
    {
      label: "安装时间",
      prop: "installDate",
      formatter: ({ installDate }) => dayjs(installDate).format("YYYY-MM-DD"),
      width: 200
    },
    {
      label: "备注",
      prop: "note",
      width: 200,
      fixed: "right"
    }
  ]);

  return {
    columns
  };
}
