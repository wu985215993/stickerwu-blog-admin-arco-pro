import { service } from './request';
export const getAbout: () => Promise<{
  data: string;
  msg: string;
  code: number;
}> = () => service.get('/api/about');
export const editAbout = (data: { url: string }) =>
  service.post('/api/about', data);
