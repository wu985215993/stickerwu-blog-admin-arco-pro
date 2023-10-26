import { service } from './request';
export const getSetting: () => Promise<{
  data: unknown;
  msg: string;
  code: number;
}> = () => service.get('/api/setting');
export const setSetting = (data) => service.put('/api/setting', data);
