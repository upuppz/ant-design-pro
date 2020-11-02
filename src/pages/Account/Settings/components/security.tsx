import React, { useState } from 'react';
import { List, message } from 'antd';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { getSecurity, restPassword } from '@/pages/Account/Settings/service';
import { useRequest } from 'umi';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const passwordStrength = {
  strong: <span className="strong">强</span>,
  medium: <span className="medium">中</span>,
  weak: <span className="weak">弱</span>,
};

const SecurityView: React.FC = () => {
  const [restPasswordModelVisible, setRestPasswordModelVisible] = useState<boolean>(false);
  const { data: securityData, loading: securityLoading } = useRequest(getSecurity);
  const { loading, run } = useRequest(restPassword, { manual: true });


  const data = [
    {
      title: '账户密码',
      description: <>当前密码强度: {securityData?.passwordStrength ? passwordStrength[securityData?.passwordStrength] : passwordStrength.strong}</>,
      actions: [
        <ModalForm
          key="restPassword"
          style={{ textAlign: 'left' }}
          title="重置密码"
          visible={restPasswordModelVisible}
          onVisibleChange={setRestPasswordModelVisible}
          trigger={<a key="restPassword">修改</a>}
          modalProps={{ width: 500 }}
          onFinish={async (values) => {
            run(values as RestPasswordVO).then((res) => {
              if (res) {
                message.success('重置密码成功!');
                setRestPasswordModelVisible(false);
              } else {
                message.error('重置密码失败!');
              }
            });
            return true;
          }}
          submitter={{ submitButtonProps: { loading } }}
          layout="horizontal"
          labelCol={{ span: 4 }}
        >
          <ProFormText.Password
            // @ts-ignore
            width="100%"
            hasFeedback
            label="当前密码"
            name="oldPassword"
            rules={[
              {
                required: true,
                message: '请输入您当前的密码！',
              },
              {
                min: 8,
                max: 20,
                message: '密码长度应为8-20位',
              },
            ]}
          />
          <ProFormText.Password
            // @ts-ignore
            width="100%"
            label="新密码"
            name="newPassword"
            hasFeedback
            rules={[
              {
                required: true,
                message: '请输入您新的密码！',
              },
              {
                min: 8,
                max: 20,
                message: '密码长度应为8-20位',
              },
            ]}
          />
          <ProFormText.Password
            // @ts-ignore
            width="100%"
            label="确认密码"
            name="confirmPassword"
            hasFeedback
            validateFirst
            rules={[
              {
                required: true,
                message: '请在次输入您新的密码！!',
              },
              {
                min: 8,
                max: 20,
                message: '密码长度应为8-20位',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject('您输入的两个密码不匹配！');
                },
              }),
            ]}
          />
        </ModalForm>,
      ],
    },
    {
      title: '密保手机',
      description: securityData?.mobile?`已绑定手机：${securityData?.mobile}`:'暂未绑定手机',
      actions: [<a key="Modify">{securityData?.mobile?'修改':'绑定'}</a>],
    },
    // {
    //   title: 'accountandsettings.security.question',
    //   description: 'accountandsettings.security.question-description',
    //   actions: [<a key="Set">Set</a>],
    // },
    // {
    //   title: '备用邮箱',
    //   description: '已绑定邮箱：ant***sign.com',
    //   actions: [<a key="Modify">修改</a>],
    // },
    // {
    //   title: 'MFA 设备',
    //   description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
    //   actions: [<a key="bind">绑定</a>],
    // },
  ];
  return (
    <>
      <List<Unpacked<typeof data>>
        loading={securityLoading}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </>
  );
};

export default SecurityView;
