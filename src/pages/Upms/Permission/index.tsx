import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message, TreeSelect } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { TableListItem } from './data';
import { list, update, add, remove } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await add({ ...fields });
    hide();
    message.success('添加成功');
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

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState<TableListItem | any>({});
  const [permissions, setPermissions] = useState<any>([]);
  const actionRef = useRef<ActionType>();

  const fetchData = async (params: any) => {
    const msg = await list(params);
    setPermissions(msg.data);
    return msg;
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '权限名称',
      dataIndex: 'title',
      hideInForm: true,
    },
    {
      title: '权限名称',
      dataIndex: 'permissionName',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入',
          },
        ],
      },
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入',
          },
        ],
      },
    },
    {
      title: '上级权限',
      dataIndex: 'parentId',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return <TreeSelect {...rest} placeholder="请选择" treeData={permissions} />;
      },
    },
    {
      title: '排序',
      search: false,
      dataIndex: 'orderNum',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: TableListItem) => (
        <>
          <a
            onClick={() => {
              const row = {
                permissionId: record.value,
                permissionName: record.title,
                permission: record.permission,
                parentId: record.parentId === 0 ? null : record.parentId,
                orderNum: record.orderNum,
              };
              handleUpdateModalVisible(true);
              setUpdateFormValues(row);
            }}
          >
            编辑
          </a>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="value"
        toolBarRender={(action, { selectedRowKeys }) => [
          <Button key='create' type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
          selectedRowKeys && selectedRowKeys.length > 0 && (
            <Dropdown
              key='batch'
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
        request={fetchData}
        columns={columns}
        rowSelection={{}}
        search={false}
        pagination={false}
        form={{
          labelCol: { span: 5 },
        }}
      />
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="value"
          type="form"
          columns={columns}
          form={{ labelCol: { span: 4 } }}
        />
      </CreateForm>
      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          onCancel={() => {
            handleUpdateModalVisible(false);
            setUpdateFormValues({});
          }}
          modalVisible={updateModalVisible}
        >
          <ProTable<TableListItem, TableListItem>
            onSubmit={async (value) => {
              const success = await handleUpdate({
                ...value,
                permissionId: updateFormValues.permissionId,
              });
              if (success) {
                handleUpdateModalVisible(false);
                setUpdateFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            rowKey="value"
            type="form"
            columns={columns}
            form={{
              initialValues: updateFormValues,
              labelCol: { span: 4 },
            }}
          />
        </UpdateForm>
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
