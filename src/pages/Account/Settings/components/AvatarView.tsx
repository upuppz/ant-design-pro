import { UploadChangeParam } from 'antd/es/upload';
import { Button, message, Upload } from 'antd';
import styles from '@/pages/Account/Settings/components/BaseView.less';
import ImgCrop from 'antd-img-crop';
import { ChangeAvatarApi } from '@/pages/Account/Settings/service';
import { ACCESS_TOKEN } from '@/utils/auth';
import { UploadOutlined } from '@ant-design/icons';
import React from 'react';

const AvatarView = ({
                      avatar,
                      onChangeAvatar,
                    }: {
  avatar: string | undefined;
  onChangeAvatar: any;
}) => {
  const onChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
      const { response } = info.file;
      if (response.code === '00000') {
        onChangeAvatar(response.data);
        message.success('头像更新成功');
      } else {
        message.error(`头像更新失败,${response.msg}`);
      }
    } else if (info.file.status === 'error') {
      message.error('头像更新失败');
    }
  };

  return (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <ImgCrop rotate>
        <Upload
          showUploadList={false}
          action={ChangeAvatarApi}
          headers={{ Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}` }}
          onChange={onChange}
        >
          <div className={styles.button_view}>
            <Button>
              <UploadOutlined />
              更换头像
            </Button>
          </div>
        </Upload>
      </ImgCrop>
    </>
  );
};

export default AvatarView;
