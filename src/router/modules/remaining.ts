import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const remainingRouter = [
  {
    path: "/login",
    name: "login",
    component: () => import("/@/views/login/index.vue"),
    meta: {
      title: $t("menus.hsLogin"),
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/invite",
    name: "invite",
    component: () => import("/@/views/invite/index.vue"),
    meta: {
      title: $t("menus.hsInvite"),
      showLink: false,
      rank: 102
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      icon: "home-filled",
      title: $t("menus.hsHome"),
      showLink: false,
      rank: 104
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "redirect",
        component: () => import("/@/layout/redirect.vue")
      }
    ]
  }
];

export default remainingRouter;
