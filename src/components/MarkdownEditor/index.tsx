import React, { useState } from 'react';
import { MdEditor, MdCatalog, MdPreview } from 'md-editor-rt';
import { Message } from '@arco-design/web-react';
import 'md-editor-rt/lib/style.css';
import { service } from '@/services/request';
import { Spin } from '@arco-design/web-react';
interface MarkdownEditorProps {
  value?: string;
  onChange?: (newValue: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const [upLoading, setUpLoading] = useState(false);
  // TODO 后期封装
  const onUploadImg = async (files, callback) => {
    setUpLoading(true);
    const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const formData = new FormData();
          formData.append('file', file);
          service
            .post('/api/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((res) => {
              if (res.code === 0) {
                // TODO 后端上传file名不正确报错提示
                rev(res.data);
                Message.success('上传图片成功');
              } else {
                Message.error(res.msg);
              }
            })
            .catch((error) => {
              Message.error(error.message);
              rej(error);
            })
            .finally(() => {
              setUpLoading(false);
            });
        });
      })
    );
    callback(res.map((item) => item));
  };
  return (
    <Spin block tip="图片上传中..." loading={upLoading}>
      <MdEditor
        modelValue={value}
        onChange={onChange}
        // 目录
        // onGetCatalog={setCatalogList}
        editorId="my-editor"
        toolbarsExclude={['github']}
        showCodeRowNumber={true}
        onUploadImg={onUploadImg}
        style={{ height: 660 }}
      />
    </Spin>
  );
};
export default MarkdownEditor;
