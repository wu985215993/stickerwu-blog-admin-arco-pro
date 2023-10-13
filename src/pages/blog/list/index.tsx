import React from 'react';
import {
  Table,
  TableColumnProps,
  Card,
  Message,
  Button,
  Typography,
  Space,
  Modal,
  Tooltip,
} from '@arco-design/web-react';
import { getBlogList, deleteBlogById } from '@/services';
import { useRequest } from 'ahooks';
import { IconEdit, IconDelete } from '@arco-design/web-react/icon';
import styles from './styles/index.module.less';
import dayjs from 'dayjs';

const { Paragraph } = Typography;
/**
 * @name 文章列表
 */
function BlogList() {
  const {
    runAsync,
    loading,
    data = {},
  } = useRequest(getBlogList, {
    onError: (error) => {
      Message.error(error.message || '文章列表获取失败');
    },
  });
  const { runAsync: deleteRunAsync, loading: deleteLoading } = useRequest(
    deleteBlogById,
    {
      manual: true,
      onSuccess: () => {
        Message.success('删除成功');
        runAsync(1, 10);
      },
      onError: (error) => {
        Message.error(error.message || '删除文章失败');
      },
    }
  );

  /** 跳转到文章编辑 */
  function goToEditVBlog() {}
  /** 点击删除文章按钮 */
  function onDeleteBlog(id) {
    Modal.confirm({
      title: '是否删除此篇文章',
      content: '删除该文章会将该文章下面的评论一并删除，是否继续?',
      onConfirm: () => deleteRunAsync(id),
      okButtonProps: {
        loading: deleteLoading,
      },
      onCancel: () => {
        Message.info('已取消文章分类');
      },
    });
  }

  const columns: TableColumnProps[] = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '文章名称',
      dataIndex: 'title',
    },
    {
      title: '文章描述',
      dataIndex: 'description',
      render(col, item, index) {
        return (
          <Paragraph
            ellipsis={{
              rows: 1,
              showTooltip: true,
              wrapper: 'div',
            }}
          >
            {col}
          </Paragraph>
        );
      },
    },
    {
      title: '浏览量',
      dataIndex: 'scanNumber',
    },
    {
      title: '评论量',
      dataIndex: 'commentNumber',
    },
    {
      title: '所属分类',
      dataIndex: 'category',
      render(col) {
        return col?.name || '--';
      },
    },
    {
      title: '创建日期',
      dataIndex: 'createDate',
      render(col) {
        return (
          <Paragraph
            ellipsis={{
              rows: 1,
              showTooltip: true,
              wrapper: 'div',
            }}
          >
            {dayjs(+col || 0).format('YYYY-MM-DD HH:mm:ss')}
          </Paragraph>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render(col, item) {
        return (
          <Space>
            <Tooltip content="编辑">
              <Button type="primary" status="warning" icon={<IconEdit />} />
            </Tooltip>
            <Tooltip content="删除">
              <Button
                type="secondary"
                status="danger"
                icon={<IconDelete />}
                className={styles.deleteIcon}
                onClick={() => onDeleteBlog(item.id)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <Card>
      <Table
        columns={columns}
        data={data.data?.rows || []}
        rowKey={'id'}
        loading={loading}
      />
    </Card>
  );
}

export default BlogList;
