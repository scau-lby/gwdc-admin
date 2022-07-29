import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const trainingRouter = {
  path: "/training",
  component: Layout,
  meta: {
    icon: "management",
    title: $t("menus.hsTraining"),
    rank: 3
  },
  children: [
    {
      path: "/training/index",
      name: "training",
      component: () => import("/@/views/training/index.vue"),
      meta: {
        title: $t("menus.hsTraining")
      }
    }
  ]
};

export default trainingRouter;
