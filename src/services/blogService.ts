import { service } from './request';
// 首页标语
/** 获取博客文章列表 */
export const getBlogList: (
  page: number,
  limit: number,
  keyword?: string
) => Promise<{
  data: any[];
  msg: string;
  code: number;
}> = (page = 1, limit = 10, keyword = '') =>
  service.get('/api/blog', { params: { page, limit, keyword } });

/** 删除文章 */
export const deleteBlogById = (id) => service.delete(`/api/blog/${id}`);
