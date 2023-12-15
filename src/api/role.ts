import { http } from "../utils/http";

interface ResponseType extends Promise<any> {
  data?: object;
  status?: number;
  message?: string;
}

// 获取用户组列表
export const getRoleList = (params: object): ResponseType => {
  return http.request("get", "/api/gjsnccj/roles/roleList", { params });
};

// 新增用户组
export const addRole = (data: object): ResponseType => {
  return http.request("post", "/api/gjsnccj/roles/add", { data });
};

// 编辑用户组
export const editRole = (data: object): ResponseType => {
  return http.request("post", "/api/gjsnccj/roles/edit", { data });
};

// 删除用户组
export const deleteRole = (gid: number): ResponseType => {
  return http.request("get", "/api/gjsnccj/roles/delete", {
    params: {
      gid
    }
  });
};

// 角色-查看权限列表
export const getRightList = (): ResponseType => {
  return http.request("get", "/api/gjsnccj/roles/rightList");
};

// 角色- 保存角色权限
export const saveRoleRights = (gid: number, rids: string): ResponseType => {
  return http.request(
    "post",
    "/api/gjsnccj/roles/saveRoleRights",
    {},
    {
      params: {
        gid,
        rids
      }
    }
  );
};

// 角色- 获取角色权限
export const getRoleRights = (gid: number): ResponseType => {
  return http.request("get", "/api/gjsnccj/roles/getRoleRights", {
    params: { gid }
  });
};
