import { service } from './request';

export type BlogTypeResponse = { data: null; code: number; msg: string };

export type BlogTypeParams = {
  name: string;
  order: number;
};

/** 获取文章分类列表 */
export const getBlogTypeList: () => Promise<{
  data: { id: number; name: string; order: number; articleCount: number }[];
  msg: string;
  code: number;
}> = () => service.get('/api/blogtype');

/** 删除文章分类 */
export const deleteBlogTypeById = (id) => service.delete(`/api/blogtype/${id}`);

/** 修改文章分类 */
export const updateBlogTypeById: (
  params: BlogTypeParams & { id: number }
) => Promise<BlogTypeParams> = ({ id, ...params }) =>
  service.put(`/api/blogtype/${id}`, params);

/** 新增文章分类 */
export const addBlogType: (
  params: BlogTypeParams
) => Promise<BlogTypeResponse> = (params) =>
  service.post('/api/blogtype', params);
