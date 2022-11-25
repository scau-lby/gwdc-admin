<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
// store
import { useHisDataStoreHook } from "/@/store/modules/hisData";
// api
import { getHistoryWell, getHistoryList } from "/@/api/history";
import { getHistoryReal } from "/@/api/well";
// excel
import { utils, writeFile } from "xlsx";
defineOptions({
  name: "radioHeader"
});

let wellName = "",
  wellType = "",
  task = ref(""),
  plateList = ref([]), // 当前选中任务对应的设备列表
  plates_checked = ref(""), // 当前选中设备编号数组
  flag = ref("底盘");

const beginTime1 = ref(null),
  endTime1 = ref(null),
  beginTime2 = ref(null),
  endTime2 = ref(null);

function onPlateChange(value) {
  useHisDataStoreHook().SET_BEGINTIME("");
  useHisDataStoreHook().SET_ENDTIME("");
  useHisDataStoreHook().SET_PLATENUM(value);
}

watch(
  () => plates_checked.value,
  value => {
    if (value && wellName && wellType) {
      getTimeRange();
    }
  },
  {
    deep: true,
    immediate: true
  }
);

async function getTimeRange() {
  let { data: data1 } = await getHistoryReal({
    pageNum: 1,
    pageSize: 1,
    plateNum: plates_checked.value,
    wellName,
    wellType
  });
  beginTime1.value = data1.records[0].sj;
  beginTime2.value = data1.records[0].sj;
  let { data: data2 } = await getHistoryReal({
    pageNum: data1.pages,
    pageSize: 1,
    plateNum: plates_checked.value,
    wellName,
    wellType
  });
  endTime1.value = data2.records[0].sj;
  endTime2.value = data2.records[0].sj;
  useHisDataStoreHook().SET_BEGINTIME(beginTime1.value);
  useHisDataStoreHook().SET_ENDTIME(endTime1.value);
}

function onFlagChange(value) {
  useHisDataStoreHook().SET_FLAG(value);
}

async function getPlateList() {
  let { data } = await getHistoryWell({
    wellName,
    wellType
  });
  plateList.value = data;
  plates_checked.value = data[0].plateNum;
  useHisDataStoreHook().SET_PLATENUM(data[0].plateNum);
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
      getPlateList();
    });
  } else {
    task.value = wellName + " @ " + wellType;
    getPlateList();
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
    key: item.key !== "sj" ? `${prefix}${item.key}` : `${item.key}`,
    dataKey: item.key !== "sj" ? `${prefix}${item.key}` : `${item.key}`,
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
  { key: "sj", value: "时间" },
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
  { key: "sj", value: "时间" },
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
const columns_plc = generateColumns(columns_data_2, "");
const columns_sideA = generateColumns(columns_data_1, "dp");
const columns_sideB = generateColumns(columns_data_1, "bp");

let dataList = [];
// 下载全部数据
function exportAll() {
  getDataList(beginTime1.value, endTime1.value);
}
// 下载施工数据
function exportPart() {
  getDataList(beginTime2.value, endTime2.value);
}

function getDataList(beginTime, endTime) {
  dataList = [];
  getHistoryReal({
    wellName,
    wellType,
    plateNum: plates_checked.value,
    beginTime,
    endTime,
    pageNum: 1,
    pageSize: 500
  }).then(({ data }) => {
    const { pages } = data;
    let pageNum = pages;
    getMoreRecords(beginTime, endTime, pageNum);

    const timer = setInterval(() => {
      if (pageNum > 1) {
        pageNum = pageNum - 1;
        getMoreRecords(beginTime, endTime, pageNum);
      } else {
        clearInterval(timer);
        exportExcel(dataList);
      }
    }, 2000);
  });
}

function getMoreRecords(beginTime = "", endTime = "", pageNum) {
  getHistoryReal({
    wellName,
    wellType,
    plateNum: plates_checked.value,
    beginTime,
    endTime,
    pageNum,
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
    } else {
      res[i] = params[i];
    }
  }
  return res;
}

function exportExcel(dataList) {
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
  writeFile(workBook, `${wellName}-${wellType}-${plates_checked.value}.xlsx`);
}

function emitGetDataListByAll() {
  useHisDataStoreHook().SET_BEGINTIME(beginTime1.value);
  useHisDataStoreHook().SET_ENDTIME(endTime1.value);
}

function emitGetDataListByPart() {
  useHisDataStoreHook().SET_BEGINTIME(beginTime2.value);
  useHisDataStoreHook().SET_ENDTIME(endTime2.value);
}
</script>
<template>
  <div class="source-card">
    <el-card header="施工任务" :body-style="{ padding: '10px 15px' }">
      <el-input v-model="task" readonly />
    </el-card>
    <el-card
      header="设备编号"
      :body-style="{ padding: '10px 15px' }"
      style="max-width: 300px"
    >
      <el-radio-group v-model="plates_checked" @change="onPlateChange">
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
      <el-row :gutter="10">
        <el-col :span="9">
          <el-form-item label="记录开始时间">
            <el-date-picker
              v-model="beginTime1"
              type="datetime"
              value-format="YYYYMMDDHHmmss"
              readonly
            />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="记录结束时间">
            <el-date-picker
              v-model="endTime1"
              type="datetime"
              value-format="YYYYMMDDHHmmss"
              readonly
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="default" @click="emitGetDataListByAll">
            显示全部数据
          </el-button>
          <el-button
            type="default"
            :icon="useRenderIcon('download')"
            @click="exportAll"
            title="下载全部数据"
          />
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-top: 5px">
        <el-col :span="9">
          <el-form-item label="施工开始时间">
            <el-date-picker
              v-model="beginTime2"
              type="datetime"
              value-format="YYYYMMDDHHmmss"
              :clearable="false"
            />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="施工结束时间">
            <el-date-picker
              v-model="endTime2"
              type="datetime"
              value-format="YYYYMMDDHHmmss"
              :clearable="false"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="default" @click="emitGetDataListByPart">
            显示施工数据
          </el-button>
          <el-button
            type="default"
            :icon="useRenderIcon('download')"
            @click="exportPart"
            title="下载施工数据"
          />
        </el-col>
      </el-row>
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
