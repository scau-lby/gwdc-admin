import { http } from "../utils/http";

interface ResponseType extends Promise<any> {
  data?: object;
  status?: number;
  message?: string;
}

// 机构-获取组织机构列表
export const getOrgList = (data?: object): ResponseType => {
  return http.request("get", "/gjsnccj/org/getlist", { data });
};

// 机构-新增机构
export const addOrg = (data: object): ResponseType => {
  return http.request("post", "/gjsnccj/org/add", { data });
};

// 机构-编辑机构
export const updateOrg = (params: object): ResponseType => {
  return http.request("get", "/gjsnccj/org/update", { params });
};

// 机构-删除机构
export const deleteOrg = (orgId: number): ResponseType => {
  return http.request("get", "/gjsnccj/org/delete", {
    params: {
      orgId
    }
  });
};

// 机构-获取机构信息
export const getOrgByName = (orgName: string): ResponseType => {
  return http.request("get", "/gjsnccj/org/get", {
    params: {
      orgName
    }
  });
};

// 机构-获取车辆授权
export const getOrgPermit = (orgId: number): ResponseType => {
  return http.request(
    "post",
    "/gjsnccj/org/getOrgPermit",
    {},
    {
      params: {
        orgId
      }
    }
  );
};

// 机构-设置车辆授权
export const setOrgPermit = (
  orgId: number,
  plate_nums: string
): ResponseType => {
  return http.request(
    "post",
    "/gjsnccj/org/setOrgPermit",
    {},
    {
      params: {
        orgId,
        plate_nums
      }
    }
  );
};

// 机构-删除车辆授权
export const delOrgPermit = (orgId: number): ResponseType => {
  return http.request(
    "post",
    "/gjsnccj/org/delOrgPermit",
    {},
    {
      params: {
        orgId
      }
    }
  );
};
