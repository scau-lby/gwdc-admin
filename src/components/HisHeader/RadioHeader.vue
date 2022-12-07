<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
// store
import { useHisDataStoreHook } from "/@/store/modules/hisData";
// api
import { getHistoryWell, getHistoryList } from "/@/api/history";
import { getHistoryReal } from "/@/api/well";
import { ElMessageBox } from "element-plus";
// excel
import { utils, writeFile } from "xlsx";
defineOptions({
  name: "radioHeader"
});

let wellName = "",
  wellType = "";

const task = ref(""),
  plateList = ref([]),
  plate_checked = ref(""),
  flag = ref("底盘");

const beginTime1 = ref(null),
  endTime1 = ref(null),
  beginTime2 = ref(null),
  endTime2 = ref(null);

// 下载中
const loading = ref(false);

function onFlagChange(value) {
  useHisDataStoreHook().SET_FLAG(value);
}

watch(
  () => plate_checked.value,
  value => {
    if (value && wellName && wellType) {
      beginTime1.value = "";
      beginTime2.value = "";
      useHisDataStoreHook().SET_BEGINTIME("");
      endTime1.value = "";
      endTime2.value = "";
      useHisDataStoreHook().SET_ENDTIME("");
      useHisDataStoreHook().SET_PLATE(value);
      plateList.value.forEach(item => {
        if (item.plateNum === value) {
          beginTime1.value = item.startTime;
          beginTime2.value = item.startTime;
          useHisDataStoreHook().SET_BEGINTIME(item.startTime);
          endTime1.value = item.finishTime;
          endTime2.value = item.finishTime;
          useHisDataStoreHook().SET_ENDTIME(item.finishTime);
          setTimeout(() => {
            emit("getTableData");
          }, 500);
        }
      });
    }
  },
  {
    deep: true,
    immediate: true
  }
);

const emit = defineEmits(["getTableData"]);

function emitGetDataListByAll() {
  useHisDataStoreHook().SET_BEGINTIME(beginTime1.value);
  useHisDataStoreHook().SET_ENDTIME(endTime1.value);
  emit("getTableData");
}

function emitGetDataListByPart() {
  useHisDataStoreHook().SET_BEGINTIME(beginTime2.value);
  useHisDataStoreHook().SET_ENDTIME(endTime2.value);
  emit("getTableData");
}

async function getPlatesList() {
  let { data } = await getHistoryWell({
    wellName,
    wellType
  });
  plateList.value = data;

  plate_checked.value = data[0].plateNum;
  useHisDataStoreHook().SET_PLATE(data[0].plateNum);
}

onMounted(() => {
  wellName = useHisDataStoreHook().getWellName;
  wellType = useHisDataStoreHook().getWellType;
  if (!wellName || !wellType) {
    getHistoryList({
      pageNum: 1,
      pageSize: 1
    }).then(({ data }) => {
      const records = data.records;
      useHisDataStoreHook().SET_WELLNAME(records[0].wellName);
      useHisDataStoreHook().SET_WELLTYPE(records[0].wellType);
      wellName = records[0].wellName;
      wellType = records[0].wellType;
      task.value = wellName + " @ " + wellType;
      getPlatesList();
    });
  } else {
    task.value = wellName + " @ " + wellType;
    getPlatesList();
  }
});

interface DataItem {
  readonly id: string;
  [propName: string]: string;
}
interface Columns {
  dataKey: string;
  key: string;
  title: string;
  width?: number;
  [propName: string]: string | number;
}
// 表头
const generateColumns = (columns = [], prefix = "", props?: any) =>
  Array.from(columns).map(item => ({
    ...props,
    key:
      item.key !== "time" && prefix !== "plc"
        ? `${prefix}${item.key}`
        : `${item.key}`,
    dataKey:
      item.key !== "time" && prefix !== "plc"
        ? `${prefix}${item.key}`
        : `${item.key}`,
    title: `${item.value}`,
    width: 500
  }));
const generateData = (
  columns: ReturnType<typeof generateColumns>,
  dataList = [],
  prefix = ""
) =>
  Array.from(dataList).map((item, rowIndex) => {
    return columns.reduce(
      (rowData, column) => {
        rowData[column.dataKey] = item[column.dataKey];
        return rowData;
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null
      }
    );
  });
