<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
// store
import { useHisDataStoreHook } from "/@/store/modules/hisData";
// api
import { getHistoryWell, getHistoryList } from "/@/api/history";
// getHistoryReal, getFixedHistoryReal,
import { setPlanData, getPlanData, delPlanData } from "/@/api/well";
// import { getTruckList } from "/@/api/truck";
// ElMessageBox
import { ElMessage } from "element-plus";
// excel
// import { utils, writeFile } from "xlsx";

import type { FormInstance } from "element-plus";
defineOptions({
  name: "multiHeader"
});

let wellName = "",
  wellType = "";

const task = ref(""),
  plateList = ref([]),
  plate_checked = ref(""),
  plates_checked = ref([]),
  mixed = ref(0);

const beginTime1 = ref(""),
  beginTime2 = ref(""),
  endTime1 = ref(""),
  endTime2 = ref("");

// 下载中
// const loading = ref(false);

// 订阅方式 change
function onMixedChange(value) {
  useHisDataStoreHook().SET_MIXED(value);
  beginTime1.value = "";
  endTime1.value = "";
  useHisDataStoreHook().SET_BEGINTIME("");
  beginTime2.value = "";
  endTime2.value = "";
  useHisDataStoreHook().SET_ENDTIME("");

  if (value === 0) {
    plateList.value.forEach(item => {
      if (item.plateNum === plate_checked.value) {
        beginTime1.value = item.startTime;
        endTime1.value = item.finishTime;
        useHisDataStoreHook().SET_BEGINTIME(item.startTime);
        beginTime2.value = item.startTime;
        endTime2.value = item.finishTime;
        useHisDataStoreHook().SET_ENDTIME(item.finishTime);
        setTimeout(() => {
          emit("getTableData");
        }, 500);
      }
    });
  } else {
    let time1_arr = [],
      time2_arr = [];
    plateList.value.forEach(item => {
      if (plates_checked.value.indexOf(item.plateNum) !== -1) {
        time1_arr.push(parseInt(item.startTime));
        time2_arr.push(parseInt(item.finishTime));
      }
    });
    const time1 = time1_arr.sort()[0] + "",
      time2 = time2_arr.sort().reverse()[0] + "";
    beginTime1.value = time1;
    beginTime2.value = time1;
    useHisDataStoreHook().SET_BEGINTIME(time1);
    endTime1.value = time2;
    endTime2.value = time2;
    useHisDataStoreHook().SET_ENDTIME(time2);
    setTimeout(() => {
      emit("getTableData");
    }, 500);
  }
}

