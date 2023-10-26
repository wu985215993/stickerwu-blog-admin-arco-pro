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
import {
  getProjectList,
  deleteProjectById,
  upodateProjectById,
} from '@/services';
import { useRequest } from 'ahooks';
import { IconEdit, IconDelete, IconGithub } from '@arco-design/web-react/icon';
import styles from './styles/index.module.less';
import ProjectForm from '../compoents/ProjectForm';

const { Paragraph } = Typography;
/**
 * @name 项目列表
 */
function ProjectList() {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const {
    runAsync,
    loading,
    data = {},
  } = useRequest(getProjectList, {
    onError: (error) => {
      Message.error(error.message || '项目列表获取失败');
    },
  });
  const { runAsync: deleteRunAsync, loading: deleteLoading } = useRequest(
    deleteProjectById,
    {
      manual: true,
      onSuccess: () => {
        Message.success('删除成功');
        runAsync();
      },
      onError: (error) => {
        Message.error(error.message || '删除项目失败');
      },
    }
  );

  /** 跳转到项目编辑 */
  function goToEditVBlog(projectData) {
    setVisible(true);
    form.setFieldsValue({
      ...projectData,
      description: projectData.description.join(','),
      thumb: [{ url: projectData.thumb, uid: projectData.thumb }],
    });
    // TODO 打开修改项目的全屏模态框
  }
  /** 点击删除项目按钮 */
  function onDeleteBlog(id) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除此项目吗？',
      onConfirm: () => deleteRunAsync(id),
      okButtonProps: {
        loading: deleteLoading,
      },
      onCancel: () => {
        Message.info('已取消删除项目');
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
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '项目描述',
      dataIndex: 'description',
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
              {col.join(',')}
            </Paragraph>
          </div>
        );
      },
    },
    {
      title: '预览图',
      dataIndex: 'thumb',
      render(col) {
        return <Image src={col} height={150} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render(col, item) {
        return (
          <Space>
            <Tooltip content="Github">
              <Button
                type="outline"
                status="warning"
                icon={<IconGithub />}
                onClick={() => window.open(item.github, '__blank')}
              />
            </Tooltip>
            <Tooltip content="编辑">
              <Button
                type="primary"
                status="warning"
                icon={<IconEdit />}
                onClick={() => goToEditVBlog(item)}
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

  return (
    <Card>
      <Table
        columns={columns}
        data={data.data || []}
        rowKey={'id'}
        loading={loading}
      />
      <Modal
        style={{ width: '100vw', height: '100vh' }}
        wrapClassName={styles.modalWrapper}
        visible={visible}
        onCancel={() => {
          setVisible(false), form.resetFields();
        }}
        title="请编辑该项目信息"
        onConfirm={async () => {
          try {
            const values = await form.validate();
            const params = {
              ...values,
              id: +values.id,
              order: +values.order,
              description: values.description.split(','),
              thumb:
                values.thumb[0].response || values.thumb[0].url || values.thumb,
            };
            // TODO 数据有问题的时候 服务端 bug修复
            await upodateProjectById(params);
            Message.success('修改成功');
            await runAsync();
            setVisible(false);
          } catch (e) {
            Message.error(e);
          }
        }}
      >
        <ProjectForm form={form} />
      </Modal>
    </Card>
  );
}

export default ProjectList;