const columns_data_1 = [
  { key: "time", value: "时间" },
  { key: "fdjzs", value: "发动机转速" },
  { key: "fdjnj", value: "发动机扭矩" },
  { key: "fdjfz", value: "发动机负载" },
  { key: "dpdy", value: "电瓶电压" },
  { key: "dpkgdy", value: "开关后电压" },
  { key: "zyxsj", value: "总运行时间" },
  { key: "zlc", value: "车辆总里程" },
  { key: "jyyl", value: "机油压力" },
  { key: "jywd", value: "机油温度" },
  { key: "lqyyl", value: "冷却液压力" },
  { key: "lqywd", value: "冷却液温度" },
  { key: "syyl", value: "输油压力" },
  { key: "rywd", value: "燃油温度" },
  { key: "zlqwd", value: "中冷器温度" },
  { key: "fdjfqwd", value: "废气温度" },
  { key: "jqgwd", value: "进歧管温度" },
  { key: "kqlyc", value: "空滤压差" },
  { key: "ryyw", value: "燃油液位" },
  { key: "yhdc", value: "当前油耗" },
  { key: "zyh", value: "总燃油消耗" },
  { key: "ryxhb", value: "燃油消耗率" },
  { key: "ymtb", value: "油门开度" },
  { key: "nsyw", value: "尿素液位" },
  { key: "bsxyw", value: "变速箱油温" },
  { key: "bsxqqdw", value: "请求档位" },
  { key: "bsxdw", value: "实际档位" }
];
const columns_data_2 = [
  { key: "time", value: "时间" },
  { key: "md", value: "混浆密度" },
  { key: "abyl", value: "A泵压力" },
  { key: "bbyl", value: "B泵压力" },
  { key: "abll", value: "A泵瞬时" },
  { key: "bbll", value: "B泵瞬时" },
  { key: "zssll", value: "双泵瞬时" },
  { key: "ablj", value: "A泵累计" },
  { key: "bblj", value: "B泵累计" },
  { key: "zlj", value: "双泵累计" },
  { key: "qsll", value: "清水瞬时" },
  { key: "qslj", value: "清水累计" },
  { key: "abdcll", value: "A泵替瞬时" },
  { key: "bbdcll", value: "B泵替瞬时" },
  { key: "abdclllj", value: "A泵替累计" },
  { key: "bbdclllj", value: "B泵替累计" },
  { key: "hffw", value: "灰阀阀位" },
  { key: "sffw", value: "水阀阀位" },
  { key: "yw", value: "混浆液位" },
  { key: "abyy", value: "A泵油压" },
  { key: "abyw", value: "A泵油温" },
  { key: "bbyy", value: "B泵油压" },
  { key: "bbyw", value: "B泵油温" }
];

const columns_chassis = generateColumns(columns_data_1, "ap");
const columns_plc = generateColumns(columns_data_2, "plc");
const columns_sideA = generateColumns(columns_data_1, "dp");
const columns_sideB = generateColumns(columns_data_1, "bp");

let dataList = [];
// 下载全部数据
function exportAll() {
  ElMessageBox.confirm(
    `${wellName} - ${wellType} - ${plate_checked.value}`,
    "下载全部数据",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    }
  )
    .then(() => {
      loading.value = true;
      getDataList(
        wellName,
        wellType,
        plate_checked.value,
        beginTime1.value,
        endTime1.value
      );
    })
    .catch(() => {});
}
// 下载施工数据
function exportPart() {
  ElMessageBox.confirm(
    `${wellName} - ${wellType} - ${plate_checked.value}`,
    "下载施工数据",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    }
  )
    .then(() => {
      loading.value = true;
      getDataList(
        wellName,
        wellType,
        plate_checked.value,
        beginTime2.value,
        endTime2.value
      );
    })
    .catch(() => {});
}

function getDataList(
  curr_wellName,
  curr_wellType,
  curr_plate,
  curr_beginTime,
  curr_endTime
) {
  dataList = [];

  getHistoryReal({
    wellName: curr_wellName,
    wellType: curr_wellType,
    plateNum: curr_plate,
    beginTime: curr_beginTime,
    endTime: curr_endTime,
    pageNum: 1,
    pageSize: 500
  }).then(({ data }) => {
    const { pages } = data;
    let curr_pageNum = pages;
    getMoreRecords(
      curr_wellName,
      curr_wellType,
      curr_plate,
      curr_beginTime,
      curr_endTime,
      curr_pageNum
    );

    const timer = setInterval(() => {
      if (curr_pageNum > 1) {
        curr_pageNum = curr_pageNum - 1;
        getMoreRecords(
          curr_wellName,
          curr_wellType,
          curr_plate,
          curr_beginTime,
          curr_endTime,
          curr_pageNum
        );
      } else {
        clearInterval(timer);
        loading.value = false;
        exportExcel(curr_plate, dataList);
      }
    }, 2000);
  });
}

function getMoreRecords(
  curr_wellName,
  curr_wellType,
  curr_plate = "",
  curr_beginTime = "",
  curr_endTime = "",
  curr_pageNum = 1
) {
  getHistoryReal({
    wellName: curr_wellName,
    wellType: curr_wellType,
    plateNum: curr_plate,
    beginTime: curr_beginTime,
    endTime: curr_endTime,
    pageNum: curr_pageNum,
    pageSize: 500
  }).then(({ data }) => {
    const records = data.records.map(item => clean(item));
    dataList = records.concat(dataList);
  });
}

function clean(params: object) {
  const res = {};
  for (var i in params) {
    if (params[i] != 0 && ["jd", "wd", "sj", "flag"].indexOf(i) === -1) {
      res[i] = parseFloat(params[i]).toFixed(3);
      if (i === "md" && parseFloat(params[i]) < 0) {
        res[i] = 0;
      }
    } else if (i === "sj") {
      res["time"] =
        params["sj"].slice(0, 4) +
        "-" +
        params["sj"].slice(4, 6) +
        "-" +
        params["sj"].slice(6, 8) +
        " " +
        params["sj"].slice(8, 10) +
        ":" +
        params["sj"].slice(10, 12) +
        ":" +
        params["sj"].slice(12, 14);
    } else {
      res[i] = params[i];
    }
  }
  return res;
}

