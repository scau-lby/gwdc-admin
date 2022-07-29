import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const resourceRouter = {
  path: "/resource",
  component: Layout,
  meta: {
    icon: "question-filled",
    title: $t("menus.hsResource"),
    rank: 9
  },
  children: [
    {
      path: "/resource/index",
      name: "resource",
      component: () => import("/@/views/resource/index.vue"),
      meta: {
        title: $t("menus.hsResource")
      }
    }
  ]
};

export default resourceRouter;
