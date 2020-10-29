import { Avatar, Card, Col, List, Skeleton, Row, Statistic, Button, Space } from 'antd';
import React, { Component } from 'react';

import { Link, connect, useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import { Chart, Line } from 'bizcharts';
import { ConnectProps } from '@@/plugin-dva/connect';
import { ModalState } from './model';
import styles from './style.less';


interface WelcomeProps extends ConnectProps, ModalState {
  analysisLoading: boolean;
}

const PageHeaderContent: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.currentUser) {
    return <Skeleton avatar paragraph={{ rows: 1 }} active />;
  }

  const { currentUser } = initialState;

  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser.avatar} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          您好，
          {currentUser?.nickname}
        </div>
        <div>{currentUser?.description}</div>
      </div>
    </div>
  );
};

const ExtraContent: React.FC<{ amount: number }> = ({ amount }) => (
  <div className={styles.extraContent}>
    <div>
      <Statistic title="账户余额" valueStyle={{ color: '#ff4d4f' }} value={amount} prefix="￥" />
    </div>
    <div className={styles.btn}>
      <Space>
        <Button danger type="primary">
          充值
        </Button>
        <Button danger>钱包</Button>
      </Space>
    </div>
  </div>
);

class Welcome extends Component<WelcomeProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch?.({
      type: 'welcome/init',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch?.({
      type: 'welcome/clear',
    });
  }

  renderActivities = (item: any) => {
    const events = item.template.split(/@{([^{}]*)}/gi).map((key: React.Key) => {
      if (item[key]) {
        return (
          <a href={item[key].link} key={item[key].name}>
            {item[key].name}
          </a>
        );
      }
      return key;
    });
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          // avatar={<Avatar src={item.user.avatar} />}
          title={
            <span>
              <a className={styles.username}>{item.user.name}</a>
              &nbsp;
              <span className={styles.event}>{events}</span>
            </span>
          }
          description={
            <span className={styles.datetime} title={item.updatedAt}>
              {moment(item.updatedAt).fromNow()}
            </span>
          }
        />
      </List.Item>
    );
  };

  render() {
    const { analysisLoading, amount, consumptionTrend } = this.props;

    return (
      <PageContainer content={<PageHeaderContent />} extraContent={<ExtraContent amount={amount} />}>
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title="食堂菜谱"
              bordered={false}
              extra={<Link to="/">历史菜谱</Link>}
              loading={false}
              bodyStyle={{ padding: 0 }}
            >
              {[{
                'id': 'xxx1',
                'title': 'Alipay',
                'logo': 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
                'description': '那是一种内在的东西，他们到达不了，也无法触及的',
                'updatedAt': '2020-10-28T02:59:21.516Z',
                'member': '科学搬砖组',
                'href': '',
                'memberLink': '',
              }, {
                'id': 'xxx2',
                'title': 'Angular',
                'logo': 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
                'description': '希望是一个好东西，也许是最好的，好东西是不会消亡的',
                'updatedAt': '2017-07-24T00:00:00.000Z',
                'member': '全组都是吴彦祖',
                'href': '',
                'memberLink': '',
              }, {
                'id': 'xxx3',
                'title': 'Ant Design',
                'logo': 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
                'description': '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
                'updatedAt': '2020-10-28T02:59:21.516Z',
                'member': '中二少女团',
                'href': '',
                'memberLink': '',
              }, {
                'id': 'xxx4',
                'title': 'Ant Design Pro',
                'logo': 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
                'description': '那时候我只会想自己想要什么，从不想自己拥有什么',
                'updatedAt': '2017-07-23T00:00:00.000Z',
                'member': '程序员日常',
                'href': '',
                'memberLink': '',
              }, {
                'id': 'xxx5',
                'title': 'Bootstrap',
                'logo': 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
                'description': '凛冬将至',
                'updatedAt': '2017-07-23T00:00:00.000Z',
                'member': '高逼格设计天团',
                'href': '',
                'memberLink': '',
              }, {
                'id': 'xxx6',
                'title': 'React',
                'logo': 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
                'description': '生命就像一盒巧克力，结果往往出人意料',
                'updatedAt': '2017-07-23T00:00:00.000Z',
                'member': '骗你来学计算机',
                'href': '',
                'memberLink': '',
              }].map((item) => (
                <Card.Grid className={styles.projectGrid} key={item.id}>
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta
                      title={
                        <div className={styles.cardTitle}>
                          <Avatar size="small" src={item.logo} />
                          <Link to={item.href}>{item.title}</Link>
                        </div>
                      }
                      description={item.description}
                    />
                    <div className={styles.projectItemContent}>
                      <Link to={item.memberLink}>{item.member || ''}</Link>
                      {item.updatedAt && (
                        <span className={styles.datetime} title={item.updatedAt}>
                          {moment(item.updatedAt).fromNow()}
                        </span>
                      )}
                    </div>
                  </Card>
                </Card.Grid>
              ))}
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              bodyStyle={{ padding: 0 }}
              bordered={false}
              className={styles.activeCard}
              title="公告"
              loading={false}
            >
              <List<any>
                loading={false}
                renderItem={(item) => this.renderActivities(item)}
                dataSource={[{
                  'id': 'trend-1',
                  'updatedAt': '2020-10-28T02:59:21.516Z',
                  'user': {
                    'name': '曲丽丽',
                    'avatar': 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
                  },
                  'group': { 'name': '高逼格设计天团', 'link': 'http://github.com/' },
                  'project': { 'name': '六月迭代', 'link': 'http://github.com/' },
                  'template': '【公告】节省计划正式发布',
                }, {
                  'id': 'trend-2',
                  'updatedAt': '2020-10-28T02:59:21.516Z',
                  'user': {
                    'name': '付小小',
                    'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
                  },
                  'group': { 'name': '高逼格设计天团', 'link': 'http://github.com/' },
                  'project': { 'name': '六月迭代', 'link': 'http://github.com/' },
                  'template': '在 @{group} 新建项目 @{project}',
                }, {
                  'id': 'trend-3',
                  'updatedAt': '2020-10-28T02:59:21.516Z',
                  'user': {
                    'name': '林东东',
                    'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
                  },
                  'group': { 'name': '中二少女团', 'link': 'http://github.com/' },
                  'project': { 'name': '六月迭代', 'link': 'http://github.com/' },
                  'template': '在 @{group} 新建项目 @{project}',
                }, {
                  'id': 'trend-4',
                  'updatedAt': '2020-10-28T02:59:21.516Z',
                  'user': {
                    'name': '周星星',
                    'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
                  },
                  'project': { 'name': '5 月日常迭代', 'link': 'http://github.com/' },
                  'template': '将 @{project} 更新至已发布状态',
                }, {
                  'id': 'trend-5',
                  'updatedAt': '2020-10-28T02:59:21.516Z',
                  'user': {
                    'name': '朱偏右',
                    'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
                  },
                  'project': { 'name': '工程效能', 'link': 'http://github.com/' },
                  'comment': { 'name': '留言', 'link': 'http://github.com/' },
                  'template': '在 @{project} 发布了 @{comment}',
                }, {
                  'id': 'trend-6',
                  'updatedAt': '2020-10-28T02:59:21.516Z',
                  'user': {
                    'name': '乐哥',
                    'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
                  },
                  'group': { 'name': '程序员日常', 'link': 'http://github.com/' },
                  'project': { 'name': '品牌迭代', 'link': 'http://github.com/' },
                  'template': '在 @{group} 新建项目 @{project}',
                }]}
                className={styles.activitiesList}
                size="large"
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Card
              bodyStyle={{ padding: 30 }}
              bordered={analysisLoading}
              className={styles.billingStatement}
              title="近12个月消费趋势"
              loading={false}
            >
              <Chart scale={{ y: { min: 0, alias: '本月消费', formatter: (d: number) => `￥ ${d}` } }} autoFit height={300}
                     data={consumptionTrend}>
                <Line
                  shape="smooth"
                  position="x*y"
                  color="l (270) 0:rgba(255, 146, 255, 1) .5:rgba(100, 268, 255, 1) 1:rgba(215, 0, 255, 1)"
                />
              </Chart>
            </Card>
          </Col>
        </Row>
      </PageContainer>
    );
  }
}

export default connect(
  ({
     welcome: { amount, consumptionTrend },
     loading,
   }: {
    welcome: ModalState;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    amount,
    consumptionTrend,
    analysisLoading: loading.effects['welcome/fetchAnalysis'],
  }),
)(Welcome);
