import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message, TreeSelect } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { connect } from 'umi';
import { ModelState as PermissionModelState } from '@/pages/Upms/Permission/model';
import { ConnectProps } from '@@/plugin-dva/connect';
import { TableListItem as PermissionTableListItem } from '@/pages/Upms/Permission/data';
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

interface PageProps extends ConnectProps {
  permissions: PermissionTableListItem[];
}

const TableList: React.FC<PageProps> = ({ permissions, dispatch }) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState<TableListItem | any>({});
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    dispatch?.({ type: 'upmsPermission/fetch' });
  }, []);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '#',
      dataIndex: 'roleId',
      hideInForm: true,
      search: false,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '角色名称为必填项',
          },
        ],
      },
    },
    {
      title: '角色标识',
      dataIndex: 'roleKey',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '角色标识为必填项',
          },
        ],
      },
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      valueEnum: {
        0: { text: '启用', status: 'Success' },
        1: { text: '禁用', status: 'Warning' },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择状态',
          },
        ],
      },
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      hideInTable: true,
      search: false,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <TreeSelect treeCheckable {...rest} placeholder="请选择" treeData={permissions} />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      search: false,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: TableListItem) => (
        <>
          <a
            onClick={() => {
              const row = record;
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
        rowKey="roleId"
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
        request={(params, sorter, filter) => list({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{}}
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
          rowKey="roleId"
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
              const success = await handleUpdate({ ...value, roleId: updateFormValues.roleId });
              if (success) {
                handleUpdateModalVisible(false);
                setUpdateFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            rowKey="roleId"
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

export default connect(({
                          upmsPermission,
                        }: {
  upmsPermission: PermissionModelState
}) => ({
  permissions: upmsPermission.list,
}))(TableList);
