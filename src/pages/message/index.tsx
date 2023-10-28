import React, { useState } from 'react';
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
  Image,
  Form,
} from '@arco-design/web-react';
import { getMessages, delMessage } from '@/services';
import { useRequest } from 'ahooks';
import { IconDelete } from '@arco-design/web-react/icon';
import type { Comment } from '@/services';
import dayjs from 'dayjs';
const { Paragraph } = Typography;
/**
 * @name 留言板
 */
function MessageList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { runAsync, loading, data } = useRequest(getMessages, {
    onError: (error) => {
      Message.error(error.message || '项目列表获取失败');
    },
  });

  const { runAsync: deleteRunAsync, loading: deleteLoading } = useRequest(
    delMessage,
    {
      manual: true,
      onSuccess: () => {
        Message.success('删除成功');
        runAsync({ page: 1, limit: 10 });
        setCurrentPage(1);
      },
      onError: (error) => {
        Message.error(error.message || '删除项目失败');
      },
    }
  );

  /** 点击删除项目按钮 */
  function onDeleteMessage(id: number) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除此条留言信息？',
      onConfirm: () => deleteRunAsync(id),
      okButtonProps: {
        loading: deleteLoading,
      },
      onCancel: () => {
        Message.info('已取消留言信息');
      },
    });
  }

  const columns: TableColumnProps<Comment>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render(col) {
        return <Image src={col} height={50} preview />;
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      render(col) {
        return (
          <div>
            <Paragraph
              ellipsis={{
                rows: 1,
                showTooltip: true,
                wrapper: 'div',
              }}
            >
              {col}
            </Paragraph>
          </div>
        );
      },
    },
    {
      title: '创建日期',
      dataIndex: 'createDate',
      render(col) {
        return dayjs(+col).format('YYYY-MM-DD ddd');
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render(col, item) {
        return (
          <Tooltip content="删除">
            <Button
              type="secondary"
              status="danger"
              icon={<IconDelete />}
              onClick={() => onDeleteMessage(item.id)}
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Card>
      <Table
        columns={columns}
        data={data?.data?.rows || []}
        rowKey={'id'}
        loading={loading}
        // 前端分页
        pagination={{
          current: currentPage,
          pageSize,
          total: data?.data?.total || 0,
          showTotal: true,
          sizeCanChange: true,
          onChange(pageNumber, size) {
            setCurrentPage(pageNumber);
            if (size !== pageSize) {
              runAsync({ page: 1, limit: size });
            } else {
              runAsync({ page: pageNumber, limit: size });
            }
            setPageSize(size);
          },
        }}
      />
    </Card>
  );
}

export default MessageList;
