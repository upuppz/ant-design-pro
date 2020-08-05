import React, { useEffect } from 'react';
import { EnterpriseInfo } from '@/pages/account/center/data';
import { Button, Form, Input, message, Upload } from 'antd';
import { connect } from 'umi';
import { EnterpriseModalState } from '@/pages/account/center/model';
import { UploadOutlined } from '@ant-design/icons/lib';
import { UpmsApi } from '@/apis';
import ImgCrop from 'antd-img-crop';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import styles from './style.less';
import { Dispatch } from '@@/plugin-dva/connect';

const handleFinish = () => {
  // message.success('更新基本信息成功');
  message.success('功能开发中...');
};

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar, dispatch }: { avatar: string | undefined; dispatch: Dispatch }) => {
  const onChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
      const { response } = info.file;
      if (response.code === '00000') {
        dispatch({
          type: 'enterprise/changeAvatar',
          avatar: response.data,
        });
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

const BaseView: React.FC<{ info: Partial<EnterpriseInfo>; dispatch: Dispatch }> = ({
  info,
  dispatch,
}) => {
  const [useForm] = Form.useForm();

  useEffect(() => {
    if (Object.keys(info).length > 0) {
      useForm.setFieldsValue(info);
    }
  }, [info]);

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={info}
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
        <AvatarView avatar={info.avatar} dispatch={dispatch} />
      </div>
    </div>
  );
};

export default connect(({ enterprise }: { enterprise: EnterpriseModalState }) => ({
  info: enterprise.info,
}))(BaseView);
