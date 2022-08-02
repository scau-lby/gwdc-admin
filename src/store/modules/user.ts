import { defineStore } from "pinia";
import { store } from "/@/store";
import { userType } from "./types";
import { router } from "/@/router";
import { storageSession } from "/@/utils/storage";
import { userLogin, refreshToken } from "/@/api/user";
import { getToken, setToken, removeToken } from "/@/utils/auth";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { message } from "@pureadmin/components";

interface ResponseType extends Promise<any> {
  status: number;
  message: string;
  data: string;
}

const data = getToken();
let token = "";
let name = "";
if (data) {
  const dataJson = JSON.parse(data);
  if (dataJson) {
    token = dataJson?.accessToken;
    name = dataJson?.name ?? "admin";
  }
}

export const useUserStore = defineStore({
  id: "gwdc-user",
  state: (): userType => ({
    token,
    name,
    // 前端生成的验证码（按实际需求替换）
    verifyCode: "",
    // 登陆显示组件判断 0：登陆 1：手机登陆 2：二维码登陆 3：注册 4：忘记密码，默认0：登陆
    currentPage: 0
  }),
  actions: {
    SET_TOKEN(token) {
      this.token = token;
    },
    SET_NAME(name) {
      this.name = name;
    },
    SET_VERIFYCODE(verifyCode) {
      this.verifyCode = verifyCode;
    },
    SET_CURRENTPAGE(value) {
      this.currentPage = value;
    },
    // 登入
    async loginByLoginName(params) {
      return new Promise<void>((resolve, reject) => {
        userLogin(params)
          .then(({ data, message: msg, status }: ResponseType) => {
            if (status === 200) {
              data = JSON.parse(data);
              setToken({
                accessToken: data?.token,
                name: data?.userName,
                expires: data?.expires || 1 * 60 * 60 * 1000
              });
              resolve();
            } else {
              message.error(msg);
              reject();
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出 清空缓存
    logOut() {
      this.token = "";
      this.name = "";
      removeToken();
      storageSession.clear();
      useMultiTagsStoreHook().handleTags("equal", [
        {
          path: "/welcome",
          parentPath: "/",
          meta: {
            title: "menus.hsHome",
            icon: "home-filled"
          }
        }
      ]);
      router.push("/login");
    },
    // 刷新token
    async refreshToken(data) {
      return refreshToken(data).then(data => {
        if (data) {
          setToken(data);
          return data;
        }
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
