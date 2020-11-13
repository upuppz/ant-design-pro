import { ClusterOutlined, PhoneOutlined, UnlockOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Row, Tag } from 'antd';
import React, { useEffect,  useState } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import DEFAULT_AVATAR from '@/assets/default_avatar.png';
import { useModel } from '@@/plugin-model/useModel';
import { ConnectRC } from '@@/plugin-dva/connect';
import { connect } from '@@/plugin-dva/exports';
import { Link } from 'umi';
import { ModalState } from './model';
import LoginLogs from './components/LoginLogs';
import styles from './style.less';
import Faces from './components/Faces';

type CenterState = 'loginLogs' | 'faces';

const Center: ConnectRC<{ logsTotal: number }> = ({ logsTotal, dispatch }) => {
  const [tabKey, setTabKey] = useState<CenterState>('loginLogs');
  const { initialState } = useModel<'@@initialState'>('@@initialState');

  useEffect(() => {
    dispatch({
      type: 'accountCenter/listLoginLog',
    });
  }, []);

  if (!initialState?.currentUser) {
    return null;
  }

  const { currentUser } = initialState;

  const onTabChange = (key: string) => {
    setTabKey(key as CenterState);
  };

  const renderChildrenByTabKey = () => {
    if (tabKey === 'loginLogs') {
      return <LoginLogs />;
    }
    if (tabKey === 'faces') {
      return <Faces />;
    }
    return null;
  };

  const operationTabList = () => {
    return [
      {
        key: 'loginLogs',
        tab: (
          <span>
            登陆日志 <span style={{ fontSize: 14 }}>({logsTotal})</span>
          </span>
        ),
      },
      {
        key: 'faces',
        tab: (
          <span>
            人脸识别
          </span>
        ),
      },
      // {
      //   key: 'base1',
      //   tab: <span>通知</span>,
      // },
      // {
      //   key: 'base2',
      //   tab: <span>消息</span>,
      // },
      // {
      //   key: 'base3',
      //   tab: <span>待办</span>,
      // },
    ];
  };

  const renderUserInfo = () => (
    <div className={styles.detail}>
      <p>
        <ClusterOutlined
          style={{
            marginRight: 8,
          }}
        />
        {currentUser?.companyName} - {currentUser?.deptName}
      </p>
      <p>
        <PhoneOutlined  style={{
          marginRight: 8,
        }}/>
        {currentUser?.tel}
      </p>
    </div>
  );

  const renderTagList = () => (
    <div className={styles.tags}>
      <div className={styles.tagsTitle}>角色</div>
      {(currentUser.roleNames || []).map((item, index) => (
        <Tag key={index.toString()}>{item}</Tag>
      ))}
    </div>
  );

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}  style={{ width: '100%' }}>
          <Card bordered={false} style={{ marginBottom: 24 }}>
            <div>
              <div className={styles.avatarHolder}>
                <img alt="" src={currentUser.avatar || DEFAULT_AVATAR} />
                <div className={styles.name}>{currentUser.nickname}</div>
                <div>{currentUser.description}</div>
              </div>
              {renderUserInfo()}
              <Divider dashed />
              {renderTagList()}
              <Divider style={{ marginTop: 16 }} dashed />
              <div className={styles.team}>
                <div className={styles.teamTitle}>快捷方式</div>
                 <Row gutter={36}>
                  <Col span={12}>
                    <Link to={{
                      pathname:"/account/settings",
                      state: { selectKey: 'security' },
                    }}>
                      <Avatar
                        size="small"
                        icon={<UnlockOutlined />}
                      />
                      重置密码
                    </Link>
                  </Col>
                </Row>
              </div>
            </div>
          </Card>
        </Col>
        <Col lg={17} md={24} style={{ width: '100%' }}>
          <Card
            bordered={false}
            tabList={operationTabList()}
            activeTabKey={tabKey}
            tabProps={{}}
            onTabChange={onTabChange}
            style={{ width: '100%' }}
          >
            {renderChildrenByTabKey()}
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};

export default connect(({ accountCenter }: { accountCenter: ModalState }) => ({
  logsTotal: accountCenter.logsTotal,
}))(Center);
