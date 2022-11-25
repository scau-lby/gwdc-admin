import { http } from "../utils/http";

interface ResponseType extends Promise<any> {
  data?: object;
  status?: number;
  message?: string;
}

// 口井-获取历史口井列表
export const getHistoryList = (params?: object): ResponseType => {
  return http.request("get", "/gjsnccj/history/get", { params });
};

// 口井-获取历史口井列表
export const getHistoryWell = (params?: object): ResponseType => {
  return http.request("get", "/gjsnccj/history/getWell", { params });
};

// 口井-编辑历史口井列表
export const updateHistoryWell = (data?: object): ResponseType => {
  return http.request("post", "/gjsnccj/history/update", { data });
};

// 口井-删除历史口井列表
export const deleteHistoryByWellId = (wellId?: number): ResponseType => {
  return http.request("post", "/gjsnccj/history/delete", {
    params: {
      wellId
    }
  });
};
