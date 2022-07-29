import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const organizationRouter = {
  path: "/organization",
  component: Layout,
  redirect: "/organization/user",
  meta: {
    icon: "menu",
    title: $t("menus.hsOrganization"),
    rank: 5
  },
  children: [
    {
      path: "/organization/user",
      name: "User",
      component: () => import("/@/views/organization/user/index.vue"),
      meta: {
        title: $t("menus.hsUser")
      }
    },
    {
      path: "/organization/group",
      name: "Group",
      component: () => import("/@/views/organization/group/index.vue"),
      meta: {
        title: $t("menus.hsGroup")
      }
    },
    {
      path: "/organization/department",
      name: "Department",
      component: () => import("/@/views/organization/department/index.vue"),
      meta: {
        title: $t("menus.hsDepartment")
      }
    }
  ]
};

export default organizationRouter;
