import { service } from './request';
// 首页标语
/** 获取首页标语 */
export const getBanner: () => Promise<{
  data: any[];
  msg: string;
  code: number;
}> = () => service.get('/api/banner');
/** 设置首页标语 */
export const setBanner = (data) => service.post('/api/banner', data);
