import { HomeOutlined, FieldTimeOutlined, ClusterOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Input, Row, Tag } from 'antd';
import React, { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import { RouteChildrenProps } from 'react-router';
import { EnterpriseModalState } from './model';
import BaseView from './components/BaseView';
import LoginLogs from './components/LoginLogs';
import { EnterpriseInfo } from './data.d';
import styles from './Center.less';

interface CenterProps extends RouteChildrenProps {
  dispatch: Dispatch;
  info: Partial<EnterpriseInfo>;
  infoLoading: boolean;
  logsTotal: number;
}

interface CenterState {
  tabKey?: 'base' | 'loginLogs' | 'projects';
}

class Center extends Component<CenterProps, CenterState> {
  state: CenterState = {
    tabKey: 'loginLogs',
  };

  public input: Input | null | undefined = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'enterprise/info',
    });
    dispatch({
      type: 'enterprise/loginLog',
    });
  }

  onTabChange = (key: string) => {
    // If you need to sync state to url
    // const { match } = this.props;
    // router.push(`${match.url}/${key}`);
    this.setState({
      tabKey: key as CenterState['tabKey'],
    });
  };

  renderChildrenByTabKey = (tabKey: CenterState['tabKey']) => {
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

  operationTabList = (logsTotal: number) => {
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

  renderUserInfo = (currentUser: Partial<EnterpriseInfo>) => (
    <div className={styles.detail}>
      <p>
        <HomeOutlined
          style={{
            marginRight: 8,
          }}
        />
        {currentUser.buildingName}
      </p>
      <p>
        <ClusterOutlined
          style={{
            marginRight: 8,
          }}
        />
        {currentUser.deptName}
      </p>
      <p>
        <FieldTimeOutlined
          style={{
            marginRight: 8,
          }}
        />
        近一次登陆 <Tag>{currentUser.lastLoginTime}</Tag>
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

  render() {
    const { tabKey } = this.state;
    const { info = {}, infoLoading, logsTotal } = this.props;
    const dataLoading = infoLoading || !(info && Object.keys(info).length);
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
              {!dataLoading && (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={info.avatar} />
                    <div className={styles.name}>{info.nickname}</div>
                    <div>{info.description}</div>
                  </div>
                  {this.renderUserInfo(info)}
                  <Divider dashed />
                </div>
              )}
            </Card>
          </Col>
          <Col lg={17} md={24} style={{ width: '100%' }}>
            <Card
              bordered={false}
              tabList={this.operationTabList(logsTotal)}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
              style={{ width: '100%' }}
            >
              {this.renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default connect(
  ({
    loading,
    enterprise,
  }: {
    loading: { effects: { [key: string]: boolean } };
    enterprise: EnterpriseModalState;
  }) => ({
    info: enterprise.info,
    logsTotal: enterprise.logsTotal,
    infoLoading: loading.effects['enterprise/info'],
  }),
)(Center);
