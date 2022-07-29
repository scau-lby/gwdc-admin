// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

const permissionRouter = {
  path: "/permission",
  redirect: "/permission/page/index",
  meta: {
    title: "menus.hsPermission",
    icon: "lollipop",
    rank: 11
  },
  children: [
    {
      path: "/permission/page/index",
      name: "permissionPage",
      meta: {
        title: "menus.hsPermissionPage"
      }
    },
    {
      path: "/permission/button/index",
      name: "permissionButton",
      meta: {
        title: "menus.hsPermissionButton",
        authority: []
      }
    }
  ]
};

// 添加不同按钮权限到/permission/button页面中
function setDifAuthority(authority, routes) {
  routes.children[1].meta.authority = [authority];
  return routes;
}

export default [
  {
    url: "/getAsyncRoutes",
    method: "get",
    response: ({ query }) => {
      if (query.name === "admin") {
        return {
          code: 0,
          info: [setDifAuthority("v-admin", permissionRouter)]
        };
      } else {
        return {
          code: 0,
          info: [setDifAuthority("v-test", permissionRouter)]
        };
      }
    }
  }
] as MockMethod[];
