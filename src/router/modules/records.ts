import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const recordsRouter = {
  path: "/records",
  component: Layout,
  meta: {
    icon: "list",
    title: $t("menus.hsRecords"),
    rank: 7
  },
  children: [
    {
      path: "/records/index",
      name: "records",
      component: () => import("/@/views/records/index.vue"),
      meta: {
        title: $t("menus.hsRecords")
      }
    }
  ]
};

export default recordsRouter;
