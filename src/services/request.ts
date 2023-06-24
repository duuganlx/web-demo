/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { message } from 'antd';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import type { Context } from 'umi-request';
import request from 'umi-request';
import { clearInfo } from './utils';

const loginURL = '/api/uc/v1/login';
const loginPath = '/user/login';
const loginPath2 = '/user/login/';
//  import { getJwt } from './utils';
//  export const getUserInfo = (): UserListItem => {
//     const userInfo = localStorage.getItem('userInfo') || '{}';

//     const user = JSON.parse(userInfo);
//     return user;
//   };

export const getGlobalData = (key: string) => {
  return localStorage.getItem(key);
};
export const setGlobalData = (key: string, value: string) => {
  return localStorage.setItem(key, value);
};

// const codeMessage = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// };

// async function updateAccessToken() {
//   const access_token = getGlobalData('access_token');

//   return request('/api/auth/v1/token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     data: {
//       refresh_token:
//     }
//   });
// }

request.use(
  async (_ctx: Context, next) => {
    const { options, url } = _ctx.req;
    let { headers } = options;
    headers = {
      ClientId: 'jhl_quantweb',
      ...headers,
    };
    // 后期添加access_token 检测
    // const access_token = getAccessToken();
    // todo
    const access_token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaGxfcXVhbnR3ZWIiLCJleHAiOjE2ODgyMDI0MTMsInN1YiI6IjE1NTk3MzA4NDg5MzA5OTIxMjgifQ.mKXK5iIjoHlhSYXBQjRv8D64UN5yoHFlDTzA-NTFGC4';
    if (
      url !== loginURL &&
      window.location.pathname !== loginPath &&
      window.location.pathname !== loginPath2
    ) {
      let toLogin = !access_token;
      if (!toLogin && access_token) {
        const decoded: { exp: number } = jwtDecode(access_token || '');
        const t = moment.unix(decoded.exp);
        const now = moment();
        toLogin = t.isBefore(now);
      }

      if (toLogin) {
        message.error('登陆失效，请重新登陆');
        clearInfo();
        window.location.href = '/user/login';
      }
    }

    if (access_token && access_token.length > 0) {
      headers = {
        Authorization: `Bearer ${access_token}`,
        ...headers,
      };
    }
    _ctx.req.options.headers = headers;
    await next();

    // const { res } = _ctx;
    // const { code, msg } = res;
    // if (code !== 0 && code !== 200) {
    //   notification.error({
    //     description: '请求失败',
    //     message: msg,
    //   });
    // }
  },
  {
    global: true,
  },
);

/**
 * 异常处理程序
 */
// const errorHandler = (error: { response: Response }): void => {
//   const { response } = error;
//   if (response && response.status) {
//     const errorText = codeMessage[response.status] || response.statusText;
//     const { status, url } = response;

//     notification.error({
//       message: `请求错误 ${status}: ${url}`,
//       description: errorText,
//     });
//     if (status === 401) {
//       const access = getAccessToken();
//       let toLogin = !access;
//       if (!toLogin && access) {
//         const decoded: { exp: number } = jwtDecode(access || '');
//         const t = moment.unix(decoded.exp);
//         const now = moment();
//         toLogin = t.isBefore(now);
//       }

//       if (toLogin) {
//         clearInfo();
//         window.location.href = '/user/login';
//       }
//       // window.location.href = "/user/login"
//     }
//   } else if (!response) {
//     notification.error({
//       description: '您的网络发生异常，无法连接服务器',
//       message: '网络异常',
//     });
//   }
//   // return response;
// };

/**
 * 配置request请求时的默认参数
 */
// const request = ;

// export default extend({
//   errorHandler, // 默认错误处理
//   credentials: 'include', // 默认请求是否带上cookie
//   // middlewares: {},
// });

export default request;
