import { http } from "../utils/http";

interface ResponseType extends Promise<any> {
  data?: object;
  status?: number;
  message?: string;
}

// 获取实时预览地址
export const getPreviewUrlByPlatenums = (params?: object): ResponseType => {
  return http.request(
    "post",
    "/gjsnccj/video/getpreviewUrlByPlatenums",
    {},
    { params }
  );
};

// 获取回放视频地址
export const getPlayBackUrlByPlatenum = (params?: object): ResponseType => {
  return http.request(
    "post",
    "/gjsnccj/video/getplayBackUrlByPlatenum",
    {},
    { params }
  );
};
