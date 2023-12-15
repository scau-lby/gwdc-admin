import { http } from "../utils/http";

interface ResponseType extends Promise<any> {
  data?: object;
  status?: number;
  message?: string;
}

// 获取设备列表
export const getTruckList = (params?: object): ResponseType => {
  return http.request("get", "/api/gjsnccj/truck/getlist", { params });
};

// 根据id获取设备信息
export const getTruckById = (id?: number): ResponseType => {
  return http.request("get", "/api/gjsnccj/truck/get", {
    params: {
      id
    }
  });
};

// 新增设备
export const addTruck = (data?: object): ResponseType => {
  return http.request("post", "/api/gjsnccj/truck/add", { data });
};

// 编辑设备
export const updateTruck = (data?: object): ResponseType => {
  return http.request("post", "/api/gjsnccj/truck/update", { data });
};

// 删除设备
export const deleteTruck = (id: number): ResponseType => {
  return http.request("get", `/api/gjsnccj/truck/delete`, {
    params: {
      id
    }
  });
};

// 获取在线设备
export const getOnlineTruckList = (params?: object): ResponseType => {
  return http.request("get", "/api/gjsnccj/truck/getonline", { params });
};

// 获取首页概述信息
export const getPreview = (offset: number): ResponseType => {
  return http.request("get", `/api/gjsnccj/truck/getpreview?offset=${offset}`);
};
