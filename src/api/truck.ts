import { http } from "../utils/http";

interface ResponseType extends Promise<any> {
  data?: object;
  status?: number;
  message?: string;
}

// 获取设备列表
export const getTruckList = (params?: object): ResponseType => {
  return http.request("get", "/gjsnccj/truck/getlist", { params });
};

// 根据id获取设备信息
export const getTruckById = (id?: number): ResponseType => {
  return http.request("get", "/gjsnccj/truck/get", {
    params: {
      id
    }
  });
};

// 新增设备
export const addTruck = (data?: object): ResponseType => {
  return http.request("post", "/gjsnccj/truck/add", { data });
};

// 编辑设备
export const editTruck = (data?: object): ResponseType => {
  return http.request("post", "/gjsnccj/truck/update", { data });
};

// 删除设备
export const deleteTruck = (id: number): ResponseType => {
  return http.request("get", `/gjsnccj/truck/delete`, {
    params: {
      id
    }
  });
};
