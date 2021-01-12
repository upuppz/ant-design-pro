import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Tag, TreeSelect } from 'antd';
import { listDeptTree } from '@/services/upms';
import { TableListItem } from './data';
import { dtoPage } from './service';

export default () => {
  const [deptTree, setDeptTree] = useState([]);

  useEffect(() => {
    listDeptTree().then((res) => {
      setDeptTree(res.data);
    });
  }, []);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '#',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'nickname',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueEnum: {
        0: { text: '男', status: 'Default' },
        1: { text: '女', status: 'Processing' },
        2: { text: '保密', status: 'Error' },
      },
    },
    {
      title: '部门',
      search: false,
      dataIndex: 'deptName',
    },
    {
      title: '部门',
      dataIndex: 'deptId',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return <TreeSelect allowClear placeholder="请选择" treeData={deptTree} />;
      },
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: 'IC卡号',
      dataIndex: 'icNum',
    },
    {
      title: '业务类型',
      align: 'center',
      dataIndex: 'targetType',
      valueEnum: {
        0: { text: '其它', status: 'Default' },
        1: { text: '后台充值', status: 'Error' },
        2: { text: '微信充值', status: 'Success' },
        3: { text: '支付宝充值', status: 'Warning' },
        4: { text: '退款', status: 'Processing' },
      },
    },
    {
      title: '金额',
      align: 'center',
      search: false,
      dataIndex: 'fee',
      render: (text) => <Tag color="success">{text}</Tag>,
    },
    {
      title: '结余的金额',
      align: 'center',
      dataIndex: 'balance',
      search: false,
      render: (text) => <Tag color="warning">{text}</Tag>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: true,
      search: false,
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        rowKey="id"
        columns={columns}
        request={(params, sorter, filter) =>
          dtoPage({ ...params, sorter: { createdAt: 'descend', ...sorter }, filter })
        }
      />
    </PageHeaderWrapper>
  );
};
