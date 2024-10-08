import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  resultType,
  HttpError,
  RequestMethods,
  HttpResponse,
  HttpRequestConfig
} from "./types.d";
import qs from "qs";
import NProgress from "../progress";
import { loadEnv } from "@build/index";
import { getToken } from "../auth";
import { useUserStoreHook } from "/@/store/modules/user";
import { storageSession } from "../storage";
import { router } from "/@/router";
import { ElNotification } from "element-plus";

// 加载环境变量 VITE_PROXY_DOMAIN（开发环境）  VITE_PROXY_DOMAIN_REAL（打包后的线上环境）
const { VITE_PROXY_DOMAIN, VITE_PROXY_DOMAIN_REAL } = loadEnv();

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  baseURL:
    process.env.NODE_ENV === "production"
      ? VITE_PROXY_DOMAIN_REAL
      : VITE_PROXY_DOMAIN,
  // 当前使用mock模拟请求，将baseURL制空，如果你的环境用到了http请求，请删除下面的baseURL启用上面的baseURL，并将11行、16行代码注释取消
  // baseURL: "",
  timeout: 20000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  // 数组格式参数序列化
  paramsSerializer: params => qs.stringify(params, { indices: false })
};

class GwdcHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }
  // 初始化配置对象
  private static initConfig: HttpRequestConfig = {};

  // 保存当前Axios实例对象
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  // 请求拦截
  private httpInterceptorsRequest(): void {
    GwdcHttp.axiosInstance.interceptors.request.use(
      (config: HttpRequestConfig) => {
        const $config = config;
        // 开启进度条动画
        NProgress.start();
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback($config);
          return $config;
        }
        if (GwdcHttp.initConfig.beforeRequestCallback) {
          GwdcHttp.initConfig.beforeRequestCallback($config);
          return $config;
        }
        const token = getToken();
        if (token) {
          const data = JSON.parse(token);
          const now = new Date().getTime();
          const expired = parseInt(data.expires) - now <= 0;
          if (expired) {
            // token过期刷新
            useUserStoreHook()
              .refreshToken(data)
              .then((res: resultType) => {
                // config.headers["Authorization"] = "Bearer " + res.accessToken;
                config.headers["token"] = res.accessToken;
                return $config;
              });
          } else {
            // config.headers["Authorization"] = "Bearer " + data.accessToken;
            config.headers["token"] = data.accessToken;
            return $config;
          }
        } else {
          return $config;
        }
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  // 响应拦截
  private httpInterceptorsResponse(): void {
    const instance = GwdcHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: HttpResponse) => {
        const $config = response.config;
        // 关闭进度条动画
        NProgress.done();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (GwdcHttp.initConfig.beforeResponseCallback) {
          GwdcHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }

        if (
          response.data.status !== 200 &&
          response.data.data !== "查询不到wid参数"
        ) {
          ElNotification({
            title: `${response.data.message}`,
            message: `${response.data.data}`,
            type: "error"
          });
          if (response.data.status === 401) {
            storageSession.removeItem("authorized-token");
            router.push("/login");
          }
        }
        return response.data;
      },
      (error: HttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        ElNotification({
          title: `${error.response.data.status}-${error.response.data.data}`,
          message: `接口："${error.response.data.message}"`,
          type: "error"
        });
        return Promise.reject($error);
      }
    );
  }

  // 通用请求工具函数
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: HttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as HttpRequestConfig;

    // 单独处理自定义请求/响应回掉
    return new Promise((resolve, reject) => {
      GwdcHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 单独抽离的post工具函数
  public post<T, P>(
    url: string,
    params?: T,
    config?: HttpRequestConfig
  ): Promise<P> {
    return this.request<P>("post", url, params, config);
  }

  // 单独抽离的get工具函数
  public get<T, P>(
    url: string,
    params?: T,
    config?: HttpRequestConfig
  ): Promise<P> {
    return this.request<P>("get", url, params, config);
  }
}

export const http = new GwdcHttp();
