import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const truckRouter = {
  path: "/truck",
  component: Layout,
  meta: {
    icon: "tools",
    title: $t("menus.hsTruck"),
    rank: 4
  },
  children: [
    {
      path: "/truck/index",
      name: "Truck",
      component: () => import("/@/views/truck/index.vue"),
      meta: {
        title: $t("menus.hsTruck")
      }
    }
  ]
};

export default truckRouter;
