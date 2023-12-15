import { h, defineComponent } from "vue";
import { Icon as IconifyIcon, addIcon } from "@iconify/vue/dist/offline";

// element-plus icon
import Check from "@iconify-icons/ep/check";
import Document from "@iconify-icons/ep/document";
import Setting from "@iconify-icons/ep/setting";
import Lollipop from "@iconify-icons/ep/lollipop";
import RefreshLeft from "@iconify-icons/ep/refresh-left";
import RefreshRight from "@iconify-icons/ep/refresh-right";
import Refresh from "@iconify-icons/ep/refresh";
import ArrowDown from "@iconify-icons/ep/arrow-down";
import Download from "@iconify-icons/ep/download";
import Upload from "@iconify-icons/ep/upload";
import CloseBold from "@iconify-icons/ep/close-bold";
import Bell from "@iconify-icons/ep/bell";
import Search from "@iconify-icons/ep/search";
import Plus from "@iconify-icons/ep/plus";
import Minus from "@iconify-icons/ep/minus";
import Edit from "@iconify-icons/ep/edit";
import View from "@iconify-icons/ep/view";
import EditOpen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import More from "@iconify-icons/ep/more";
import DocumentCopy from "@iconify-icons/ep/document-copy";
import CaretTop from "@iconify-icons/ep/caret-top";
import CaretBottom from "@iconify-icons/ep/caret-bottom";

import Promotion from "@iconify-icons/ep/promotion";
import HomeFilled from "@iconify-icons/ep/home-filled";
import DeleteFilled from "@iconify-icons/ep/delete-filled";
import Platform from "@iconify-icons/ep/platform";
import Histogram from "@iconify-icons/ep/histogram";
import Menu from "@iconify-icons/ep/menu";
import Grid from "@iconify-icons/ep/grid";
import List from "@iconify-icons/ep/list";
import InfoFilled from "@iconify-icons/ep/info-filled";
import QuestionFilled from "@iconify-icons/ep/question-filled";
import TrendCharts from "@iconify-icons/ep/trend-charts";
import Menagement from "@iconify-icons/ep/management";
import Tools from "@iconify-icons/ep/tools";
import Van from "@iconify-icons/ep/van";
addIcon("plus", Plus);
addIcon("minus", Minus);
addIcon("edit", Edit);
addIcon("view", View);
addIcon("edit-open", EditOpen);
addIcon("delete", Delete);
addIcon("more", More);
addIcon("document-copy", DocumentCopy);
addIcon("caret-top", CaretTop);
addIcon("caret-bottom", CaretBottom);

addIcon("promotion", Promotion);
addIcon("check", Check);
addIcon("home-filled", HomeFilled);
addIcon("delete-filled", DeleteFilled);
addIcon("document", Document);
addIcon("setting", Setting);
addIcon("tools", Tools);
addIcon("lollipop", Lollipop);
addIcon("refresh", Refresh);
addIcon("refresh-left", RefreshLeft);
addIcon("refresh-right", RefreshRight);
addIcon("arrow-down", ArrowDown);
addIcon("download", Download);
addIcon("upload", Upload);
addIcon("close-bold", CloseBold);
addIcon("bell", Bell);
addIcon("search", Search);
addIcon("platform", Platform);
addIcon("histogram", Histogram);
addIcon("menu", Menu);
addIcon("grid", Grid);
addIcon("list", List);
addIcon("info-filled", InfoFilled);
addIcon("question-filled", QuestionFilled);
addIcon("trend-charts", TrendCharts);
addIcon("management", Menagement);
addIcon("van", Van);

// h5player 相关
import FullScreen from "@iconify-icons/ep/full-screen"; // 整体全屏
addIcon("full-screen", FullScreen);
import Microphone from "@iconify-icons/ep/microphone"; // 开始对讲
addIcon("microphone", Microphone);
import Mute from "@iconify-icons/ep/mute"; // 停止对讲
addIcon("mute", Mute);
import Mic from "@iconify-icons/ep/mic";
addIcon("mic", Mic);

import CameraFilled from "@iconify-icons/ep/camera-filled"; // 抓取 JPEG
addIcon("camera-filled", CameraFilled);
import Camera from "@iconify-icons/ep/camera"; // 抓取 BMP
addIcon("camera", Camera);
import VideoCameraFilled from "@iconify-icons/ep/video-camera-filled"; // 录取MP4
addIcon("video-camera-filled", VideoCameraFilled);
import VideoCamera from "@iconify-icons/ep/video-camera"; // 录取PS
addIcon("video-camera", VideoCamera);
import Film from "@iconify-icons/ep/film"; // 停止录制并保存文件
addIcon("film", Film);
import VolumeUpLine from "@iconify-icons/ri/volume-up-line"; // 开启声音
addIcon("volume-up-line", VolumeUpLine);
import VolumeMuteLine from "@iconify-icons/ri/volume-mute-line"; // 关闭声音
addIcon("volume-mute-line", VolumeMuteLine);
import PlayFill from "@iconify-icons/ri/play-fill"; // 开始回放
addIcon("play-fill", PlayFill);
import PauseFill from "@iconify-icons/ri/pause-fill"; // 暂停回放
addIcon("pause-fill", PauseFill);
import StopFill from "@iconify-icons/ri/stop-fill"; // 停止回放
addIcon("stop-fill", StopFill);

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
import LineChart from "@iconify-icons/ri/line-chart-line";
import MicLine from "@iconify-icons/ri/mic-line";
addIcon("mic-line", MicLine);
import MicOffLine from "@iconify-icons/ri/mic-off-line";
addIcon("mic-off-line", MicOffLine);
import CameraLine from "@iconify-icons/ri/camera-line";
addIcon("camera-line", CameraLine);
import CameraOffLine from "@iconify-icons/ri/camera-off-line";
addIcon("camera-off-line", CameraOffLine);
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
addIcon("lineChart", LineChart);
import DashScreen from "@iconify-icons/ri/dashboard-3-fill";
addIcon("dashScreen", DashScreen);

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
