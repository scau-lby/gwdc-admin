import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const realtimeRouter = {
  path: "/realtime",
  component: Layout,
  meta: {
    icon: "platform",
    title: $t("menus.hsRealtime"),
    rank: 1
  },
  children: [
    {
      path: "/realtime/index",
      name: "Realtime",
      component: () => import("/@/views/realtime/index.vue"),
      meta: {
        title: $t("menus.hsRealtime")
      }
    }
  ]
};

export default realtimeRouter;
