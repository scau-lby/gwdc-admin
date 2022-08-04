import { http } from "../utils/http";
import { getToken } from "../utils/auth";

interface ResponseType extends Promise<any> {
  data?: object;
  status?: number;
  message?: string;
}

// 获取用户列表
export const getUserList = (params?: object): ResponseType => {
  return http.request("get", "/gjsnccj/users/list", { params });
};

// 根据id获取用户信息
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
export const resetPwd = (params?: object): ResponseType => {
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
export const deleteUser = (data: object): ResponseType => {
  return http.request("post", "/gjsnccj/users/delete", { data });
};

// 用户绑定分组
export const userBindGroup = (data: object): ResponseType => {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.UserBindGroup",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 获取用户组列表
export const getGroupList = (data: object): ResponseType => {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.GetGroupList",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 新增用户组
export const addGroup = (data: object): ResponseType => {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.AddNewGroup",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 删除用户组
export const deleteGroup = (data: object): ResponseType => {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.DeleteGroup",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 分组绑定权限
export function groupBindToken(data: object) {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.GroupBindToken",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
}

// 获取分组的权限列表
export function getGroupToken(data: object) {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.GetGroupToken",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
}

// 获取权限树
export function getTokenTree(data: object) {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.GetTokenTree",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
}

// 获取组织机构列表
export const getOrgList = (data: object): ResponseType => {
  return http.request("get", "/gjsnccj/org/getlist", { data });
};

// 新增机构
export const addOrg = (data: object): ResponseType => {
  return http.request("post", "/gjsnccj/org/add", { data });
};

// 编辑机构
export const editOrg = (params: object): ResponseType => {
  return http.request("get", "/gjsnccj/org/update", { params });
};

// 删除机构
export const deleteOrg = (params: object): ResponseType => {
  return http.request("get", "/gjsnccj/org/delete", { params });
};

// 根据名称获取机构信息
export const getOrgByName = (orgName: string): ResponseType => {
  return http.request("get", "/gjsnccj/org/get", {
    params: {
      orgName
    }
  });
};

// 设备授权
export const addVirToken = (data: object): ResponseType => {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.AddVirToken",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};

// 取消设备授权
export const delVirToken = (data: object): ResponseType => {
  const token = getToken();
  let accessToken = "";
  if (token) {
    accessToken = JSON.parse(token).accessToken;
  }

  data = Object.assign(data, {
    method: "sncj.DelVirToken",
    token: accessToken,
    timestamp: new Date().getTime()
  });
  return http.request("post", "/gjsnccj/openapi", { data });
};
