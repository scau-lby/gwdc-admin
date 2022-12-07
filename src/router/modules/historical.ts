import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const historicalRouter = {
  path: "/historical",
  component: Layout,
  redirect: "/organization/nav",
  meta: {
    icon: "histogram",
    title: $t("menus.hsHistorical"),
    rank: 2
  },
  children: [
    {
      path: "/historical/nav",
      name: "HisNav",
      component: () => import("/@/views/historical/nav/index.vue"),
      meta: {
        title: $t("menus.hsHisNavigation")
      }
    },
    {
      path: "/historical/statistics",
      name: "HisStatistics",
      component: () => import("/@/views/historical/statistics/index.vue"),
      meta: {
        title: $t("menus.hsHisStatistics")
      }
    },
    // {
    //   path: "/historical/data",
    //   name: "HisData",
    //   component: () => import("/@/views/historical/data/index.vue"),
    //   meta: {
    //     title: $t("menus.hsHisData")
    //   }
    // },
    {
      path: "/historical/video",
      name: "Video",
      component: () => import("/@/views/historical/video/index.vue"),
      meta: {
        title: $t("menus.hsHisVideo")
      }
    },
    {
      path: "/historical/power",
      name: "HisPower",
      component: () => import("/@/views/historical/power/index.vue"),
      meta: {
        title: $t("menus.hsHisPower")
      }
    }
  ]
};

export default historicalRouter;
