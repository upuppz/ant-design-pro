import { Card, DatePicker, Tabs } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import moment from 'moment';

import React, { useEffect, useState } from 'react';
import { getTimeDistance } from '@/pages/welcome/utils/utils';
import { TrendDataType } from '../data';
import { Bar } from './Charts';
import styles from '../style.less';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

type RangePickerValue = RangePickerProps<moment.Moment>['value'];

const defaultFormat = 'YYYY-MM-DD';

let tableKey = 'membership';

const SalesCard = ({
  trendData,
  handleChange,
  loading,
  format,
}: {
  format?: string;
  trendData: TrendDataType;
  loading: boolean;
  handleChange: (
    tableKey: string,
    dataLevel: TYPE.DataLevelType,
    dates: RangePickerValue,
    dateStrings: [string, string],
  ) => void;
}) => {
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>(
    getTimeDistance('YEAR'),
  );
  const [dataLevel, setDataLevel] = useState<TYPE.DataLevelType>('YEAR');

  const callHandleChange = (key?: string) => {
    const startStr =
      rangePickerValue && rangePickerValue[0]
        ? rangePickerValue[0].format(format || defaultFormat)
        : '';
    const endStr =
      rangePickerValue && rangePickerValue[1]
        ? rangePickerValue[1].format(format || defaultFormat)
        : '';
    handleChange(key || tableKey, dataLevel, rangePickerValue, [startStr, endStr]);
  };

  useEffect(() => {
    callHandleChange();
    // console.log("callHandleChange")
  }, [dataLevel]);

  useEffect(() => {
    callHandleChange('sales');
  }, []);

  const selectDate = (type: TYPE.DataLevelType) => {
    setRangePickerValue(getTimeDistance(type));
    setDataLevel(type);
  };

  const rangePickerChange = (
    rangePickerValue1: RangePickerValue,
    dateStrings: [string, string],
  ) => {
    setRangePickerValue(rangePickerValue1);
    handleChange(tableKey, dataLevel, rangePickerValue1, dateStrings);
  };

  return (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <a
                  className={dataLevel === 'TODAY' ? styles.currentDate : ''}
                  onClick={() => selectDate('TODAY')}
                >
                  今日
                </a>
                <a
                  className={dataLevel === 'WEEK' ? styles.currentDate : ''}
                  onClick={() => selectDate('WEEK')}
                >
                  本周
                </a>
                <a
                  className={dataLevel === 'MONTH' ? styles.currentDate : ''}
                  onClick={() => selectDate('MONTH')}
                >
                  本月
                </a>
                <a
                  className={dataLevel === 'YEAR' ? styles.currentDate : ''}
                  onClick={() => selectDate('YEAR')}
                >
                  全年
                </a>
              </div>
              <RangePicker
                format={format || defaultFormat}
                value={rangePickerValue}
                onChange={rangePickerChange}
                style={{ width: 256 }}
              />
            </div>
          }
          defaultActiveKey={tableKey}
          onChange={(key) => {
            tableKey = key;
          }}
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane tab="用餐人数" key="membership">
            <div className={styles.salesBar}>
              <Bar height={295} title="用餐趋势" data={trendData.membershipData} />
            </div>
          </TabPane>
          <TabPane tab="销售额" key="sales">
            <div className={styles.salesBar}>
              <Bar height={295} title="销售趋势" data={trendData.salesData} />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  );
};

export default SalesCard;
