import { http } from "../utils/http";

interface ResponseType extends Promise<any> {
  data?: object;
  status?: number;
  message?: string;
}

// 登录
export const userLogin = (data?: object): ResponseType => {
  return http.request("post", "/gjsnccj/login", { data });
};

// 刷新token
export const refreshToken = (data: object): ResponseType => {
  return http.request("post", "/refreshToken", { data });
};

// 用户重置密码
export const changeUserPwd = (data?: object): ResponseType => {
  return http.request(
    "post",
    "/gjsnccj/users/changepwd",
    {},
    {
      params: data
    }
  );
};

// 获取用户列表
export const getUserList = (params?: object): ResponseType => {
  return http.request("get", "/gjsnccj/users/list", { params });
};

// 用户-通过id查询用户
export const getUserById = (id?: number): ResponseType => {
  return http.request("get", "/gjsnccj/users/get", {
    params: {
      id
    }
  });
};

// 新增用户
export const addUser = (data: object): ResponseType => {
  return http.request("post", "/gjsnccj/users/add", { data });
};

// 编辑用户
export const updateUser = (data: object): ResponseType => {
  return http.request("post", "/gjsnccj/users/update", { data });
};

// 管理员重置用户密码
export const setUserPwd = (params?: object): ResponseType => {
  return http.request(
    "post",
    "/gjsnccj/users/setpasswd",
    {},
    {
      params
    }
  );
};

// 删除用户
export const deleteUser = (userId: number): ResponseType => {
  return http.request(
    "post",
    "/gjsnccj/users/delete",
    {},
    {
      params: {
        userId
      }
    }
  );
};

// 用户-设置分组
export const setUserToken = (userId: number, gids: string): ResponseType => {
  return http.request("post", `/gjsnccj/users/setToken?userId=${userId}`, {
    params: {
      userId,
      gids
    }
  });
};
