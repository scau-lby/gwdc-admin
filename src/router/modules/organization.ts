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
        title: $t("menus.hsUser"),
        rid: 86,
        rids: [72, 70, 111, 82, 86, 64, 110, 81]
      }
    },
    {
      path: "/organization/group",
      name: "Group",
      component: () => import("/@/views/organization/group/index.vue"),
      meta: {
        title: $t("menus.hsGroup"),
        rid: 73,
        rids: [84, 69, 67, 76, 113, 80, 73, 78]
      }
    },
    {
      path: "/organization/department",
      name: "Department",
      component: () => import("/@/views/organization/department/index.vue"),
      meta: {
        title: $t("menus.hsDepartment"),
        rid: 71,
        rids: [68, 63, 108, 75, 71, 114, 109, 66]
      }
    }
  ]
};

export default organizationRouter;
