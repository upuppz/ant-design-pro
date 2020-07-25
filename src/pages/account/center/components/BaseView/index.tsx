import React, { useEffect } from 'react';
import { EnterpriseInfo } from '@/pages/account/center/data';
import { Button, Form, Input, message, Upload } from 'antd';
import { connect } from 'umi';
import { EnterpriseModalState } from '@/pages/account/center/model';
import { UploadOutlined } from '@ant-design/icons/lib';
import styles from './style.less';

const handleFinish = () => {
  // message.success('更新基本信息成功');
  message.success('功能开发中...');
};

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string | undefined }) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          更换头像
        </Button>
      </div>
    </Upload>
  </>
);

const BaseView: React.FC<{ info: Partial<EnterpriseInfo> }> = ({ info }) => {
  const [useForm] = Form.useForm();

  /* const getViewDom = useRef(null); */

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
        <AvatarView avatar={info.avatar} />
      </div>
    </div>
  );
};

export default connect(({ enterprise }: { enterprise: EnterpriseModalState }) => ({
  info: enterprise.info,
}))(BaseView);
