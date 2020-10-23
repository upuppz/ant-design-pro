import { HomeOutlined, ClusterOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Row, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { useModel } from '@@/plugin-model/useModel';
import { Link, Dispatch, connect } from 'umi';
import { ModalState } from './model';
import BaseView from './components/BaseView';
import LoginLogs from './components/LoginLogs';
import styles from './style.less';

type CenterState = 'base' | 'loginLogs' | 'projects';


const Center: React.FC<{ dispatch: Dispatch, userCenter: ModalState, loading: boolean }> =
  ({ userCenter, dispatch, loading }) => {
    const [tabKey, setTabKey] = useState<CenterState>('loginLogs');
    const { initialState } = useModel('@@initialState');

    useEffect(() => {
      dispatch({
        type: 'userCenter/listLoginLog',
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
        return <LoginLogs dispatch={dispatch} loading={loading} logs={userCenter.logs}
                          logsCurrent={userCenter.logsCurrent} logsPages={userCenter.logsPages}
                          logsTotal={userCenter.logsTotal} userInfo={userCenter.userInfo} />;
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
            登陆日志 <span style={{ fontSize: 14 }}>({userCenter.logsTotal})</span>
          </span>
          ),
        },
        {
          key: 'projects',
          tab: (
            <span>
               我的项目 <span style={{ fontSize: 14 }}>(8)</span>
             </span>
          ),
        },
        {
          key: 'base1',
          tab: <span>通知</span>,
        },
        {
          key: 'base2',
          tab: <span>消息</span>,
        },
        {
          key: 'base3',
          tab: <span>待办</span>,
        },
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
          {userCenter.userInfo.deptName}
        </p>
        {/* <p>
        <FieldTimeOutlined
          style={{
            marginRight: 8,
          }}
        />
        近一次登陆 <Tag>{currentUser?.lastLoginTime}</Tag>
      </p> */}
        {/* <p>
        <TeamOutlined
          style={{
            marginRight: 8,
          }}
        />
        公司总人数 <Tag>10</Tag>
      </p> */}
        <p>
          <HomeOutlined
            style={{
              marginRight: 8,
            }}
          />
          {userCenter.userInfo.buildings}
        </p>
      </div>
    );

    const renderTagList = () => (
      <div className={styles.tags}>
        <div className={styles.tagsTitle}>角色</div>
        {(userCenter.userInfo.roles || []).map((item, index) => (
          <Tag key={index.toString()}>{item}</Tag>
        ))}
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
                  {renderTagList()}
                  <Divider style={{ marginTop: 16 }} dashed />
                  <div className={styles.team}>
                    <div className={styles.teamTitle}>快捷方式</div>
                    <Row gutter={36}>
                      <Col span={24}>
                        <Link to="#">
                          <Avatar size="small"
                                  src='https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png' />
                          科学搬砖组
                        </Link>
                      </Col>
                      <Col span={24}>
                        <Link to="#">
                          <Avatar size="small"
                                  src='https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png' />
                          全组都是吴彦祖
                        </Link>
                      </Col>
                      <Col span={24}>
                        <Link to="#">
                          <Avatar size="small"
                                  src='https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png' />
                          骗你来学计算机
                        </Link>
                      </Col>
                    </Row>
                  </div>
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

export default connect(
  ({
     userCenter,
     loading,
   }: {
    userCenter: ModalState,
    loading: { effects: { [key: string]: boolean } }
  }) => ({
    userCenter,
    loading: loading.effects['userCenter/listLoginLog'],
  }))(Center);
