import React from 'react';
import { Message, Upload } from '@arco-design/web-react';
import { service } from '@/services/request';
/** 自定义上传图片处理 TODO文件类型限制 */
function customUpload(option) {
  const { onError, onSuccess, file, onProgress } = option;
  const files = new FormData();
  files.append('file', file);
  service
    .post('/api/upload', files, {
      onUploadProgress(progressEvent) {
        onProgress(
          Math.floor((progressEvent.loaded / progressEvent.total) * 100),
          progressEvent
        );
      },
    })
    .then((res) => {
      if (res.code === 0) {
        // TODO 后端上传file名不正确报错提示
        onSuccess(res.data);
        Message.success(res.msg);
      } else {
        Message.error(res.msg);
        onError(res.msg);
      }
    })
    .catch((e) => {
      Message.error(e.message);
      onError(e.message);
    });
}

/**
 *
 * @name 统一的上传图片组件
 */
export default function UploadImage(props) {
  return (
    <Upload
      {...props}
      imagePreview
      listType="picture-card"
      multiple={false}
      name="file"
      limit={1}
      customRequest={customUpload}
    />
  );
}
