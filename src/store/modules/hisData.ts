import { defineStore } from "pinia";
import { store } from "/@/store";
import { HisDataType } from "./types";

export const useHisDataStore = defineStore({
  id: "gwdc-well",
  state: (): HisDataType => ({
    wellName: "",
    wellType: "",
    mixed: 0,
    plateNums: [],
    flag: "底盘",
    plateNum: "",
    beginTime: "",
    endTime: ""
  }),
  getters: {
    getWellName() {
      return this.wellName;
    },
    getWellType() {
      return this.wellType;
    },
    getMixed() {
      return this.mixed;
    },
    getPlateNums() {
      return this.plateNums;
    },
    getFlag() {
      return this.flag;
    },
    getPlateNum() {
      return this.plateNum;
    },
    getBeginTime() {
      return this.beginTime;
    },
    getEndTime() {
      return this.endTime;
    }
  },
  actions: {
    SET_WELLNAME(value) {
      this.wellName = value;
    },
    SET_WELLTYPE(value) {
      this.wellType = value;
    },
    SET_MIXED(value) {
      this.mixed = value;
    },
    SET_PLATENUMS(value) {
      this.plateNums = value;
    },
    SET_FLAG(value) {
      this.flag = value;
    },
    SET_PLATENUM(value) {
      this.plateNum = value;
    },
    SET_BEGINTIME(value) {
      this.beginTime = value;
    },
    SET_ENDTIME(value) {
      this.endTime = value;
    }
  }
});

export function useHisDataStoreHook() {
  return useHisDataStore(store);
}
