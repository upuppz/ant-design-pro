import React, { useEffect, useState } from 'react';
import { useModel } from '@@/plugin-model/useModel';
import { Card, List, Statistic, Tag, Typography } from 'antd';
import { QueryFilter, ProFormSelect, ProFormDateRangePicker } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { PaginationProps } from 'antd/es/pagination';
import { Store } from 'antd/lib/form/interface';
import { query, extraCost } from './service';
import styles from './style.less';
import { ItemType } from './data';

const targetTypeEnum = {
  1: '食堂 - IC卡扣费',
  2: '食堂 - 人工扣费',
  3: '食堂 - 人脸消费',
  0: '其它',
};

export default (): React.ReactNode => {
  const { initialState } = useModel('@@initialState');
  if (!initialState?.currentUser) {
    return null;
  }

  const [extraCosts, setExtraCosts] = useState({});
  const [data, setData] = useState<Array<ItemType>>([]);
  const [page, setPage] = useState<PaginationProps & { uid: number }>({
    uid: initialState.currentUser.userId,
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
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
    extraCost()
      .then((res) => {
        const json = {};
        res.forEach((item: { id: string | number; name: any }) => {
          json[item.id] = item.name;
        });
        setExtraCosts(json);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleExtraCosts = (text: string) => {
    if (text) {
      const strings = text?.split(',');
      if (text.length > 1) {
        return strings.map((str: string) => <Tag key={str}>{extraCosts[str]}</Tag>);
      }
    }
    return '无附加费用项';
  };

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
                className={styles.itemMeta}
                title={
                  <>
                    <p className={styles.itemNo}>No.{item.id}</p>
                    <span className={styles.targetText}>{targetTypeEnum[item.targetType]}</span>
                    <Statistic className={styles.feeText} valueStyle={{ color: '#3f8600' }} value={item.fee} precision={2} />
                  </>
                }
                description={handleExtraCosts(item.extraCost)}
              />
              <Typography.Paragraph>{item.remark}</Typography.Paragraph>
            </List.Item>
          )}
        />
      </Card>
    </PageContainer>
  );
};
