import { http } from "../utils/http";

interface ResponseType extends Promise<any> {
  data?: object;
  status?: number;
  message?: string;
}

// 获取设备列表
export const getpreviewUrlByPlatenums = (params?: object): ResponseType => {
  return http.request(
    "post",
    "/gjsnccj/video/getpreviewUrlByPlatenums",
    {},
    { params }
  );
};
