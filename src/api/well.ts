import { http } from "../utils/http";

interface ResponseType extends Promise<any> {
  data?: object;
  status?: number;
  message?: string;
}

// 口井-获取口井列表
export const getWellList = (params?: object): ResponseType => {
  return http.request("get", "/api/gjsnccj/well/get", { params });
};

// 口井-添加收藏
export const addFavorite = (
  wellName: string,
  wellType: string
): ResponseType => {
  return http.request(
    "post",
    `/api/gjsnccj/well/addfavorite`,
    {},
    {
      params: {
        wellName,
        wellType
      }
    }
  );
};

// 口井-删除收藏项目
export const delFavorite = (
  wellName: string,
  wellType: string
): ResponseType => {
  return http.request(
    "post",
    `/api/gjsnccj/well/delfavorite`,
    {},
    {
      params: {
        wellName,
        wellType
      }
    }
  );
};

// 口井-设置是否推送数据
export const setWellPush = (
  wellName: string,
  wellType: string,
  push: number
): ResponseType => {
  return http.request(
    "post",
    `/api/gjsnccj/well/setpush`,
    {},
    {
      params: {
        wellName,
        wellType,
        push
      }
    }
  );
};

// 口井-获取实时的施工详情数据
export const getWellMoreInfo = (wellName: string): ResponseType => {
  return http.request("get", `/api/gjsnccj/well/moreinfo`, {
    params: {
      wellName
    }
  });
};

// 口井-更新口井信息
export const updateWell = (data: object): ResponseType => {
  return http.request("post", `/api/gjsnccj/well/update`, { data });
};

// 口井-获取口井历史实时数据
export const getHistoryReal = (params: object): ResponseType => {
  return http.request("get", `/api/gjsnccj/well/gethistoryreal`, { params });
};

// 口井-查询口井历史实时数据（多车混合）
export const getFixedHistoryReal = (params: object): ResponseType => {
  return http.request("get", `/api/gjsnccj/well/getfixedHistoryReal`, {
    params
  });
};

// 上传注替计划
export const setPlanData = (
  wellName: string,
  wellType: string,
  data: object
): ResponseType => {
  return http.request(
    "post",
    `/api/gjsnccj/well/setPlanData`,
    { data },
    {
      params: {
        wellName,
        wellType
      }
    }
  );
};

// 获取注替计划
export const getPlanData = (
  wellName: string,
  wellType: string
): ResponseType => {
  return http.request(
    "post",
    `/api/gjsnccj/well/getPlanData`,
    {},
    {
      params: {
        wellName,
        wellType
      }
    }
  );
};

// 删除注替计划
export const delPlanData = (
  wellName: string,
  wellType: string
): ResponseType => {
  return http.request(
    "post",
    `/api/gjsnccj/well/delPlanData`,
    {},
    {
      params: {
        wellName,
        wellType
      }
    }
  );
};

// 获取注替计划模拟数据
export const getPlanSimulate = (
  wellName: string,
  wellType: string,
  beginTime: string
): ResponseType => {
  return http.request(
    "post",
    `/api/gjsnccj/well/getPlanSimulate`,
    {},
    {
      params: {
        wellName,
        wellType,
        beginTime
      }
    }
  );
};

// 获取注替计划模拟数据
export const getPlanSimulateByStep = (
  wellName: string,
  wellType: string,
  beginTime: string,
  content: string
): ResponseType => {
  return http.request(
    "post",
    `/api/gjsnccj/well/getPlanSimulateByStep`,
    {},
    {
      params: {
        wellName,
        wellType,
        beginTime,
        content
      }
    }
  );
};
