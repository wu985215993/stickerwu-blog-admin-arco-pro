import { Button, Card, Form, Message } from '@arco-design/web-react';
import React, { useState } from 'react';
import ProjectForm from '../compoents/ProjectForm';
import { addProject } from '@/services';
import { useHistory } from 'react-router';
import { omit } from 'lodash';
export default function AddProject() {
  const history = useHistory();
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  async function handleAddProject() {
    try {
      setBtnLoading(true);
      const values = await form.validate();
      const params = omit(
        {
          ...values,
          order: +values.order,
          description: values.description.split(','),
          thumb:
            values.thumb[0].response || values.thumb[0].url || values.thumb,
        },
        ['id']
      );
      await addProject(params);
      Message.success('添加成功');
      history.push('/project/list');
    } finally {
      setBtnLoading(false);
    }
  }
  return (
    <Card title="新增项目">
      <ProjectForm form={form} />
      <Button type="primary" loading={btnLoading} onClick={handleAddProject}>
        发布项目
      </Button>
    </Card>
  );
}
