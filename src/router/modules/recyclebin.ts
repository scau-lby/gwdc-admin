import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const recyclebinRouter = {
  path: "/recyclebin",
  component: Layout,
  meta: {
    icon: "delete-filled",
    title: $t("menus.hsRecyclebin"),
    rank: 6
  },
  children: [
    {
      path: "/recyclebin/index",
      name: "recyclebin",
      component: () => import("/@/views/recyclebin/index.vue"),
      meta: {
        title: $t("menus.hsRecyclebin")
      }
    }
  ]
};

export default recyclebinRouter;
