import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const historicalRouter = {
  path: "/historical",
  component: Layout,
  meta: {
    icon: "histogram",
    title: $t("menus.hsHistorical"),
    rank: 2
  },
  children: [
    {
      path: "/historical/index",
      name: "historical",
      component: () => import("/@/views/historical/index.vue"),
      meta: {
        title: $t("menus.hsHistorical")
      }
    }
  ]
};

export default historicalRouter;
