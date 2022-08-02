import { http } from "../utils/http";
import { getToken } from "../utils/auth";

interface ResponseType extends Promise<any> {
  data?: object;
  status?: number;
  message?: string;
}

// 获取车辆设备列表
export const getTruckList = (data: object): ResponseType => {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.GetTruckList",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 车辆设备列表信息(虚拟机构)
export const getTruckVirList = (data: object): ResponseType => {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.GetTruckVirList",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 新增车辆设备
export const addNewTruck = (data: object): ResponseType => {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.AddNewTruck",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 编辑车辆设备
export const editTruck = (data: object): ResponseType => {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.EditTruck",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 新增车辆设备(导入)
export const importNewTruck = (data: object): ResponseType => {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.ImportNewTruck",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 车辆设备列表导出
export const exportTruckList = (data: object): ResponseType => {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.ExportTruckList",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 删除车辆设备
export const deleteTruckFromPlate = (data: object): ResponseType => {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.DeleteTruckFromPlate",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};
