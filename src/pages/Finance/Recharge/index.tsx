import React, { useEffect, useState } from 'react';
import { Card, List, Statistic, Typography } from 'antd';
import { QueryFilter, ProFormSelect, ProFormDateRangePicker } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { PaginationProps } from 'antd/es/pagination';
import { Store } from 'antd/lib/form/interface';
import { query } from './service';
import styles from './style.less';
import { ItemType } from './data';

const targetTypeEnum = {
  1: '后台充值',
  2: '微信充值',
  3: '支付宝充值',
  4: '退款',
  0: '其它',
};

export default (): React.ReactNode => {
  const [data, setData] = useState<Array<ItemType>>([]);
  const [page, setPage] = useState<PaginationProps>({
    pageSize: 10,
    current: 1,
    total: 0,
  });

  const fetchData = (args: Store = {}) => {
    return query({ ...page, ...args })
      .then((res) => {
        setData(res.data);
        setPage({ ...page, current: res.current, total: res.total });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer
      content={
        <QueryFilter layout="vertical" defaultCollapsed onFinish={fetchData} onReset={fetchData}>
          <ProFormSelect
            name="targetType"
            label="场景"
            valueEnum={targetTypeEnum}
            placeholder="消费时的场景"
          />
          <ProFormDateRangePicker name="createdAtRange" label="消费时间" />
        </QueryFilter>
      }
    >
      <Card className={styles.custom}>
        <List<ItemType>
          itemLayout="vertical"
          pagination={{
            onChange: (newPage: number, pageSize) => {
              fetchData({ ...page, current: newPage, pageSize });
            },
            ...page,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item actions={[<span>{item.createdAt}</span>]}>
              <List.Item.Meta
                title={
                  <>
                    <p className={styles.itemNo}>No.{item.id}</p>
                    <span className={styles.targetText}>{targetTypeEnum[item.targetType]}</span>
                    <Statistic
                      className={styles.feeText}
                      valueStyle={{ color: '#cf1322' }}
                      value={item.fee}
                      precision={2}
                    />
                  </>
                }
              />
              {item.remark ? <Typography.Paragraph>{item.remark}</Typography.Paragraph> : null}
            </List.Item>
          )}
        />
      </Card>
    </PageContainer>
  );
};
