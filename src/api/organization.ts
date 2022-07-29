import { http } from "../utils/http";
import { getToken } from "../utils/auth";

interface ResponseType extends Promise<any> {
  data?: object;
  code?: number;
  msg?: string;
}

// 获取用户管理列表
export const getUserList = (data?: object): ResponseType => {
  const token = JSON.parse(getToken());
  data = Object.assign(data, {
    method: "sncj.GetUserList",
    token: token.accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 新增用户
export const addUser = (data?: object): ResponseType => {
  const token = JSON.parse(getToken());
  data = Object.assign(data, {
    method: "sncj.AddNewUser",
    token: token.accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 设置用户密码
export const setPwd = (data?: object): ResponseType => {
  const token = JSON.parse(getToken());
  data = Object.assign(data, {
    method: "sncj.SetPasswd",
    token: token.accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 删除用户
export const deleteUser = (data?: object): ResponseType => {
  const token = JSON.parse(getToken());
  data = Object.assign(data, {
    method: "sncj.DeleteUser",
    token: token.accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 获取用户组列表
export const getGroupList = (data?: object): ResponseType => {
  const token = JSON.parse(getToken());
  data = Object.assign(data, {
    method: "sncj.GetGroupList",
    token: token.accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 获取组织机构列表
export const getOrgList = (data?: object): ResponseType => {
  const token = JSON.parse(getToken());
  data = Object.assign(data, {
    method: "sncj.GetOrgList",
    token: token.accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 获取组织机构树
export const getOrgTree = (data?: object): ResponseType => {
  const token = JSON.parse(getToken());
  data = Object.assign(data, {
    method: "sncj.GetOrgTree",
    token: token.accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 删除机构
export const deleteOrg = (data?: object): ResponseType => {
  const token = JSON.parse(getToken());
  data = Object.assign(data, {
    method: "sncj.DeleteOrg",
    token: token.accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 新增机构
export const addOrg = (data?: object): ResponseType => {
  const token = JSON.parse(getToken());
  data = Object.assign(data, {
    method: "sncj.AddOrgName",
    token: token.accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};
