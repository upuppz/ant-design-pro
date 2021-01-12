import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Badge, Tag, TreeSelect } from 'antd';
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
      title: '资金类型',
      align: 'center',
      dataIndex: 'type',
      valueEnum: {
        0: { text: '支出', status: 'Success' },
        1: { text: '收入', status: 'Error' },
      },
    },
    {
      title: '业务类型',
      align: 'center',
      dataIndex: 'targetType',
      render: (text, row) => {
        if (row.type === 0) {
          // 支出
          switch (text) {
            case 1:
              return <Badge status="success" text="食堂-IC卡扣费" />;
            case 2:
              return <Badge status="error" text="食堂-人工扣费" />;
            case 3:
              return <Badge status="processing" text="食堂-人脸消费" />;
            default:
              return <Badge status="default" text="其它" />;
          }
        } else {
          // 收入
          switch (text) {
            case 1:
              return <Badge status="success" text="后台充值" />;
            case 2:
              return <Badge status="error" text="微信充值" />;
            case 3:
              return <Badge status="processing" text="支付宝充值" />;
            case 4:
              return <Badge status="warning" text="退款" />;
            default:
              return <Badge status="default" text="其它" />;
          }
        }
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
      hideInForm: true,
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
