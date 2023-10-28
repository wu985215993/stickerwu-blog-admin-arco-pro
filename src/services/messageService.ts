import { service } from './request';

export interface Comment {
  id: number;
  nickname: string;
  content: string;
  avatar: string;
  createDate: string;
  blogId: null | number;
}

export interface MessageListResponseData {
  code: number;
  msg: string;
  data: {
    total: number;
    rows: Comment[];
  };
}
export interface MessageListRequest {
  page: number;
  limit: number;
}
export const getMessages: (
  query: MessageListRequest
) => Promise<MessageListResponseData> = (query = { page: 1, limit: 10 }) =>
  service.get('/api/message', { params: query });
export const delMessage = (id: number) => service.delete(`/api/message/${id}`);
