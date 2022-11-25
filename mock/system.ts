import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/role",
    method: "post",
    response: () => {
      return {
        code: 0,
        data: {
          list: [],
          total: 0
        }
      };
    }
  },
  {
    url: "/dept",
    method: "post",
    response: () => {
      return {
        code: 0,
        data: {
          list: [],
          total: 0
        }
      };
    }
  },
  {
    url: "/user",
    method: "post",
    response: () => {
      return {
        code: 0,
        data: {
          list: [],
          total: 0
        }
      };
    }
  }
] as MockMethod[];
