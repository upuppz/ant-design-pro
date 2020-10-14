import React, { useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Form, Input, Modal, notification, Space, Tag, TreeSelect } from 'antd';
import { listDeptTree } from '@/services/upms';
import { all } from '@/pages/rst/extra-cost/service';
import { TableListItem } from './data';
import { dtoPage, refund as refundReq } from './service';

export default () => {
  const [deptTree, setDeptTree] = useState([]);
  const [extraCosts, setExtraCosts] = useState({});
  const [refund, setRefund] = useState<TableListItem>();
  const [refundVisible, setRefundVisible] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    listDeptTree().then((res) => {
      setDeptTree(res.data);
    });
    all().then((res) => {
      const json = {};
      res.data.forEach((item: { id: string | number; name: any }) => {
        json[item.id] = item.name;
      });
      setExtraCosts(json);
    });
  }, []);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '流水号',
      dataIndex: 'id',
      align: 'center',
      sorter: true,
      defaultSortOrder: 'descend',
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
      hideInSearch: true,
      dataIndex: 'deptName',
    },
    {
      title: '部门',
      dataIndex: 'deptId',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return <TreeSelect {...rest} allowClear placeholder="请选择" treeData={deptTree} />;
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
        1: { text: '食堂 - IC卡扣费', status: 'Error' },
        2: { text: '食堂 - 人工扣费', status: 'Processing' },
        3: { text: '食堂 - 人脸消费', status: 'Warning' },
      },
    },
    {
      title: '额外收费项',
      align: 'center',
      dataIndex: 'extraCost',
      renderText: (text: string) => {
        const strings = text.split(',');
        if (text.length > 0) {
          return strings.map((str: string) => extraCosts[str]).join(',');
        }
        return text;
      },
      ellipsis: true,
      width: 200,
    },
    {
      title: '金额',
      align: 'center',
      hideInSearch: true,
      dataIndex: 'fee',
      render: (text) => <Tag color="success">{text}</Tag>,
    },
    {
      title: '结余的金额',
      align: 'center',
      dataIndex: 'balance',
      hideInSearch: true,
      render: (text) => <Tag color="warning">{text}</Tag>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'relatedId',
      align: 'center',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          {record.relatedId === 0 ? (
            <Button
              type="primary"
              onClick={() => {
                setRefundVisible(true);
                setRefund({ ...record, fee: Math.abs(record.fee) });
              }}
            >
              退款
            </Button>
          ) : (
            <Button disabled>已退款</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        params={{ sorter: 'descend' }}
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        request={(params, sorter, filter) => {
          return dtoPage({ ...params, sorter: { createdAt: 'descend', ...sorter }, filter });
        }}
      />
      <Modal
        destroyOnClose
        title="退款"
        visible={refundVisible}
        okButtonProps={{ loading: refundLoading }}
        cancelButtonProps={{ loading: refundLoading }}
        onCancel={() => {
          setRefundVisible(false);
        }}
        onOk={() => {
          form.submit();
        }}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          form={form}
          onFinish={(values) => {
            setRefundLoading(true);
            refundReq({ id: values.id, reason: values.reason })
              .then(() => {
                notification.success({
                  message: '退款成功',
                  description: `已成功为该记录退款`,
                });
                setRefundLoading(false);
                setRefundVisible(false);
                if (actionRef.current) {
                  // @ts-ignore
                  actionRef.current.reloadAndRest();
                }
              })
              .catch((err) => {
                setRefundVisible(false);
                setRefundLoading(false);
                notification.error({ message: err.data.data, description: err.data.msg });
              });
          }}
          initialValues={refund}
        >
          <Form.Item label="入账流水号" name="id">
            <Input disabled />
          </Form.Item>
          <Form.Item label="姓名" name="nickname">
            <Input disabled />
          </Form.Item>
          <Form.Item label="部门" name="deptName">
            <Input disabled />
          </Form.Item>
          <Form.Item label="退款金额" name="fee">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="退款原因"
            name="reason"
            rules={[{ max: 255, message: '最多不能超过255个字符' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
};
