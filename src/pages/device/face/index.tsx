import {
  DownOutlined,
  EditFilled,
  InteractionFilled,
  PlusOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, message, Tooltip, TreeSelect } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';

import { listBuildingTree } from '@/services/upms';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { TableListItem } from './data';
import { add, list, remove, syncPerson, test, update } from './service';

/**
 *
 * @param id
 */
const handleSyncPerson = async (id: number | undefined) => {
  const hide = message.loading('连接设备中,请稍等...', 0);
  await syncPerson(id);
  hide();
};

/**
 *
 * @param id
 */
const handleTest = async (id: number | undefined) => {
  const hide = message.loading('连接设备中...');
  try {
    const res = await test(id);
    hide();
    if (res) {
      message.success('设备状态正常');
      return;
    }
    message.error('设备状态异常');
  } catch (error) {
    hide();
    message.error('设备状态异常');
  }
};

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    const res = await add(fields);
    if (res.ok) {
      message.success('添加成功！');
      return true;
    }
    hide();
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: TableListItem) => {
  const hide = message.loading('正在更新');
  try {
    await update(fields);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: (string | number)[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await remove(selectedRows);
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const defaultInitialFormValues = {
  comModType: '2',
  displayModType: '1',
  ttsModType: '2',
  recStrangerType: '2',
  recStrangerTimesThreshold: 3,
  ttsModStrangerType: '2',
  identifyDistance: '0',
  saveIdentifyTime: 3,
  identifyScores: 75,
  multiplayerDetection: '2',
  recRank: '2',
  wg: '#WG{id}#',
  whitelist: '1',
};

// 当前选中的楼栋信息
let selectBuildingName: string | undefined;

const TableList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [initialFormValues] = useState<TableListItem>(defaultInitialFormValues);
  const [updateFormValues, setUpdateFormValues] = useState<TableListItem | any>({});
  const [buildingTree, setBuildingTree] = useState([]);
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    listBuildingTree().then((res) => {
      setBuildingTree(res.data);
    });
  }, []);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '#',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      valueType: 'index',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      rules: [
        {
          required: true,
          message: '设备名称为必填项',
        },
      ],
    },
    {
      title: '设备序号',
      dataIndex: 'deviceKey',
      rules: [
        {
          required: true,
          message: '设备序号为必填项',
        },
      ],
    },
    {
      title: '设备密钥',
      dataIndex: 'secret',
      hideInSearch: true,
      rules: [
        {
          required: true,
          message: '设备密钥为必填项',
        },
      ],
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      rules: [
        {
          required: true,
          message: '设备类型为必填项',
        },
      ],
      valueEnum: {
        1: { text: '食堂' },
        2: { text: '门禁' },
      },
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
      rules: [
        {
          required: true,
          message: '公司名称为必填项',
        },
      ],
    },
    {
      title: '楼栋',
      dataIndex: 'buildingId',
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <TreeSelect
            {...rest}
            onSelect={(value: any, option: any) => {
              selectBuildingName = option.title;
            }}
            placeholder="请选择"
            treeData={buildingTree}
          />
        );
      },
      rules: [
        {
          required: true,
          message: '楼栋为必选项',
        },
      ],
    },
    {
      title: '串口模式',
      dataIndex: 'comModType',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        1: { text: '开门' },
        2: { text: '不输出' },
        3: { text: '输出人员ID' },
        4: { text: '输出身份证/IC卡号' },
        100: { text: '自定义' },
      },
    },
    {
      title: '串口自定义',
      dataIndex: 'comModContent',
      hideInTable: true,
      hideInSearch: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('comModType');
        if (`${status}` !== '100') {
          return <Input {...rest} disabled />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '显示模式',
      dataIndex: 'displayModType',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        1: { text: '显示名字' },
        100: { text: '自定义' },
      },
    },
    {
      title: '显示自定义',
      dataIndex: 'displayModContent',
      hideInTable: true,
      hideInSearch: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('displayModType');
        if (`${status}` !== '100') {
          return <Input {...rest} disabled />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '语音模式',
      dataIndex: 'ttsModType',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        1: { text: '不播报语音' },
        2: { text: '播报名字' },
        100: { text: '自定义' },
      },
    },
    {
      title: '语音自定义',
      dataIndex: 'ttsModContent',
      hideInTable: true,
      hideInSearch: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('ttsModType');
        if (`${status}` !== '100') {
          return <Input {...rest} disabled />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '陌生人开关',
      dataIndex: 'recStrangerType',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        1: { text: '不识别陌生人', status: 'DEFAULT' },
        2: { text: '识别陌生人', status: 'DEFAULT' },
      },
    },
    {
      title: '陌生人判定次数',
      dataIndex: 'recStrangerTimesThreshold',
      hideInTable: true,
      hideInSearch: true,
      valueType: 'digit',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('recStrangerType');
        if (`${status}` !== '2') {
          return <Input {...rest} disabled placeholder="请输入" />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '陌生人模式',
      dataIndex: 'ttsModStrangerType',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        1: { text: '不播报语音' },
        2: { text: '语音播报 “陌生人警报”' },
        100: { text: '自定义' },
      },
      renderFormItem: (item, { defaultRender }, form) => {
        const status = form.getFieldValue('recStrangerType');
        if (`${status}` !== '2') {
          return <Input disabled placeholder="请选择" />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '陌生人自定义',
      dataIndex: 'ttsModStrangerContent',
      hideInTable: true,
      hideInSearch: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const recStrangerType = form.getFieldValue('recStrangerType');
        const ttsModStrangerType = form.getFieldValue('ttsModStrangerType');
        if (`${recStrangerType}` !== '2' || `${ttsModStrangerType}` !== '100') {
          return <Input {...rest} disabled />;
        }
        return defaultRender(item);
      },
    },
    {
      title: '识别距离',
      dataIndex: 'identifyDistance',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: { text: '无限制' },
        1: { text: '0.5米以内' },
        2: { text: '1米以内' },
        3: { text: '1.5米以内' },
        4: { text: '3米以内' },
      },
    },
    {
      title: '识别间隔(秒)',
      dataIndex: 'saveIdentifyTime',
      hideInTable: true,
      hideInSearch: true,
      valueType: 'digit',
      rules: [
        {
          type: 'number',
          max: 60,
          message: '识别间隔最大为 60 秒',
        },
      ],
    },
    {
      title: '识别分数',
      dataIndex: 'identifyScores',
      hideInTable: true,
      hideInSearch: true,
      valueType: 'digit',
      rules: [
        {
          type: 'number',
          max: 100,
          min: 60,
          message: '识别分数为 60 ~ 100',
        },
      ],
    },
    {
      title: '多人脸检测',
      dataIndex: 'multiplayerDetection',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        1: { text: '多人脸都识别' },
        2: { text: '最大人脸识别' },
      },
    },
    {
      title: '识别等级',
      dataIndex: 'recRank',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        1: { text: '无活体识别' },
        2: { text: '单目活体识别' },
        3: { text: '双目活体识别(识别距离最远为1.5米)' },
      },
    },
    {
      title: '韦根输出',
      dataIndex: 'wg',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '身份证白名单',
      dataIndex: 'whitelist',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        1: { text: '关(默认)' },
        2: { text: '开' },
      },
    },
    {
      title: '设备状态',
      dataIndex: 'status',
      hideInForm: true,
      hideInSearch: true,
      valueEnum: {
        0: { text: '等待同步中', status: 'Default' },
        1: { text: '正常', status: 'Success' },
        2: { text: '连接异常', status: 'Error' },
      },
    },
    {
      title: '注册人员数',
      dataIndex: 'personCount',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '设备IP',
      dataIndex: 'ip',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '设备版本',
      dataIndex: 'version',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '最近同步时间',
      dataIndex: 'lastSync',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: TableListItem) => (
        <>
          <Tooltip title="编辑">
            <Button
              shape="circle"
              icon={<EditFilled />}
              style={{ marginRight: '8px' }}
              onClick={() => {
                const row = record;
                handleUpdateModalVisible(true);
                setUpdateFormValues(row);
                selectBuildingName = row.buildingName;
              }}
            />
          </Tooltip>
          <Tooltip title="测试连接">
            <Button
              shape="circle"
              icon={<ThunderboltFilled />}
              style={{ marginRight: '8px' }}
              onClick={() => {
                handleTest(record.id);
              }}
            />
          </Tooltip>
          <Tooltip title="同步人员">
            <Button
              shape="circle"
              icon={<InteractionFilled />}
              onClick={() => {
                handleSyncPerson(record.id);
              }}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, { selectedRowKeys }) => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
          selectedRowKeys && selectedRowKeys.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRowKeys);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        request={(params, sorter, filter) => list({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{}}
        form={{
          labelCol: { span: 5 },
        }}
      />
      <CreateForm
        onCancel={() => {
          handleModalVisible(false);
          selectBuildingName = undefined;
        }}
        modalVisible={createModalVisible}
      >
        <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            const success = await handleAdd({
              ...value,
              buildingName: selectBuildingName,
            });
            if (success) {
              selectBuildingName = undefined;
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reloadAndRest();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
          form={{
            initialValues: initialFormValues,
            labelCol: { span: 6 },
          }}
        />
      </CreateForm>
      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          onCancel={() => {
            handleUpdateModalVisible(false);
            setUpdateFormValues({});
            selectBuildingName = undefined;
          }}
          modalVisible={updateModalVisible}
        >
          <ProTable<TableListItem, TableListItem>
            onSubmit={async (value) => {
              const success = await handleUpdate({
                ...value,
                id: updateFormValues.id,
                buildingName: selectBuildingName,
              });
              if (success) {
                selectBuildingName = undefined;
                handleUpdateModalVisible(false);
                setUpdateFormValues({});
                if (actionRef.current) {
                  actionRef.current.reloadAndRest();
                }
              }
            }}
            rowKey="id"
            type="form"
            columns={columns}
            form={{
              initialValues: updateFormValues,
              labelCol: { span: 6 },
            }}
          />
        </UpdateForm>
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
