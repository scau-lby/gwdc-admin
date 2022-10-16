import { http } from "../utils/http";

interface ResponseType extends Promise<any> {
  data?: object;
  status?: number;
  message?: string;
}

// 获取用户列表
export const getWellList = (params?: object): ResponseType => {
  return http.request("get", "/gjsnccj/well/get", { params });
};

// 口井-添加收藏
export const addFavorite = (id: number): ResponseType => {
  return http.request(
    "post",
    `/gjsnccj/well/addfavorite`,
    {},
    {
      params: {
        id
      }
    }
  );
};

// 口井-删除收藏项目
export const delFavorite = (id: number): ResponseType => {
  return http.request(
    "post",
    `/gjsnccj/well/delfavorite`,
    {},
    {
      params: {
        id
      }
    }
  );
};

// 口井-设置是否推送数据
export const setPush = (id: number, push: number): ResponseType => {
  return http.request(
    "post",
    `/gjsnccj/well/setpush`,
    {},
    {
      params: {
        id,
        push
      }
    }
  );
};

// 口井-获取实时的施工详情数据
export const getMoreInfo = (wellName: string): ResponseType => {
  return http.request("get", `/gjsnccj/well/moreinfo`, {
    params: {
      wellName
    }
  });
};

// 口井-更新口井信息
export const updateWell = (data: object): ResponseType => {
  return http.request("post", `/gjsnccj/well/update`, { data });
};
