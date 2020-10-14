import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';

import React from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, MiniBar, Field } from './Charts';
import { AnalysisDataType } from '../data';
import Trend from './Trend';
import styles from '../style.less';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = ({
  loading,
  analysisData,
}: {
  loading: boolean;
  analysisData: AnalysisDataType;
}) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="今日用餐人数"
        action={
          <Tooltip title="总注册在内的会员人数">
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={numeral(analysisData.todayMembership).format('0,0')}
        footer={
          <Field label="会员总人数" value={numeral(analysisData.totalMembership).format('0,0')} />
        }
        contentHeight={46}
      >
        {/* eslint-disable-next-line no-nested-ternary */}
        <Trend
          flag={
            analysisData.weeklyOnWeekly === 0
              ? null
              : analysisData.weeklyOnWeekly > 0
              ? 'up'
              : 'down'
          }
          style={{ marginRight: 16 }}
        >
          周同比
          <span className={styles.trendText}>{analysisData.weeklyOnWeekly}%</span>
        </Trend>
        {/* eslint-disable-next-line no-nested-ternary */}
        <Trend
          flag={analysisData.dayOnDay === 0 ? null : analysisData.dayOnDay > 0 ? 'up' : 'down'}
        >
          日同比
          <span className={styles.trendText}>{analysisData.dayOnDay}%</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="今日销售额"
        action={
          <Tooltip title="所有用餐消费汇总（已过滤退款记录）">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={`￥${numeral(analysisData.todaySales).format('0,0.00')}`}
        footer={
          <Field
            label="总销售额"
            value={`￥${numeral(analysisData.totalSales).format('0,0.00')}`}
          />
        }
        contentHeight={46}
      >
        <MiniArea line height={46} data={analysisData.salesData} />
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="今日用餐数"
        action={
          <Tooltip title="所有用户历史用餐次数">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(analysisData.todayMeals).format('0,0')}
        footer={<Field label="总用餐数" value={numeral(analysisData.totalMeals).format('0,0')} />}
        contentHeight={46}
      >
        <MiniArea line height={46} data={analysisData.mealsData} />
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title="今日充值金额"
        action={
          <Tooltip title="通过后台、支付宝、微信充值入账统计">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={`￥${numeral(analysisData.todayRechargeAmount).format('0,0.00')}`}
        footer={
          <Field
            label="总充值金额"
            value={`￥${numeral(analysisData.totalRechargeAmount).format('0,0.00')}`}
          />
        }
        contentHeight={46}
      >
        <MiniBar data={analysisData.rechargeAmountData} />
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
