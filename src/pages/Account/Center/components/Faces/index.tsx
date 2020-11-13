import { Alert, message, Modal, notification, Upload } from 'antd';
import React, { FC, useEffect, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { removeFace, SaveFaceApi } from '@/pages/Account/Center/service';
import { ACCESS_TOKEN } from '@/utils/auth';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { connect } from '@@/plugin-dva/exports';
import { Dispatch } from '@@/plugin-dva/connect';
import { ModalState } from '../../model';

const Faces: FC<{ faces?: UploadFile[], dispatch?: Dispatch; }> = ({ faces = [], dispatch }) => {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    dispatch?.({
      type: 'accountCenter/listFace',
    });
  }, []);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: UploadFile) => {
    setPreviewVisible(true);
    setPreviewImage(file.thumbUrl as string);
  };

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done' && info.file.response) {
      if (info.file.response.code === '00000') {
        // eslint-disable-next-line no-param-reassign
        info.fileList[info.fileList.length - 1].uid = info.file.response.data;
        notification.success({
          message: info.file.response.msg,
        });
      } else {
        // eslint-disable-next-line no-param-reassign
        info.fileList.pop();
        notification.error({
          message: info.file.response.msg,
          description: info.file.response.data,
        });
      }
    }
    dispatch?.({
      type: 'accountCenter/updateListFace',
      payload: info.fileList,
    });
  };

  /**
   * checkImageWH  返回一个promise  检测通过返回resolve  失败返回reject阻止图片上传
   */
  function checkImageWH(file: RcFile) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = e => {
        const src = e.target?.result as string;
        const image = new Image();
        // eslint-disable-next-line func-names
        image.onload = function() {
          // @ts-ignore
          const { width, height } = this;
          if (width < 100 || width > 2000 || height < 100 || height > 2000) {
            message.error('人脸尺寸应大于100X100像素且小于2000X2000像素哟~');
            reject();
          }
          resolve();
        };
        image.onerror = reject;
        image.src = src;
      };
      fileReader.onerror = (error) => reject(error);
    });
  }

  const handleBeforeUpload = (file: RcFile) => {
    // 限制图片 格式、size、分辨率
    const isImage = (/image\/*/).test(file.type);
    if (!isImage) {
      message.error('只能上传图片格式的图片哟~');
    }

    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error('超过3M限制 不允许上传哟~');
    }

    return new Promise<void>((resolve, reject) => {
      if (!isImage || !isLt3M) {
        reject();
      } else {
        // @ts-ignore
        resolve(file && checkImageWH(file));
      }
    });
  };

  const handleRemove = async (file: UploadFile) => {
    const res = await removeFace(file.uid);
    if (res.data) {
      message.success('删除成功');
      return true;
    }
    message.error('删除失败');
    return false;

  };

  return (
    <>
      <Alert
        message={
          <>
            1. 人脸尺寸需大于100X100像素，最大尺寸不能超过2000X2000像素。图片的宽高比请接近 3:4，手机拍摄比例最佳~
            <br />
            2. 图片大小请勿超过3M~
            <br />
            3. 最多上传3张人脸照片，照片越多识别时效果越好~
            <br />
            4. 我们严格按照相关法律法规要求采取相应安全保护措施保护您的信息安全~
          </>
        }
        type="info"
        style={{ marginBottom: 20 }}
      />
      <Upload
        accept="image/*"
        action={SaveFaceApi}
        listType="picture-card"
        fileList={faces}
        headers={{ Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}` }}
        beforeUpload={handleBeforeUpload}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
      >
        {faces.length >= 3 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </div>
        )}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default connect(({ accountCenter }: { accountCenter: ModalState }) => ({
  faces: accountCenter.faces,
}))(Faces);
