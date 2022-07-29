import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const reportsRouter = {
  path: "/reports",
  component: Layout,
  meta: {
    icon: "trend-charts",
    title: $t("menus.hsReports"),
    rank: 8
  },
  children: [
    {
      path: "/reports/index",
      name: "reports",
      component: () => import("/@/views/reports/index.vue"),
      meta: {
        title: $t("menus.hsReports")
      }
    }
  ]
};

export default reportsRouter;
