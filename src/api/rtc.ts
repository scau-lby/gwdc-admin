import { http } from "../utils/http";

interface ResponseType extends Promise<any> {
  data?: object;
  status?: number;
  message?: string;
}

// 登录
export const dismissRoom = (roomid?: string): ResponseType => {
  return http.request("get", `/rtc/index/test?roomid=${roomid}`);
};
