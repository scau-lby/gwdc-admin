import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const homeRouter = {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/welcome",
  meta: {
    icon: "home-filled",
    title: $t("menus.hsHome"),
    rank: 0
  },
  children: [
    {
      path: "/welcome",
      name: "Welcome",
      component: () => import("/@/views/home/index.vue"),
      meta: {
        title: $t("menus.hsHome")
      }
    }
  ]
};

export default homeRouter;
