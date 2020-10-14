import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import moment from 'moment';
import { connect, Dispatch } from 'umi';

import PageLoading from './components/PageLoading';
import { AnalysisData } from './data';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));
// const ProportionSales = React.lazy(() => import('./components/ProportionSales'));

type RangePickerValue = RangePickerProps<moment.Moment>['value'];

interface AnalysisProps {
  dashboardAndAnalysis: AnalysisData;
  dispatch: Dispatch;
  loading: boolean;
  trendLoading: boolean;
}

interface AnalysisState {
  salesType: 'all' | 'online' | 'stores';
}

class Analysis extends Component<AnalysisProps, AnalysisState> {
  reqRef: number = 0;

  timeoutId: number = 0;

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'dashboardAndAnalysis/fetch',
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAndAnalysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChange = (
    tableKey: string,
    dataLevel: TYPE.DataLevelType,
    rangePickerValue: RangePickerValue,
    dateRange: [string, string],
  ) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAndAnalysis/fetchTrendData',
      payload: { tableKey, dataLevel, dateRange },
    });
  };

  render() {
    const { dashboardAndAnalysis, loading } = this.props;
    const { analysisData, salesData, membershipData } = dashboardAndAnalysis;

    return (
      <GridContent>
        <React.Fragment>
          <Suspense fallback={<PageLoading />}>
            <IntroduceRow loading={loading} analysisData={analysisData} />
          </Suspense>
          <Suspense fallback={null}>
            <SalesCard
              // rangePickerValue={rangePickerValue}
              trendData={{ salesData, membershipData }}
              // isActive={this.isActive}
              handleChange={this.handleChange}
              loading={loading}
              // selectDate={this.selectDate}
            />
          </Suspense>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default connect(
  ({
    dashboardAndAnalysis,
    loading,
  }: {
    dashboardAndAnalysis: AnalysisData;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    dashboardAndAnalysis,
    loading: loading.effects['dashboardAndAnalysis/fetch'],
  }),
)(Analysis);