watch(
  () => plate_checked.value,
  val => {
    if (val && wellName && wellType && mixed.value === 0) {
      beginTime1.value = "";
      beginTime2.value = "";
      useHisDataStoreHook().SET_BEGINTIME("");
      endTime1.value = "";
      endTime2.value = "";
      useHisDataStoreHook().SET_ENDTIME("");
      useHisDataStoreHook().SET_PLATE(val);
      plateList.value.forEach(item => {
        if (item.plateNum === val) {
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
  }
);

watch(
  () => plates_checked.value,
  val => {
    if (val && wellName && wellType && mixed.value === 1) {
      beginTime1.value = "";
      beginTime2.value = "";
      useHisDataStoreHook().SET_BEGINTIME("");
      endTime1.value = "";
      endTime2.value = "";
      useHisDataStoreHook().SET_ENDTIME("");
      useHisDataStoreHook().SET_PLATES(val);
      let time1 = [],
        time2 = [];
      plateList.value.forEach(item => {
        if (val.indexOf(item.plateNum) !== -1) {
          time1.push(parseInt(item.startTime));
          time2.push(parseInt(item.finishTime));
        }
      });
      const beginTime = time1.sort()[0],
        endTime = time2.sort().reverse()[0];

      beginTime1.value = beginTime;
      beginTime2.value = beginTime;
      useHisDataStoreHook().SET_BEGINTIME(beginTime);
      endTime1.value = endTime;
      endTime2.value = endTime;
      useHisDataStoreHook().SET_ENDTIME(endTime);

      setTimeout(() => {
        emit("getTableData");
      }, 500);
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
  setTimeout(() => {
    emit("getTableData");
  }, 500);
}

function emitGetDataListByPart() {
  useHisDataStoreHook().SET_BEGINTIME(beginTime2.value);
  useHisDataStoreHook().SET_ENDTIME(endTime2.value);
  setTimeout(() => {
    emit("getTableData");
  }, 500);
}

async function getPlatesList() {
  let { data } = await getHistoryWell({
    wellName,
    wellType
  });
  plateList.value = data;

  plate_checked.value = data[0].plateNum;
  useHisDataStoreHook().SET_PLATE(data[0].plateNum);

  let arr = [];
  data.forEach(item => {
    arr.push(item.plateNum);
  });
  plates_checked.value = arr;
  useHisDataStoreHook().SET_PLATES(arr);
}

onMounted(() => {
  wellName = useHisDataStoreHook().getWellName;
  wellType = useHisDataStoreHook().getWellType;
  plate_checked.value = useHisDataStoreHook().getPlate;
  plates_checked.value = useHisDataStoreHook().getPlates;
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

onBeforeUnmount(() => {
  useHisDataStoreHook().SET_PLATE("");
  useHisDataStoreHook().SET_PLATES([]);
  useHisDataStoreHook().SET_MIXED(0);
  useHisDataStoreHook().SET_BEGINTIME("");
  useHisDataStoreHook().SET_ENDTIME("");
});
/*
let dataList = [];
// 下载全部数据
function exportAll() {
  let title = `${wellName} - ${wellType} - `;
  if (mixed.value === 0) {
    title = title + `${plate_checked.value}`;
  } else {
    title = title + `${plates_checked.value.join(" / ")}`;
  }
  ElMessageBox.confirm(title, "下载全部数据", {
    confirmButtonText: "确定",
    cancelButtonText: "取消"
  })
    .then(() => {
      loading.value = true;
      getDataList(
        wellName,
        wellType,
        mixed.value,
        beginTime1.value,
        endTime1.value,
        "全部数据"
      );
    })
    .catch(() => {});
}
// 下载施工数据
function exportPart() {
  let title = `${wellName} - ${wellType} - `;
  if (mixed.value === 0) {
    title = title + `${plate_checked.value}`;
  } else {
    title = title + `${plates_checked.value.join(" / ")}`;
  }
  ElMessageBox.confirm(title, "下载施工数据", {
    confirmButtonText: "确定",
    cancelButtonText: "取消"
  })
    .then(() => {
      loading.value = true;
      getDataList(
        wellName,
        wellType,
        mixed.value,
        beginTime2.value,
        endTime2.value,
        "施工数据"
      );
    })
    .catch(() => {});
}

function getDataList(
  curr_wellName,
  curr_wellType,
  curr_mixed,
  curr_beginTime,
  curr_endTime,
  type = "全部数据"
) {
  dataList = [];
  let title = `${curr_wellName} - ${curr_wellType} - `;
  let equType = "双机车";

  if (curr_mixed === 0) {
    const curr_plate = plate_checked.value;
    title = title + `${curr_plate}`;
    getTruckList({
      pageNum: 1,
      pageSize: 1,
      plateNum: curr_plate
    }).then(res => {
      equType = res.data.records[0].equType;
    });
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
          exportExcel(dataList, title, equType, type);
        }
      }, 2000);
    });
  } else {
    const curr_plates = plates_checked.value.join(",");
    title = title + `${plates_checked.value.join(" / ")}`;
    getFixedHistoryReal({
      wellName: curr_wellName,
      wellType: curr_wellType,
      plateNums: curr_plates,
      beginTime: curr_beginTime,
      endTime: curr_endTime,
      pageNum: 1,
      pageSize: 500
    }).then(({ data }) => {
      const { pages } = data;
      let curr_pageNum = pages;
      getMoreFixedRecords(
        curr_wellName,
        curr_wellType,
        curr_plates,
        curr_beginTime,
        curr_endTime,
        curr_pageNum
      );

      const timer = setInterval(() => {
        if (curr_pageNum > 1) {
          curr_pageNum = curr_pageNum - 1;
          getMoreFixedRecords(
            curr_wellName,
            curr_wellType,
            curr_plates,
            curr_beginTime,
            curr_endTime,
            curr_pageNum
          );
        } else {
          clearInterval(timer);
          loading.value = false;
          exportExcel(dataList, title, "mixed", type);
        }
      }, 2000);
    });
  }
}
function getMoreRecords(
  curr_wellName,
  curr_wellType,
  curr_plate,
  curr_beginTime = "",
  curr_endTime = "",
  curr_pageNum
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
function getMoreFixedRecords(
  curr_wellName,
  curr_wellType,
  curr_plates,
  curr_beginTime = "",
  curr_endTime = "",
  curr_pageNum
) {
  getFixedHistoryReal({
    wellName: curr_wellName,
    wellType: curr_wellType,
    plateNums: curr_plates,
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
    key: item.key !== "time" ? `${prefix}${item.key}` : `${item.key}`,
    dataKey: item.key !== "time" ? `${prefix}${item.key}` : `${item.key}`,
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
  { key: "md", value: "混浆密度" },
  { key: "abyl", value: "A泵压力" },
  { key: "abll", value: "A泵瞬时排量" },
  { key: "qsll", value: "清水瞬时流量" },
  { key: "abdcll", value: "A泵泵替瞬时排量" },
  { key: "ablj", value: "A泵累计排量" },
  { key: "qslj", value: "清水累计排量" },
  { key: "abdclllj", value: "A泵泵替累计流量" }
];
const columns_data_2 = [
  { key: "time", value: "时间" },
  { key: "md", value: "混浆密度" },
  { key: "abyl", value: "A泵压力" },
  { key: "bbyl", value: "B泵压力" },
  { key: "abll", value: "A泵瞬时排量" },
  { key: "bbll", value: "B泵瞬时排量" },
  { key: "zssll", value: "双泵瞬时排量" },
  { key: "qsll", value: "清水瞬时流量" },
  { key: "abdcll", value: "A泵泵替瞬时排量" },
  { key: "bbdcll", value: "B泵泵替瞬时排量" },
  { key: "ablj", value: "A泵累计排量" },
  { key: "bblj", value: "B泵累计排量" },
  { key: "zlj", value: "双泵累计排量" },
  { key: "qslj", value: "清水累计排量" },
  { key: "abdclllj", value: "A泵泵替累计流量" },
  { key: "bbdclllj", value: "B泵泵替累计流量" }
];
const columns_data_3 = [
  { key: "time", value: "时间" },
  { key: "md", value: "混浆密度" },
  { key: "abyl", value: "A泵压力" },
  { key: "zssll", value: "A泵瞬时排量" },
  { key: "abdcll", value: "清水瞬时流量" },
  { key: "zlj", value: "A泵泵替瞬时排量" },
  { key: "abdclllj", value: "A泵累计排量" }
];
const columns_single = generateColumns(columns_data_1);
const columns_dual = generateColumns(columns_data_2);
const columns_mixed = generateColumns(columns_data_3);

function exportExcel(dataList, title, equType, type = "全部数据") {
  let columns;

  if (equType === "mixed") {
    columns = columns_mixed;
  } else if (equType === "单机车" || equType === "单机橇") {
    columns = columns_single;
  } else {
    columns = columns_dual;
  }
  var workBook = utils.book_new();

  const data = generateData(columns, dataList);
  const res: string[][] = data.map((curr_columns: DataItem) => {
    const arr = [];
    columns.forEach((column: Columns) => {
      arr.push(curr_columns[column.dataKey]);
    });
    return arr;
  });
  const titleList: string[] = [];
  columns.forEach((column: Columns) => {
    titleList.push(column.title);
  });
  res.unshift(titleList);
  const workSheet = utils.aoa_to_sheet(res);

  utils.book_append_sheet(workBook, workSheet, `数据报表`);

  writeFile(workBook, `${title} - ${type}.xlsx`);
}
*/
const planForm = ref<FormInstance>();
const uploadDialogVisible = ref(false);
const initialForm = {
  wellName: null,
  wellType: null,
  data: [
    {
      content: "注前置液",
      maxVal: 0,
      md: 0,
      minVal: 0,
      usages: 0
    },
    {
      content: "注领浆",
      maxVal: 0,
      md: 0,
      minVal: 0,
      usages: 0
    },
    {
      content: "注中间浆",
      maxVal: 0,
      md: 0,
      minVal: 0,
      usages: 0
    },
    {
      content: "注尾浆",
      maxVal: 0,
      md: 0,
      minVal: 0,
      usages: 0
    },
    {
      content: "替压塞液",
      maxVal: 0,
      md: 0,
      minVal: 0,
      usages: 0
    },
    {
      content: "替钻井液",
      maxVal: 0,
      md: 0,
      minVal: 0,
      usages: 0
    },
    {
      content: "替清水",
      maxVal: 0,
      md: 0,
      minVal: 0,
      usages: 0
    }
  ]
};
const uploadForm = ref(initialForm);
async function uploadPlan() {
  // 先去获取注替计划
  let { data } = await getPlanData(wellName, wellType);
  if (data.length > 0) {
    uploadForm.value.data = data;
  }
  uploadDialogVisible.value = true;
  uploadForm.value.wellName = wellName;
  uploadForm.value.wellType = wellType;
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  uploadForm.value = initialForm;
  uploadDialogVisible.value = false;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      setPlanData(
        uploadForm.value.wellName,
        uploadForm.value.wellType,
        uploadForm.value.data
      ).then(res => {
        if (res.data) {
          ElMessage({
            message: "设置成功",
            type: "success"
          });
          uploadForm.value = initialForm;
          uploadDialogVisible.value = false;
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

async function delPlan() {
  const { data } = await delPlanData(wellName, wellType);
  if (data > 0) {
    ElMessage({
      message: "删除成功",
      type: "success"
    });
    uploadForm.value = initialForm;
    uploadDialogVisible.value = false;
  }
}
</script>
<template>
  <div class="source-card">
    <el-card header="施工任务" :body-style="{ padding: '10px' }">
      <el-input v-model="task" readonly />
    </el-card>

    <el-card header="订阅方式" :body-style="{ padding: '10px' }">
      <el-form-item>
        <el-radio-group v-model="mixed" @change="onMixedChange">
          <el-radio :label="0">单机</el-radio>
          <el-radio :label="1" v-if="plateList.length > 1"> 合并 </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-card>

    <!-- 单选 -->
    <el-card
      header="设备编号"
      v-if="mixed === 0"
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

    <!-- 多选 -->
    <el-card
      header="设备编号"
      v-else-if="mixed === 1"
      :body-style="{ padding: '10px 15px' }"
    >
      <el-form-item>
        <el-checkbox-group v-model="plates_checked" :min="2">
          <el-checkbox
            v-for="item in plateList"
            :key="item.id"
            :label="item.plateNum"
          />
        </el-checkbox-group>
      </el-form-item>
    </el-card>

    <el-card style="flex-grow: 1" :body-style="{ padding: '10px' }">
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
        <!-- <el-tooltip content="下载全部数据" placement="top">
          <el-button
            type="default"
            :icon="useRenderIcon('download')"
            @click="exportAll"
            :loading="loading"
          />
        </el-tooltip> -->
        <el-tooltip content="上传注替计划" placement="top">
          <el-button
            type="default"
            :icon="useRenderIcon('upload')"
            @click="uploadPlan"
          />
        </el-tooltip>
      </div>
      <div style="margin-top: 5px; display: flex">
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
        <el-tooltip content="获取模拟数据" placement="bottom">
          <el-button
            type="default"
            :icon="useRenderIcon('lineChart')"
            @click="uploadPlan"
          />
        </el-tooltip>
        <!-- <el-tooltip content="下载施工数据" placement="bottom">
          <el-button
            type="default"
            :icon="useRenderIcon('download')"
            @click="exportPart"
            :loading="loading"
          />
        </el-tooltip> -->
      </div>
    </el-card>
  </div>
  <el-dialog
    v-model="uploadDialogVisible"
    title="设置注替计划"
    width="40%"
    draggable
    destroy-on-close
    center
  >
    <el-form ref="planForm" :model="uploadForm" label-width="90px">
      <el-form-item label="井号">
        <el-input v-model="uploadForm.wellName" readonly />
      </el-form-item>
      <el-form-item label="井类型">
        <el-input v-model="uploadForm.wellType" readonly />
      </el-form-item>
      <el-row :gutter="10" style="text-align: center; font-weight: 600">
        <el-col :span="4">操作内容</el-col>
        <el-col :span="5">用量</el-col>
        <el-col :span="5">密度</el-col>
        <el-col :span="5">排量区间下限</el-col>
        <el-col :span="5">排量区间上线</el-col>
      </el-row>
      <el-row
        :gutter="10"
        v-for="item in [0, 1, 2, 3, 4, 5, 6]"
        :key="item"
        style="margin-top: 10px"
      >
        <el-col :span="4">
          <el-input v-model="uploadForm.data[item].content" readonly />
        </el-col>
        <el-col :span="5">
          <el-input v-model="uploadForm.data[item].usages" />
        </el-col>
        <el-col :span="5">
          <el-input v-model="uploadForm.data[item].md" />
        </el-col>
        <el-col :span="5">
          <el-input v-model="uploadForm.data[item].minVal" />
        </el-col>
        <el-col :span="5">
          <el-input v-model="uploadForm.data[item].maxVal" />
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(planForm)">取消</el-button>
        <el-button type="danger" @click="delPlan"> 删除注替计划 </el-button>
        <el-button type="primary" @click="submitForm(planForm)">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
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
  }

  ::v-deep(.el-form-item) {
    margin-bottom: 0px;
  }

  ::v-deep(.el-input__inner) {
    text-align: center;
  }
}
</style>
