import React, { useEffect, useState } from 'react';
import qs from 'query-string';
import { useRequest } from 'ahooks';
import {
  getBlogById,
  upodateBlogById,
  addBlog,
  getBlogTypeList,
} from '@/services';
import {
  Form,
  Spin,
  Card,
  Input,
  Select,
  Button,
  Message,
} from '@arco-design/web-react';
import { MarkdownEditor, UploadImage } from '@/components';
import { useHistory } from 'react-router';
import { omit } from 'lodash';
/**
 * @name 文章编辑页
 */
export default function EditBlog(props) {
  const history = useHistory();
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const query = qs.parseUrl(window.location.href).query;
  const { loading, data = {} } = useRequest(() => getBlogById(query.id), {
    ready: !!query.id,
  });
  const { data: blogTypes } = useRequest(getBlogTypeList);

  // FIXME:字节这个框架没法在routes的时候配置 动态路由参数
  useEffect(() => {
    if (!!query.id) {
      const initValue = data.data || {};
      form.setFieldsValue({
        ...initValue,
        content: initValue.markdownContent || initValue.htmlContent || '',
        thumb: [{ url: initValue.thumb, uid: initValue.thumb }],
      });
    }
  }, [query, data.data]);
  async function handleSubmit() {
    setBtnLoading(true);
    try {
      const value = await form.validate();
      const params = {
        id: +query.id,
        ...omit({ ...value, markdownContent: value.content || '' }, [
          'content',
          'thumb',
        ]),
        thumb: value.thumb[0].response || value.thumb[0].url || value.thumb,
        // thumb: value.thumb[0].url,
        // TODO 去掉TOC的逻辑
        toc: data.data?.toc || [],
        htmlContent: data.data?.htmlContent || '',
        createDate: new Date().getTime(),
      };

      !!query.id
        ? await upodateBlogById({
            id: +query.id,
            ...params,
          })
        : await addBlog(omit(params, ['id']));
      Message.success(`文章${!!query.id ? '修改' : '添加'}成功`);
      history.push('/blog/list');
    } catch (e) {
      Message.error(e.message);
    } finally {
      setBtnLoading(false);
    }
  }
  return (
    <Spin loading={loading} block>
      <Card>
        <Form labelCol={{ span: 3 }} layout="vertical" form={form}>
          <Form.Item label="文章标题" field="title">
            <Input placeholder="请输入文章标题" />
          </Form.Item>
          <Form.Item label="文章编辑" field={'content'}>
            <MarkdownEditor />
          </Form.Item>
          <Form.Item
            label="文章描述"
            field="description"
            rules={[{ required: true, message: '请填写文章描述' }]}
          >
            <Input.TextArea rows={5} placeholder="请输入文章描述" />
          </Form.Item>

          <Form.Item
            label="文章头图"
            field="thumb"
            triggerPropName="fileList"
            rules={[{ required: true, message: '文章头图不能为空' }]}
          >
            <UploadImage />
          </Form.Item>
          <Form.Item
            label="选择分类"
            field="categoryId"
            rules={[{ required: true, message: '请选择文章分类' }]}
          >
            <Select
              style={{ width: '30%' }}
              options={blogTypes?.data.map((v) => ({
                label: v.name,
                value: v.id,
              }))}
            />
          </Form.Item>
        </Form>
        <Button type="primary" loading={btnLoading} onClick={handleSubmit}>{`${
          query.id ? '确认修改' : '提交文章'
        }`}</Button>
      </Card>
    </Spin>
  );
}
