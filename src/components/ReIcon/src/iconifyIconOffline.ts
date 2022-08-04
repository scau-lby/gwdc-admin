import { h, defineComponent } from "vue";
import { Icon as IconifyIcon, addIcon } from "@iconify/vue/dist/offline";

// element-plus icon
import Check from "@iconify-icons/ep/check";
import Document from "@iconify-icons/ep/document";
import Setting from "@iconify-icons/ep/setting";
import Lollipop from "@iconify-icons/ep/lollipop";
import RefreshRight from "@iconify-icons/ep/refresh-right";
import Refresh from "@iconify-icons/ep/refresh";
import ArrowDown from "@iconify-icons/ep/arrow-down";
import CloseBold from "@iconify-icons/ep/close-bold";
import Bell from "@iconify-icons/ep/bell";
import Search from "@iconify-icons/ep/search";
import Plus from "@iconify-icons/ep/plus";
import Edit from "@iconify-icons/ep/edit";
import EditOpen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import More from "@iconify-icons/ep/more";
// import p from "@iconify-icons/ep/p";
// import Monitor from "@iconify-icons/ep/monitor";
// import DataAnalysis from "@iconify-icons/ep/data-analysis";
// import DataLine from "@iconify-icons/ep/data-line";
import HomeFilled from "@iconify-icons/ep/home-filled";
import DeleteFilled from "@iconify-icons/ep/delete-filled";
import Platform from "@iconify-icons/ep/platform";
import Histogram from "@iconify-icons/ep/histogram";
import Menu from "@iconify-icons/ep/menu";
import List from "@iconify-icons/ep/list";
import InfoFilled from "@iconify-icons/ep/info-filled";
import QuestionFilled from "@iconify-icons/ep/question-filled";
import TrendCharts from "@iconify-icons/ep/trend-charts";
import Menagement from "@iconify-icons/ep/management";
import Tools from "@iconify-icons/ep/tools";
addIcon("plus", Plus);
addIcon("edit", Edit);
addIcon("edit-open", EditOpen);
addIcon("delete", Delete);
addIcon("more", More);
addIcon("check", Check);
addIcon("home-filled", HomeFilled);
addIcon("delete-filled", DeleteFilled);
addIcon("document", Document);
addIcon("setting", Setting);
addIcon("tools", Tools);
addIcon("lollipop", Lollipop);
addIcon("refresh", Refresh);
addIcon("refresh-right", RefreshRight);
addIcon("arrow-down", ArrowDown);
addIcon("close-bold", CloseBold);
addIcon("bell", Bell);
addIcon("search", Search);
// addIcon("monitor", Monitor);
addIcon("platform", Platform);
// addIcon("data-analysis", DataAnalysis);
// addIcon("data-line", DataLine);
addIcon("histogram", Histogram);
addIcon("menu", Menu);
addIcon("list", List);
addIcon("info-filled", InfoFilled);
addIcon("question-filled", QuestionFilled);
addIcon("trend-charts", TrendCharts);
addIcon("management", Menagement);

// remixicon
import ArrowRightSLine from "@iconify-icons/ri/arrow-right-s-line";
import ArrowLeftSLine from "@iconify-icons/ri/arrow-left-s-line";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import InformationLine from "@iconify-icons/ri/information-line";
import ArrowUpLine from "@iconify-icons/ri/arrow-up-line";
import ArrowDownLine from "@iconify-icons/ri/arrow-down-line";
import Bookmark from "@iconify-icons/ri/bookmark-2-line";
import User from "@iconify-icons/ri/user-3-fill";
import Lock from "@iconify-icons/ri/lock-fill";
import Password from "@iconify-icons/ri/lock-password-line";
addIcon("arrow-right-s-line", ArrowRightSLine);
addIcon("arrow-left-s-line", ArrowLeftSLine);
addIcon("logout-circle-r-line", LogoutCircleRLine);
addIcon("information-line", InformationLine);
addIcon("arrow-up-line", ArrowUpLine);
addIcon("arrow-down-line", ArrowDownLine);
addIcon("bookmark", Bookmark);
addIcon("user", User);
addIcon("lock", Lock);
addIcon("password", Password);

// uil
import ArrowsShrinkV from "@iconify-icons/uil/arrows-shrink-v";
addIcon("density", ArrowsShrinkV);

// mdi
import Expand from "@iconify-icons/mdi/arrow-expand-down";
import UnExpand from "@iconify-icons/mdi/arrow-expand-right";
addIcon("expand", Expand);
addIcon("unExpand", UnExpand);

// fluent
import Role from "@iconify-icons/fluent/people-swap-28-filled";
import FlUser from "@iconify-icons/fluent/person-12-filled";
addIcon("role", Role);
addIcon("flUser", FlUser);

// fa
import Heart from "@iconify-icons/fa/heart";
import HeartO from "@iconify-icons/fa/heart-o";
// fa-solid
import HeartBroken from "@iconify-icons/fa-solid/heart-broken";

addIcon("heart", Heart);
addIcon("heart-o", HeartO);
addIcon("heart-broken", HeartBroken);

// Iconify Icon在Vue里离线使用（用于内网环境）https://docs.iconify.design/icon-components/vue/offline.html
export default defineComponent({
  name: "IconifyIcon",
  components: { IconifyIcon },
  props: {
    icon: {
      type: String,
      default: ""
    }
  },
  render() {
    const attrs = this.$attrs;
    return h(
      IconifyIcon,
      {
        icon: `${this.icon}`,
        ...attrs
      },
      {
        default: () => []
      }
    );
  }
});
