import { service } from './request';

/** 获取验证码 */
export const requestCaptcha = () => service.get('/res/captcha');
/** 登录 */
export const requestLogin = (params) =>
  service.post('/api/admin/login', params);
/** 获取用户信息 */
export const requestUserInfo = () => service.get('/api/admin/whoami');