function exportExcel(plate, dataList) {
  let columns_arr = [
    { key: "底盘", value: columns_chassis },
    { key: "plc", value: columns_plc },
    { key: "A侧", value: columns_sideA },
    { key: "B侧", value: columns_sideB }
  ];
  var workBook = utils.book_new();

  columns_arr.forEach(item => {
    const { key: flag, value: columns } = item;

    const data = generateData(columns, dataList);
    const res: string[][] = data.map((item: DataItem) => {
      const arr = [];
      columns.forEach((column: Columns) => {
        arr.push(item[column.dataKey]);
      });
      return arr;
    });
    const titleList: string[] = [];
    columns.forEach((column: Columns) => {
      titleList.push(column.title);
    });
    res.unshift(titleList);
    const workSheet = utils.aoa_to_sheet(res);

    utils.book_append_sheet(workBook, workSheet, `${flag}-数据报表`);
  });
  writeFile(workBook, `${wellName} - ${wellType} - ${plate} - 动力参数.xlsx`);
}

onBeforeUnmount(() => {
  useHisDataStoreHook().SET_PLATE("");
  useHisDataStoreHook().SET_PLATES([]);
  useHisDataStoreHook().SET_FLAG("底盘");
  useHisDataStoreHook().SET_BEGINTIME("");
  useHisDataStoreHook().SET_ENDTIME("");
});
</script>
<template>
  <div class="source-card">
    <el-card header="施工任务" :body-style="{ padding: '10px 15px' }">
      <el-input v-model="task" readonly />
    </el-card>
    <el-card
      header="设备编号"
      style="flex-grow: 1"
      :body-style="{ padding: '10px 15px' }"
    >
      <el-radio-group v-model="plate_checked">
        <el-radio
          v-for="item in plateList"
          :key="item.id"
          :label="item.plateNum"
        />
      </el-radio-group>
    </el-card>
    <el-card
      header="订阅方式"
      :body-style="{ padding: '10px 15px' }"
      style="width: 250px"
    >
      <el-radio-group v-model="flag" @change="onFlagChange">
        <el-radio :label="'底盘'"> 底盘 </el-radio>
        <el-radio :label="'PLC'"> PLC </el-radio>
        <el-radio :label="'A侧'"> A侧 </el-radio>
        <el-radio :label="'B侧'"> B侧 </el-radio>
      </el-radio-group>
    </el-card>
    <el-card style="flex-grow: 1" :body-style="{ padding: '10px 15px' }">
      <div style="display: flex">
        <el-form-item label="记录开始时间">
          <el-date-picker
            v-model="beginTime1"
            type="datetime"
            value-format="YYYYMMDDHHmmss"
            readonly
            :clearable="false"
          />
        </el-form-item>

        <el-form-item label="记录结束时间" style="margin-left: 10px">
          <el-date-picker
            v-model="endTime1"
            type="datetime"
            value-format="YYYYMMDDHHmmss"
            readonly
            :clearable="false"
          />
        </el-form-item>
        <el-button
          type="default"
          @click="emitGetDataListByAll"
          style="margin-left: 10px"
        >
          显示全部数据
        </el-button>
        <el-tooltip content="下载全部数据" placement="top">
          <el-button
            type="default"
            :icon="useRenderIcon('download')"
            @click="exportAll"
            :loading="loading"
            style="margin-left: 10px"
          />
        </el-tooltip>
      </div>
      <div style="display: flex; margin-top: 5px">
        <el-form-item label="施工开始时间">
          <el-date-picker
            v-model="beginTime2"
            type="datetime"
            value-format="YYYYMMDDHHmmss"
            :clearable="false"
          />
        </el-form-item>

        <el-form-item label="施工结束时间" style="margin-left: 10px">
          <el-date-picker
            v-model="endTime2"
            type="datetime"
            value-format="YYYYMMDDHHmmss"
            :clearable="false"
          />
        </el-form-item>

        <el-button
          type="default"
          @click="emitGetDataListByPart"
          style="margin-left: 10px"
        >
          显示施工数据
        </el-button>
        <el-tooltip content="下载施工数据" placement="bottom">
          <el-button
            type="default"
            :icon="useRenderIcon('download')"
            @click="exportPart"
            :loading="loading"
            style="margin-left: 10px"
          />
        </el-tooltip>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.source-card {
  display: flex;

  .el-card + .el-card {
    margin-left: 15px;
  }

  ::v-deep(.el-card__header) {
    text-align: center;
    padding: 10px 10px 0;
    border-bottom: none;
    font-weight: 600;
    color: #606266;
  }

  ::v-deep(.el-form-item) {
    margin-bottom: 0px;
  }

  ::v-deep(.el-input__inner) {
    text-align: center;
  }

  ::v-deep(.el-radio) {
    margin-right: 0;
  }

  ::v-deep(.el-radio-group) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
