import { isUrl } from "/@/utils/is";
import { getConfig } from "/@/config";
import { toRouteType } from "./types";
import { openLink } from "/@/utils/link";
import NProgress from "/@/utils/progress";
import { findIndex } from "lodash-unified";
import { transformI18n } from "/@/plugins/i18n";
import { storageSession } from "/@/utils/storage";
import { buildHierarchyTree } from "/@/utils/tree";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import {
  Router,
  createRouter,
  RouteRecordRaw,
  RouteComponent
} from "vue-router";
import {
  ascending,
  getHistoryMode,
  findRouteByPath,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes
} from "./utils";

import homeRouter from "./modules/home"; // 首页
import remainingRouter from "./modules/remaining"; // 登录
import realtimeRouter from "./modules/realtime"; // 实时监控
import historicalRouter from "./modules/historical"; // 历史数据
import trainingRouter from "./modules/training"; // 培训管理
import truckRouter from "./modules/truck"; // 设备管理
import organizationRouter from "./modules/organization"; // 组织与角色
import recyclebinRouter from "./modules/recyclebin"; // 回收站
import recordsRouter from "./modules/records"; // 操作记录
import reportsRouter from "./modules/reports"; // 统计报表
import resourceRouter from "./modules/resource"; // 帮助与资源

// 原始静态路由（未做任何处理）
export const routes = [
  homeRouter,
  realtimeRouter,
  historicalRouter,
  trainingRouter,
  truckRouter,
  organizationRouter,
  recyclebinRouter,
  recordsRouter,
  reportsRouter,
  resourceRouter
];

// 导出处理后的静态路由（三级及以上的路由全部拍成二级）
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes)))
);

// 用于渲染菜单，保持原始层级
export const constantMenus: Array<RouteComponent> = ascending(routes).concat(
  ...remainingRouter
);

// 不参与菜单的路由
export const remainingPaths = Object.keys(remainingRouter).map(v => {
  return remainingRouter[v].path;
});

// 创建路由实例
export const router: Router = createRouter({
  history: getHistoryMode(),
  routes: constantRoutes.concat(...remainingRouter),
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  }
});

// 路由白名单
const whiteList = ["/login", "/invite"];

// 路由前置守卫
router.beforeEach((to: toRouteType, _from, next) => {
  if (to.meta?.keepAlive) {
    const newMatched = to.matched;
    handleAliveRoute(newMatched, "add");
    // 页面整体刷新和点击标签页刷新
    if (_from.name === undefined || _from.name === "redirect") {
      handleAliveRoute(newMatched);
    }
  }
  const name = storageSession.getItem("authorized-token");
  NProgress.start();
  const externalLink = isUrl(to?.name);
  if (!externalLink)
    to.matched.some(item => {
      if (!item.meta.title) return "";
      const Title = getConfig().Title;
      if (Title)
        document.title = `${transformI18n(item.meta.title)} | ${Title}`;
      else document.title = transformI18n(item.meta.title);
    });

  if (name) {
    if (_from?.name) {
      // name为超链接
      if (externalLink) {
        openLink(to?.name);
        NProgress.done();
      } else {
        next();
      }
    } else {
      // 刷新
      if (usePermissionStoreHook().wholeMenus.length === 0)
        usePermissionStoreHook().changeSetting([]);
      if (!useMultiTagsStoreHook().getMultiTagsCache) {
        const { path } = to;
        const index = findIndex(remainingRouter, v => {
          return v.path == path;
        });
        const routes: any =
          index === -1
            ? router.options.routes[0].children
            : router.options.routes;
        const route = findRouteByPath(path, routes);
        // query、params模式路由传参数的标签页不在此处处理
        if (route && route.meta?.title) {
          useMultiTagsStoreHook().handleTags("push", {
            path: route.path,
            name: route.name,
            meta: route.meta
          });
        }
      }

      next();
    }
  } else {
    if (to.path !== "/login") {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next({ path: "/login" });
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
