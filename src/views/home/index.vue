<script lang="ts" setup>
import { reactive } from "vue";
import { HCard, HTable1, HTable2, HPie, HBar } from "./components";
defineOptions({
  name: "Home"
});
// 施工井表内容
let tableWellData = reactive([
  {
    show: true,
    address: "山西省朔州市",
    company: "西部钻井公司",
    wellNum: "高4-10-2H",
    truckPlate: "辽L30708 辽L30716",
    operator: "张** 李**",
    type: "油层"
  },
  {
    true: false,
    address: "山西省朔州市",
    company: "西部钻井公司",
    wellNum: "高4-10-2H",
    truckPlate: "辽L30708 辽L30716",
    operator: "张** 李**",
    type: "油层"
  },
  {
    true: true,
    address: "山西省朔州市",
    company: "西部钻井公司",
    wellNum: "高4-10-2H",
    truckPlate: "辽L30708 辽L30716",
    operator: "张** 李**",
    type: "油层"
  },
  {
    true: false,
    address: "山西省朔州市",
    company: "西部钻井公司",
    wellNum: "高4-10-2H",
    truckPlate: "辽L30708 辽L30716",
    operator: "张** 李**",
    type: "油层"
  },
  {
    true: false,
    address: "山西省朔州市",
    company: "西部钻井公司",
    wellNum: "高4-10-2H",
    truckPlate: "辽L30708 辽L30716",
    operator: "张** 李**",
    type: "油层"
  }
]);

// 在线设备表内容
let tableOTData = reactive([
  {
    danwei: "兴隆台项目部",
    address: "山西省朔州市"
  },
  {
    danwei: "四川项目部",
    address: "山西省朔州市"
  },
  {
    danwei: "兴隆台项目部",
    address: "山西省朔州市"
  },
  {
    danwei: "四川项目部",
    address: "山西省朔州市"
  },
  {
    danwei: "兴隆台项目部",
    address: "山西省朔州市"
  }
]);
</script>

<template>
  <div class="welcome">
    <HCard />
    <HTable1 :tableData="tableWellData" :total="7" />
    <HTable2 :tableData="tableOTData" :total="5" />
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <HPie />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <HBar />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped lang="scss"></style>
