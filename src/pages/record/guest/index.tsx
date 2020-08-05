import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { guests } from '@/pages/record/guest/service.ts';
import { TableListItem } from './data.d';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '#',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '来访人',
      dataIndex: 'visitor',
    },
    {
      title: '体温',
      dataIndex: 'temperature',
    },
    {
      title: '楼栋',
      dataIndex: 'buildingName',
    },
    {
      title: '人员类型',
      dataIndex: 'type',
      valueEnum: {
        0: { text: '园员职工', status: 'Default' },
        1: { text: '园区访客', status: 'Processing' },
      },
    },
    {
      title: '受访单位',
      dataIndex: 'interviewedUnit',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '登记时间',
      dataIndex: 'createdAt',
      hideInSearch: true,
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        form={{
          labelCol: { span: 6 },
        }}
        request={(params, sorter, filter) => guests({ ...params, sorter, filter })}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
