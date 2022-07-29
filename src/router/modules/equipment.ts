import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const equipmentRouter = {
  path: "/equipment",
  component: Layout,
  meta: {
    icon: "tools",
    title: $t("menus.hsEquipment"),
    rank: 4
  },
  children: [
    {
      path: "/equipment/index",
      name: "equipment",
      component: () => import("/@/views/equipment/index.vue"),
      meta: {
        title: $t("menus.hsEquipment")
      }
    }
  ]
};

export default equipmentRouter;
