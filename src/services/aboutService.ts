import { service } from './request';
/** 获取首页标语 */
export const getAbout: () => Promise<{
  data: string;
  msg: string;
  code: number;
}> = () => service.get('/api/about');
/** 设置首页标语 */
export const editAbout = (data: { url: string }) =>
  service.post('/api/about', data);
