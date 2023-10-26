import { service } from './request';
/** 获取项目列表 */
export const getProjectList: () => Promise<{
  data: any[];
  msg: string;
  code: number;
}> = () => service.get('/api/project');

/** 删除项目 */
export const deleteProjectById = (id) => service.delete(`/api/project/${id}`);

/** 修改项目 */
export const upodateProjectById = (params) =>
  service.put(`/api/project/${params.id}`, params);

/** 新增项目 */
export const addProject = (data) => service.post(`/api/project`, data);
