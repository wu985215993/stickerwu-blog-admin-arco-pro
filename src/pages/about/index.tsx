import { Button, Card, Form, Input, Message } from '@arco-design/web-react';
import React, { useState } from 'react';
import { getAbout, editAbout } from '@/services';
import { useRequest, useToggle } from 'ahooks';
export default function About() {
  const { data, loading: infoLoading } = useRequest(getAbout, {
    onError: () => Message.error('获取我的信息失败'),
  });

  const [diabled, { toggle, set }] = useToggle(true);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  async function handleBtn() {
    toggle();
    try {
      // 保存
      if (!diabled) {
        setBtnLoading(true);
        const params = await form.validate();
        await editAbout(params);
        Message.success('更新成功');
        set(true);
      }
    } catch {
      set(false);
    } finally {
      setBtnLoading(false);
    }
  }
  return (
    <Card title="关于我" loading={infoLoading}>
      <Form
        layout="vertical"
        form={form}
        initialValues={{ url: data?.data || '' }}
        disabled={diabled}
      >
        <Form.Item
          field={'url'}
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input placeholder="请输入" style={{ width: '40%' }} />
        </Form.Item>
      </Form>
      <Button type="primary" loading={btnLoading} onClick={handleBtn}>
        {diabled ? '编辑' : '保存'}
      </Button>
    </Card>
  );
}
