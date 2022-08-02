import { http } from "../utils/http";

interface userType extends Promise<any> {
  svg?: string;
  code?: number;
  info?: object;
}

// 获取验证码
export const getVerify = (): userType => {
  return http.request("get", "/captcha");
};

// 登录
export const userLogin = (data?: object) => {
  return http.request("post", "/gjsnccj/login", { data });
};

// 刷新token
export const refreshToken = (data: object) => {
  return http.request("post", "/refreshToken", { data });
};

// export const searchVague = (data: object) => {
//   return http.request("post", "/searchVague", { data });
// };

// 用户注销
export const logout = (data?: object) => {
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 用户重置密码
export const changePwd = (data?: object) => {
  return http.request(
    "post",
    "/gjsnccj/users/changepwd",
    {},
    {
      params: data
    }
  );
};
