import axios from 'axios';
import { Message } from '@arco-design/web-react';
/** 初始化 axios 配置 */
export const service = axios.create({
  timeout: 5000,
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
    if (response.headers.authentication) {
      // 响应头里面如果有这个字段，我们需要将这个字段存储到 localstorage，之后的请求都需要将这个 token 带到服务器
      // 这一步很重要，一定要将 token 存储到本地
      localStorage.adminToken = response.headers.authentication;
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