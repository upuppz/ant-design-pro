import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select, Upload } from 'antd';
import { connect } from 'umi';
import React from 'react';
import ImgCrop from 'antd-img-crop';
import { ChangeAvatarApi } from '@/pages/Account/Settings/service';
import { UploadChangeParam } from 'antd/es/upload';
import DEFAULT_AVATAR from '@/assets/default_avatar.png';
import { useModel } from '@@/plugin-model/useModel';
import { ACCESS_TOKEN } from '@/utils/auth';
import { ConnectProps } from '@@/plugin-dva/connect';
import { UserCenterVO } from '@/pages/Account/Center/data';
// import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import styles from './BaseView.less';

const { Option } = Select;

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

// interface SelectItem {
//   label: string;
//   key: string;
// }

// const validatorGeographic = (
//   _: any,
//   value: {
//     province: SelectItem;
//     city: SelectItem;
//   },
//   callback: (message?: string) => void,
// ) => {
//   const { province, city } = value;
//
//   if (!province.key) {
//     callback('请输入您的所在省市!');
//   }
//
//   if (!city.key) {
//     callback('请输入您的街道地址!');
//   }
//
//   callback();
// };

const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
  const values = value.split('-');

  if (!values[0]) {
    callback('请输入您的区号!');
  }

  if (!values[1]) {
    callback('请输入您的电话号码!');
  }

  callback();
};

interface BaseViewProps extends Partial<ConnectProps>{
  userInfo?: UserCenterVO;
}

const BaseView: React.FC<BaseViewProps> = ({ userInfo,dispatch }) => {

  const handleFinish = () => {
    message.success('更新基本信息成功');
  };

  const { initialState, setInitialState } = useModel('@@initialState');
  const onChangeAvatar = (avatar: string) => {
    if (initialState?.currentUser) {
      setInitialState({ ...initialState, currentUser: { ...initialState.currentUser, avatar } });
    }
    dispatch?.({
      type: 'accountSettings/changeAvatar',
      payload: avatar
    });

  };

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={userInfo}
          hideRequiredMark
        >
          {/* <Form.Item
            name="email"
            label="邮箱"
            rules={[
              {
                required: true,
                message: '请输入您的邮箱!',
              },
            ]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            name="nickname"
            label="姓名"
            hasFeedback
            rules={[
              {
                required: true,
                message: '请输入您的昵称!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sex"
            label="性别"
            hasFeedback
            rules={[{ required: true, message: '请选择您的性别' }]}
          >
            <Select placeholder="请选择您的性别">
              <Option value={0}>男</Option>
              <Option value={1}>女</Option>
              <Option value={2}>保密</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="个人简介"
            rules={[
              {
                required: true,
                message: '请输入个人简介!',
              },
            ]}
          >
            <Input.TextArea placeholder="个人简介" rows={4} />
          </Form.Item>
          <Form.Item
            name="deptId"
            label="部门"
            rules={[
              {
                required: true,
                message: '请输入您的国家或地区!',
              },
            ]}
          >
            <Select
              style={{
                maxWidth: 220,
              }}
            >
              <Option value="China">中国</Option>
            </Select>
          </Form.Item>
         {/* <Form.Item
            name="geographic"
            label="所在省市"
            rules={[
              {
                required: true,
                message: '请输入您的所在省市!',
              },
              {
                validator: validatorGeographic,
              },
            ]}
          >
            <GeographicView />
          </Form.Item> */}
         {/* <Form.Item
            name="address"
            label="街道地址"
            rules={[
              {
                required: true,
                message: '请输入您的街道地址!',
              },
            ]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[
              {
                required: true,
                message: '请输入您的联系电话!',
              },
              {
                validator: validatorPhone,
              },
            ]}
          >
            <PhoneView />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              更新基本信息
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.right}>
        <AvatarView avatar={userInfo?.avatar || DEFAULT_AVATAR} onChangeAvatar={onChangeAvatar} />
      </div>
    </div>
  );
};

export default connect(
  ({
     userCenter,
   }: {
    userCenter: {
      userInfo: UserCenterVO;
    };
  }) => ({
    userInfo: userCenter.userInfo,
  }),
)(BaseView);
