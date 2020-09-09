import { Modal, Image } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import moment from 'moment';
import { TableListItem } from './data.d';
import { page } from './service';

const TableList: React.FC = () => {
  const [showModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '#',
      dataIndex: 'id',
    },
    {
      title: '设备序列号',
      dataIndex: 'deviceKey',
    },
    {
      title: '识别时间',
      dataIndex: 'time',
      renderText: (text) => {
        return moment(Number(text)).format('YYYY-MM-DD hh:mm:ss');
      },
    },
    {
      title: '识别类型',
      dataIndex: 'type',
      valueEnum: {
        face_2: { text: '刷脸识别', status: 'Error' },
        faceAndcard_2: { text: '人&卡模式', status: 'Success' },
      },
    },
    {
      title: '抓拍照片',
      dataIndex: 'imgBase64',
      render: (text) => <Image width={100} src={`data:image/jpeg;base64,${text}`} />,
    },
    {
      title: 'ip',
      dataIndex: 'ip',
    },
    {
      title: '识别比分',
      dataIndex: 'searchScore',
    },
    {
      title: '活体比分',
      dataIndex: 'livenessScore',
    },
    {
      title: '体度',
      dataIndex: 'temperature',
    },
    {
      title: '体温异常值',
      dataIndex: 'standard',
    },
    {
      title: '体温状态',
      dataIndex: 'temperatureState',
      valueEnum: {
        1: { text: '正常', status: 'Success' },
        2: { text: '异常', status: 'Error' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: true,
      hideInForm: true,
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        request={(params, sorter, filter) => page({ ...params, sorter, filter })}
        columns={columns}
      />
      <Modal
        destroyOnClose
        title="新建收费项"
        visible={showModalVisible}
        onCancel={() => handleModalVisible(false)}
        footer={null}
      >
        <></>
      </Modal>
    </PageContainer>
  );
};

export default TableList;
