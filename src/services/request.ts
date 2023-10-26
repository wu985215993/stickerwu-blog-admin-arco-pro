import axios from 'axios';
import { Message, Notification } from '@arco-design/web-react';
import { logout } from '@/utils/checkLogin';
/** 初始化 axios 配置 */
export const service = axios.create({
  timeout: 20000,
});

/** 配置请求拦截器 */
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    // 判断是否存在token
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

/** 配置响应拦截器 */
service.interceptors.response.use(
  (response) => {
    console.log(
      '%c [ response ]-29',
      'font-size:13px; background:pink; color:#bf2c9f;',
      response
    );
    if (response.headers.authentication) {
      // 响应头里面如果有这个字段，我们需要将这个字段存储到 localstorage，之后的请求都需要将这个 token 带到服务器
      // 这一步很重要，一定要将 token 存储到本地
      localStorage.adminToken = response.headers.authentication;
    }
    if (
      response.data.code === 401 &&
      response.data.msg === '未登录，或者登录过期'
    ) {
      logout();
    }
    // TODO 优化 接口报错前端兼容处理下
    if (response.data.code === 500) {
      Notification.error({
        content: response.data.code + '：' + response.data.msg,
      });
      throw new Error(response.data.msg);
    }
    if (response.data.code !== 0 && response.data.code) {
      Notification.error({
        content: response.data.code + '：' + response.data.msg,
      });
      throw new Error(response.data.msg);
    }
    return response.data; // 响应放行
  },
  (error) => {
    // console.log('err' + error) // for debug
    Message.error({
      content: error.message,
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
