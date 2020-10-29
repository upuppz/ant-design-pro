import { Button, Form, Input, message, Select } from 'antd';
import React from 'react';
import DEFAULT_AVATAR from '@/assets/default_avatar.png';
import { useModel } from '@@/plugin-model/useModel';
import AvatarView from '@/pages/Account/Settings/components/AvatarView';
import PhoneView from './PhoneView';
import styles from './BaseView.less';
import { useRequest } from '@@/plugin-request/request';
import { updatePersonal } from '@/pages/Account/Settings/service';

const { Option } = Select;

const validatorPhone = (rule: any, value: string) => {
  if (value) {
    const values = value.split('-');
    if (!values[0] || !values[1]) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject("请输入您的区号与号码!");
    }
  }
  return Promise.resolve();
};

const BaseView: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { loading, run } = useRequest(updatePersonal, {
    manual: true,
    onSuccess: (result) => {
      if (result) {
        message.success('更新基本信息成功');
      }else{
        message.error('更新基本信息失败')
      }
    },
    onError:() => message.error('更新基本信息失败')
  });

  if (!initialState?.currentUser) {
    return null;
  }

  const onChangeAvatar = (avatar: string) => {
    if (initialState?.currentUser) {
      setInitialState({ ...initialState, currentUser: { ...initialState.currentUser, avatar } });
    }
    // dispatch?.({
    //   type: 'accountSettings/changeAvatar',
    //   payload: avatar
    // });
  };

  const handleFinish = (values: any) => {
    run(values);
  };

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={initialState.currentUser}
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
            rules={[{ required: true, message: '请选择您的性别' }]}
          >
            <Select placeholder="请选择您的性别">
              <Option value={0}>男</Option>
              <Option value={1}>女</Option>
              <Option value={2}>保密</Option>
            </Select>
          </Form.Item>
          <Form.Item name="companyName" label="公司">
            <Input disabled />
          </Form.Item>
          <Form.Item name="deptName" label="部门" hidden={!initialState.currentUser.deptName}>
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="tel"
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
          <Form.Item>
            <Button htmlType="submit" type="primary" loading={loading}>
              更新基本信息
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.right}>
        <AvatarView
          avatar={initialState.currentUser.avatar || DEFAULT_AVATAR}
          onChangeAvatar={onChangeAvatar}
        />
      </div>
    </div>
  );
};

export default BaseView;
