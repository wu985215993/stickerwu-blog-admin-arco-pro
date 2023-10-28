import { service } from './request';
import type { Comment } from './messageService';
export interface CommentListResponseData {
  code: number;
  msg: string;
  data: {
    total: number;
    rows: Comment & Blog[];
  };
}
export interface Blog {
  id: number;
  title: string;
  description: string;
  toc: string;
  htmlContent?: string;
  markdownContent?: string;
  thumb: string;
  scanNumber: number;
  commentNumber: number;
  createDate: string;
  categoryId: number;
}

export interface CommentListRequest {
  page: number;
  limit: number;
  /** 所属博客id，默认all，这边又分为两种情况，获取所有的 all 文章评论，还有一种就是获取对应文章的评论 根据id*/
  blogId?: number | string;
  keyword?: string;
}
export const getComment: (
  query: CommentListRequest
) => Promise<CommentListResponseData> = (
  query = { page: 1, limit: 10, blogId: 'all' }
) => service.get('/api/comment', { params: query });
export const delComment = (id: number) => service.delete(`/api/comment/${id}`);
