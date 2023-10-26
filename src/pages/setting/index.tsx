import {
  Card,
  Divider,
  Form,
  Input,
  Typography,
  Button,
  Message,
  Image,
} from '@arco-design/web-react';
import { UploadImage } from '@/components';
import React, { useEffect, useState } from 'react';
import { useRequest, useToggle } from 'ahooks';
import { getSetting, setSetting } from '@/services/settingService';
import { omit } from 'lodash';

export default function Setting() {
  const { data, loading: infoLoading } = useRequest(getSetting, {
    onError: () => Message.error('获取网站信息失败'),
  });
  const [form] = Form.useForm();
  const [diabled, { toggle, set }] = useToggle(true);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  async function handleBtn() {
    toggle();
    try {
      // 保存
      if (!diabled) {
        setBtnLoading(true);
        const values = await form.validate();
        const params = omit(
          {
            ...values,
            avatar:
              values.avatar[0]?.response ||
              values.avatar[0]?.url ||
              values.avatar,
            qqQrCode:
              values.qqQrCode[0]?.response ||
              values.qqQrCode[0]?.url ||
              values.qqQrCode,
            weixinQrCode:
              values.weixinQrCode[0]?.response ||
              values.weixinQrCode[0]?.url ||
              values.weixinQrCode,
          },
          ['id']
        );
        await setSetting(params);
        Message.success('更新网站信息成功');
        set(true);
      }
    } catch {
      set(false);
    } finally {
      setBtnLoading(false);
    }
  }
  useEffect(() => {
    if (data?.data) {
      const webInfo = data.data;
      form.setFieldsValue({
        ...(data.data as Record<string, string>),
        avatar: [{ url: webInfo.avatar, uid: webInfo.avatar }],
        qqQrCode: [{ url: webInfo.qqQrCode, uid: webInfo.qqQrCode }],
        weixinQrCode: [
          { url: webInfo.weixinQrCode, uid: webInfo.weixinQrCode },
        ],
      });
    }
    form.setFieldsValue(data);
  }, [data]);

  return (
    <Card loading={infoLoading}>
      <Typography.Title heading={5}>网站信息</Typography.Title>
      <Form
        form={form}
        layout="vertical"
        style={{ width: '40%' }}
        disabled={diabled}
        requiredSymbol={false}
      >
        <Form.Item
          field={'siteTitle'}
          label="网站标题"
          rules={[{ required: true, message: '请输入网站标题' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item
          field={'mail'}
          label="邮箱"
          rules={[{ required: true, message: '请输入邮箱' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          field={'icp'}
          label="备案号"
          rules={[{ required: true, message: '请输入备案号' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Divider />
        <Typography.Title heading={5}>网站头像信息</Typography.Title>
        <Form.Item
          field={'avatar'}
          rules={[{ required: true, message: '请上传网站头像' }]}
          placeholder="请输入"
          triggerPropName="fileList"
        >
          <UploadImage />
        </Form.Item>
        <Divider />
        <Typography.Title heading={5}>网站图标信息</Typography.Title>
        <Form.Item
          field={'favicon'}
          label="网站图标地址"
          rules={[{ required: true, message: '请输入网站图标地址' }]}
          placeholder="请输入"
        >
          <Input />
        </Form.Item>
        <Typography.Title heading={5}>网站图标预览</Typography.Title>
        <Image width={50} src={data?.data?.favicon} />
        <Divider />
        <Typography.Title heading={5}>Github信息</Typography.Title>
        <Form.Item
          field={'githubName'}
          label="Github 名字"
          placeholder="请输入"
          rules={[{ required: true, message: '请输入Github 名字' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          field={'github'}
          label="Github 地址"
          placeholder="请输入"
          rules={[{ required: true, message: '请输入Github 地址' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Divider />
        <Typography.Title heading={5}>QQ 信息</Typography.Title>
        <Form.Item
          field={'qq'}
          label="QQ 号码"
          placeholder="请输入"
          rules={[{ required: true, message: '请输入QQ 号码' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          field={'qqQrCode'}
          label="QQ 二维码图片预览"
          placeholder="请输入"
          triggerPropName="fileList"
          rules={[{ required: true, message: '请上传QQ二维码图片' }]}
        >
          <UploadImage />
        </Form.Item>
        <Divider />
        <Typography.Title heading={5}>微信 信息</Typography.Title>
        <Form.Item
          field={'weixin'}
          label="微信号"
          placeholder="请输入"
          rules={[{ required: true, message: '请输入微信号' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          field={'weixinQrCode'}
          label="微信二维码图片预览"
          placeholder="请输入"
          triggerPropName="fileList"
          rules={[{ required: true, message: '请上传微信二维码图片' }]}
        >
          <UploadImage />
        </Form.Item>
        <Divider />
      </Form>
      <Button type="primary" loading={btnLoading} onClick={handleBtn}>
        {diabled ? '编辑' : '保存'}
      </Button>
    </Card>
  );
}
