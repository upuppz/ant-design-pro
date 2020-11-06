import React, { useEffect } from 'react';
import { Button, Form, Input, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons/lib';
import { UpmsApi } from '@/apis';
import ImgCrop from 'antd-img-crop';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import { useModel } from '@@/plugin-model/useModel';
import styles from './style.less';

const handleFinish = () => {
  // message.success('更新基本信息成功');
  message.success('功能开发中...');
};

// 头像组件 方便以后独立，增加裁剪之类的功能
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
        message.success(`头像更新失败,${response.msg}`);
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
          action={UpmsApi.uploadAvatar}
          headers={{ Authorization: `Bearer ${localStorage.getItem('access_token')}` }}
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

const BaseView: React.FC = () => {
  const [useForm] = Form.useForm();

  const { initialState, setInitialState } = useModel('@@initialState');
  // @ts-ignore
  const { currentUser } = initialState;

  useEffect(() => {
    if (currentUser && Object.keys(currentUser).length > 0) {
      useForm.setFieldsValue(currentUser);
    }
  }, [currentUser]);

  const onChangeAvatar = (avatar: string) => {
    setInitialState({ ...initialState, currentUser: { ...currentUser, avatar } });
  };

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={currentUser}
          hideRequiredMark
          form={useForm}
        >
          <Form.Item name="deptName" label="企业名称">
            <Input />
          </Form.Item>
          <Form.Item name="buildingName" label="所属楼栋">
            <Input />
          </Form.Item>
          <Form.Item name="mobile" label="联系电话">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              更新基本信息
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.right}>
        <AvatarView avatar={currentUser?.avatar} onChangeAvatar={onChangeAvatar} />
      </div>
    </div>
  );
};

export default BaseView;
