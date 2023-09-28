import React, { useState } from 'react';
import {
  Table,
  TableColumnProps,
  Card,
  Message,
  Image,
  Button,
  Modal,
  Form,
  Input,
} from '@arco-design/web-react';
import { getBanner, setBanner } from '@/services';
import { useRequest } from 'ahooks';
import { IconEdit } from '@arco-design/web-react/icon';
import { UploadImage } from '@/components';
import styles from './style/index.module.less';
function Banner() {
  const {
    runAsync,
    loading,
    data = {},
  } = useRequest(getBanner, {
    onError: (error) => {
      Message.error(error.message || '首页标语获取失败');
    },
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  function onEdit(params) {
    form.setFieldsValue({
      ...params,
      mid_img: [{ url: params.mid_img, uid: params.mid_img }],
      big_img: [{ url: params.big_img, uid: params.mid_img }],
    });
    setVisible(true);
  }

  const columns: TableColumnProps[] = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '中图预览',
      dataIndex: 'mid_img',
      render(col, item, index) {
        return <Image src={item.mid_img} width={100} />;
      },
    },
    {
      title: '大图预览',
      dataIndex: 'big_img',
      render(col, item, index) {
        return <Image src={item.big_img} width={100} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render(col, item, index) {
        return (
          <Button
            type="primary"
            icon={<IconEdit />}
            onClick={() => onEdit(item)}
          />
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
        wrapClassName={styles.modalWrapper}
        visible={visible}
        onCancel={() => {
          setVisible(false), form.resetFields();
        }}
        title="请编辑信息"
        onConfirm={async () => {
          try {
            const values = await form.validate();
            const newData = data.data?.map((item) => {
              if (values.id === item.id) {
                return {
                  ...values,
                  midImg:
                    values.mid_img[0].response ||
                    values.mid_img[0].url ||
                    values.mid_img,
                  bigImg:
                    values.big_img[0].response ||
                    values.big_img[0].url ||
                    values.big_img,
                };
              } else {
                return {
                  ...item,
                  midImg:
                    item.mid_img[0].response ||
                    item.mid_img[0].url ||
                    item.mid_img,
                  bigImg:
                    item.big_img[0].response ||
                    item.big_img[0].url ||
                    item.big_img,
                };
              }
            });
            // TODO 数据有问题的时候 服务端 bug修复
            await setBanner(newData);
            Message.success('修改成功');
            await runAsync();
            setVisible(false);
          } catch (e) {
            console.log(e);
            Message.error(e);
          }
        }}
      >
        <Form form={form}>
          <Form.Item requiredSymbol={false} field="id" label="序号" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            requiredSymbol={false}
            label="标题"
            field="title"
            rules={[{ required: true, message: '标题不能为空' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item
            label="描述"
            requiredSymbol={false}
            field="description"
            rules={[{ required: true, message: '描述不能为空' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item
            field={'mid_img'}
            label="首页中图"
            requiredSymbol={false}
            triggerPropName="fileList"
            rules={[{ required: true, message: '首页中图不能为空' }]}
          >
            <UploadImage />
          </Form.Item>
          <Form.Item
            field={'big_img'}
            label="首页大图"
            requiredSymbol={false}
            triggerPropName="fileList"
            rules={[{ required: true, message: '首页大图不能为空' }]}
          >
            <UploadImage />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

export default Banner;
