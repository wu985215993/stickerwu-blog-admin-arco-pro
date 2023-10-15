import { service } from './request';
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

/** 获取单篇文章详情 */
export const getBlogById = (id) => service.get(`/api/blog/${id}`);

/** 更新文章想去 */
export const upodateBlogById = (params) =>
  service.put(`/api/blog/${params.id}`, params);

/** 新增文章 */
export const addBlog = (data) => service.post(`/api/blog`, data);
