import { HomeOutlined, FieldTimeOutlined, ClusterOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Row, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { useModel } from '@@/plugin-model/useModel';

import { CenterModalState } from '@/pages/account/center/model';
import { connect } from '@@/plugin-dva/exports';
import { Dispatch } from '@@/plugin-dva/connect';
import BaseView from './components/BaseView';
import LoginLogs from './components/LoginLogs';
import styles from './Center.less';
import 'antd/es/modal/style';

type CenterState = 'base' | 'loginLogs' | 'projects';

const Center: React.FC<{ logsTotal: number; dispatch: Dispatch }> = ({ logsTotal, dispatch }) => {
  const [tabKey, setTabKey] = useState<CenterState>('loginLogs');
  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    dispatch({
      type: 'center/loginLog',
    });
  }, []);

  if (!initialState) {
    return null;
  }

  const { currentUser } = initialState;
  const infoLoading = !currentUser || !currentUser.nickname;
  const dataLoading = infoLoading || !(currentUser && Object.keys(currentUser).length);

  const onTabChange = (key: string) => {
    setTabKey(key as CenterState);
  };

  const renderChildrenByTabKey = () => {
    /* if (tabKey === 'projects') {
      return <Projects/>;
    } */
    if (tabKey === 'loginLogs') {
      return <LoginLogs />;
    }
    if (tabKey === 'base') {
      return <BaseView />;
    }
    return null;
  };

  const operationTabList = () => {
    return [
      {
        key: 'loginLogs',
        tab: (
          <span>
            登陆历史 <span style={{ fontSize: 14 }}>({logsTotal})</span>
          </span>
        ),
      },
      {
        key: 'base',
        tab: <span>基本设置</span>,
      },
      /* {
         key: 'projects',
         tab: (
           <span>
             项目 <span style={{ fontSize: 14 }}>(8)</span>
           </span>
         ),
       }, */
    ];
  };

  const renderUserInfo = () => (
    <div className={styles.detail}>
      <p>
        <HomeOutlined
          style={{
            marginRight: 8,
          }}
        />
        {currentUser?.buildingName}
      </p>
      <p>
        <ClusterOutlined
          style={{
            marginRight: 8,
          }}
        />
        {currentUser?.deptName}
      </p>
      <p>
        <FieldTimeOutlined
          style={{
            marginRight: 8,
          }}
        />
        近一次登陆 <Tag>{currentUser?.lastLoginTime}</Tag>
      </p>
      <p>
        <TeamOutlined
          style={{
            marginRight: 8,
          }}
        />
        公司总人数 <Tag>10</Tag>
      </p>
    </div>
  );

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
            {!dataLoading && (
              <div>
                <div className={styles.avatarHolder}>
                  <img alt="" src={currentUser?.avatar} />
                  <div className={styles.name}>{currentUser?.nickname}</div>
                  <div>{currentUser?.description}</div>
                </div>
                {renderUserInfo()}
                <Divider dashed />
              </div>
            )}
          </Card>
        </Col>
        <Col lg={17} md={24} style={{ width: '100%' }}>
          <Card
            bordered={false}
            tabList={operationTabList()}
            activeTabKey={tabKey}
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

export default connect(({ center }: { center: CenterModalState }) => ({
  logsTotal: center.logsTotal,
}))(Center);
