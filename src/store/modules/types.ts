import { RouteRecordName } from "vue-router";

export type cacheType = {
  mode: string;
  name?: RouteRecordName;
};

export type positionType = {
  startIndex?: number;
  length?: number;
};

export type appType = {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // 判断是否手动点击Hamburger
    isClickHamburger: boolean;
  };
  layout: string;
  device: string;
};

export type multiType = {
  path: string;
  parentPath: string;
  name: string;
  meta: any;
  query?: object;
};

export type setType = {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
};

export type userType = {
  token: string;
  name?: string;
  verifyCode?: string;
  currentPage?: number;
};

export type HisDataType = {
  wellName: string;
  wellType: string;
  mixed: number;
  flag: string;
  plate: string;
  plates: Array<string>;
  beginTime: string;
  endTime: string;
};

export type trtcType = {
  sdkAppId: string;
  userId: string;
  roomId: string;
  secretKey: string;
  userSig: string;
  audioDeviceId: string;
  videoDeviceId: string;
  cameraList: Array<string>;
  microphoneList: Array<string>;
  logs: Array<object>;
  isJoined: boolean;
  isPublished: boolean;
  isShared: boolean;
  remoteStreams: Array<string>;
  invitedRemoteStreams: Array<string>;
};
