import React from 'react';
import { Form, Input, Select } from '@arco-design/web-react';
import type { FormInstance } from '@arco-design/web-react';
import { UploadImage } from '@/components';
type ProjectForm = {
  initialValues?: any;
  form: FormInstance;
};

// TODO constant
const blogTypeOrderOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
];
function ProjectForm({ initialValues, form }: ProjectForm) {
  return (
    <Form layout="vertical" form={form}>
      <Form.Item field={'id'} label="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        field={'name'}
        label="项目名称"
        rules={[{ required: true, message: '请填写项目名称' }]}
      >
        <Input placeholder="请填写项目名称" />
      </Form.Item>
      <Form.Item
        field={'description'}
        label="项目描述（每一项描述以英文逗号分割）"
        rules={[{ required: true, message: '请填写项目描述' }]}
      >
        <Input placeholder="请填写项目描述" />
      </Form.Item>
      <Form.Item
        field={'url'}
        label="项目链接"
        rules={[{ required: true, message: '请填写项目名称' }]}
      >
        <Input placeholder="请填写项目名称" />
      </Form.Item>
      <Form.Item
        field={'github'}
        label="Github 地址"
        rules={[{ required: true, message: '请填写项目名称' }]}
      >
        <Input placeholder="请填写项目名称" />
      </Form.Item>
      <Form.Item
        label="预览图"
        field="thumb"
        triggerPropName="fileList"
        rules={[{ required: true, message: '预览图不能为空' }]}
      >
        <UploadImage />
      </Form.Item>
      <Form.Item
        label="排序等级"
        field="order"
        rules={[{ required: true, message: '请选择排序等级' }]}
      >
        <Select
          placeholder="请选择"
          options={blogTypeOrderOptions}
          style={{ width: '25%' }}
        />
      </Form.Item>
    </Form>
  );
}

export default ProjectForm;
