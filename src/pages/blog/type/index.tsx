import React, { useState } from 'react';
import {
  Table,
  TableColumnProps,
  Card,
  Message,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Grid,
  Tooltip,
} from '@arco-design/web-react';
import {
  getBlogTypeList,
  deleteBlogTypeById,
  updateBlogTypeById,
  addBlogType,
} from '@/services';
import { useRequest } from 'ahooks';
import { IconEdit, IconDelete } from '@arco-design/web-react/icon';
import styles from './styles/index.module.less';

const blogTypeOrderOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
];
/**
 * @name 文章分类列表
 */
function BlogTypeList() {
  const [addBtnLoading, setAddBtnLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const {
    runAsync,
    loading,
    data = {},
  } = useRequest(getBlogTypeList, {
    onError: (error) => {
      Message.error(error.message || '文章列表获取失败');
    },
  });
  const { runAsync: deleteRunAsync, loading: deleteLoading } = useRequest(
    deleteBlogTypeById,
    {
      manual: true,
      onSuccess: () => {
        Message.success('删除成功');
        runAsync();
        setCurrentPage(1);
      },
      onError: (error) => {
        Message.error(error.message || '删除分类失败');
      },
    }
  );

  /** 点击删除文章按钮 */
  function onDeleteBlog(id) {
    Modal.confirm({
      title: '是否删除此文章分类',
      content: '删除该分类后，该分类下面的所有文章将变为未分类状态，是否继续?',
      onConfirm: () => deleteRunAsync(id),
      okButtonProps: {
        loading: deleteLoading,
      },
      onCancel: () => {
        Message.info('已取消删除文章');
      },
    });
  }
  /** 编辑文章分类 */
  function onEditBlogType(item) {
    setVisible(true);
    editForm.setFieldsValue(item);
  }

  const columns: TableColumnProps[] = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '博客类别',
      dataIndex: 'name',
    },
    {
      title: '文章数量',
      dataIndex: 'articleCount',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render(col, item) {
        return (
          <Space>
            <Tooltip content="编辑">
              <Button
                type="primary"
                status="warning"
                icon={<IconEdit />}
                onClick={() => onEditBlogType(item)}
              />
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

  async function onAddBlogType() {
    try {
      setAddBtnLoading(true);
      const values = await form.validate();
      await addBlogType(values);
      Message.success('添加分类成功');
    } catch (e) {
      Message.error('请填写完博客分类信息');
    } finally {
      setAddBtnLoading(false);
      await runAsync();
      setCurrentPage(1);
    }
  }
  return (
    <Card>
      <Form style={{ marginBottom: 24 }} form={form}>
        <Grid.Row align="center">
          <Grid.Col span={12}>
            <Form.Item
              field="name"
              rules={[{ required: true, message: '请输入分类名称' }]}
              required
              noStyle
            >
              <Input
                placeholder="请输入新增博客分类名称"
                addBefore={
                  <Form.Item
                    required
                    field="order"
                    rules={[{ required: true, message: '请选择序号' }]}
                    noStyle
                  >
                    <Select
                      options={blogTypeOrderOptions}
                      placeholder="请选择"
                      allowClear
                    />
                  </Form.Item>
                }
              />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={4} offset={1}>
            <Button
              type="primary"
              onClick={onAddBlogType}
              loading={addBtnLoading}
            >
              添加
            </Button>
          </Grid.Col>
        </Grid.Row>
      </Form>
      <Table
        columns={columns}
        data={data.data || []}
        rowKey={'id'}
        loading={loading}
        // 前端分页
        pagination={{
          current: currentPage,
          pageSize,
          total: data.data?.length || 0,
          showTotal: true,
          sizeCanChange: true,
          onChange(pageNumber, pageSize) {
            setCurrentPage(pageNumber);
            setPageSize(pageSize);
          },
        }}
      />
      <Modal
        visible={visible}
        onCancel={() => {
          setVisible(false), editForm.resetFields();
        }}
        title="编辑文章分类"
        onConfirm={async () => {
          try {
            const values = await editForm.validate();
            await updateBlogTypeById(values);
            Message.success('更新分类信息成功');
            await runAsync();
            setCurrentPage(1);
            setVisible(false);
          } catch (e) {
            console.log(e);
            Message.error(e);
          }
        }}
      >
        <Form form={editForm}>
          <Form.Item field="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="分类名称"
            field="name"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            label="排序等级"
            field="order"
            rules={[{ required: true, message: '请选择排序等级' }]}
          >
            <Select placeholder="请选择" options={blogTypeOrderOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

export default BlogTypeList;
