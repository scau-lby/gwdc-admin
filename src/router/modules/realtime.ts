import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const realtimeRouter = {
  path: "/realtime",
  component: Layout,
  redirect: "/organization/data",
  meta: {
    icon: "platform",
    title: $t("menus.hsRealtime"),
    rank: 1
  },
  children: [
    {
      path: "/realtime/data",
      name: "LiveData",
      component: () => import("/@/views/realtime/data/index.vue"),
      meta: {
        title: $t("menus.hsLiveData")
      }
    },
    {
      path: "/realtime/monitor",
      name: "Monitor",
      component: () => import("/@/views/realtime/monitor/index.vue"),
      meta: {
        title: $t("menus.hsLiveMonitor")
      }
    },
    {
      path: "/realtime/power",
      name: "Power",
      component: () => import("/@/views/realtime/power/index.vue"),
      meta: {
        title: $t("menus.hsLivePower")
      }
    }
  ]
};

export default realtimeRouter;
