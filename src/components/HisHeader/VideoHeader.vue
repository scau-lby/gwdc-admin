<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
// store
import { useHisDataStoreHook } from "/@/store/modules/hisData";
// api
import { getHistoryWell, getHistoryList } from "/@/api/history";
import { getHistoryReal } from "/@/api/well";
import { getPlayBackUrlByPlatenum } from "/@/api/video";

defineOptions({
  name: "videoHeader"
});

let wellName = "",
  wellType = "",
  task = ref(""),
  plateList = ref([]),
  plates_checked = ref("");

const state = ref(1),
  urls = ref([]);

async function playbackStart() {
  let { data } = await getPlayBackUrlByPlatenum({
    beginTime: beginTime.value,
    endTime: endTime.value,
    wellName,
    wellType,
    // plateNum: plates_checked.value
    plateNum: "Camera 01"
  });
  urls.value = data;
  state.value = 2;
}

function playbackPause() {
  state.value = 3;
}

function playbackResume() {
  state.value = 2;
}

function stopPlay() {
  state.value = 1;
}

const beginTime = ref(null),
  endTime = ref(null);

function onPlateChange(value) {
  useHisDataStoreHook().SET_PLATE(value);
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

function formatDateTime(datetimeStr) {
  return (
    datetimeStr.slice(0, 4) +
    "-" +
    datetimeStr.slice(4, 6) +
    "-" +
    datetimeStr.slice(6, 8) +
    " " +
    datetimeStr.slice(8, 10) +
    ":" +
    datetimeStr.slice(10, 12) +
    ":" +
    datetimeStr.slice(12, 14)
  );
}

async function getTimeRange() {
  let { data: data1 } = await getHistoryReal({
    pageNum: 1,
    pageSize: 1,
    plateNum: plates_checked.value,
    wellName,
    wellType
  });
  beginTime.value = formatDateTime(data1.records[0].sj);
  let { data: data2 } = await getHistoryReal({
    pageNum: data1.pages,
    pageSize: 1,
    plateNum: plates_checked.value,
    wellName,
    wellType
  });
  endTime.value = formatDateTime(data2.records[0].sj);
}

async function getPlateList() {
  let { data } = await getHistoryWell({
    wellName,
    wellType
  });
  plateList.value = data;
  plates_checked.value = data[0].plateNum;
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
      getPlateList();
    });
  } else {
    task.value = wellName + " @ " + wellType;
    getPlateList();
  }
});
</script>
<template>
  <div class="source-card">
    <el-card header="施工任务" :body-style="{ padding: '10px 15px' }">
      <el-input v-model="task" readonly />
    </el-card>
    <el-card
      header="设备编号"
      :body-style="{ padding: '10px 15px' }"
      style="min-width: 240px"
    >
      <el-radio-group v-model="plates_checked" @change="onPlateChange">
        <el-radio
          v-for="item in plateList"
          :key="item.id"
          :label="item.plateNum"
        />
      </el-radio-group>
    </el-card>

    <el-card style="flex-grow: 1" :body-style="{ padding: '10px 15px' }">
      <el-row :gutter="10">
        <el-col :span="9">
          <el-form-item label="记录开始时间">
            <el-date-picker
              v-model="beginTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              readonly
            />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="记录结束时间">
            <el-date-picker
              v-model="endTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              readonly
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button
            type="default"
            :icon="useRenderIcon('video-play')"
            v-if="state === 1"
            @click="playbackStart"
          >
            开始回放
          </el-button>
          <template v-else-if="state === 2">
            <el-button
              type="default"
              :icon="useRenderIcon('video-pause')"
              @click="playbackPause"
            >
              暂停
            </el-button>
            <el-button
              type="default"
              :icon="useRenderIcon('video-stop')"
              @click="stopPlay"
            >
              停止回放
            </el-button>
          </template>
          <el-button
            type="default"
            :icon="useRenderIcon('video-play')"
            v-else-if="state === 3"
            @click="playbackResume"
          >
            恢复
          </el-button>
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
