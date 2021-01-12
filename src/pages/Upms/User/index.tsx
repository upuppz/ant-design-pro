import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Menu,
  message,
  TreeSelect,
  notification,
  Form,
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea, ProFormSelect } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import type { ConnectProps } from 'umi';
import { connect } from 'umi';
import type { ModelState } from '@/pages/Upms/Dept/model';
import type { ModelState as BuildingModelState } from '@/pages/Upms/Building/model';
import type { TableListItem as BuildingTableListItem } from '@/pages/Upms/Building/data';
import type { TableListItem as RoleTableListItem } from '@/pages/Upms/Role/data';
import type { ModelState as RoleModelState } from '@/pages/Upms/Role/model';
import type { TableListItem } from './data';
import { page, updateUser, addUser, removeUser } from './service';
import type { TableListItem as DeptTableListItem } from '../Dept/data';
import type { FormInstance } from 'antd/lib/form';
import { useAccess } from '@@/plugin-access/access';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    const { code, msg } = error.data;
    notification.error({
      message: msg,
      description: `错误代码：${code}`,
    });
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
    await updateUser(fields);
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
    await removeUser(selectedRows);
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

type PageProps = {
  deptTree: DeptTableListItem[];
  buildingTree: BuildingTableListItem[];
  roleList: RoleTableListItem[];
} & ConnectProps;

const TableList: React.FC<PageProps> = ({ deptTree, buildingTree, roleList, dispatch }) => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [buildingVisible, handleBuildingVisible] = useState<boolean>(false);
  const formRef = useRef<FormInstance | undefined>();
  const { hashRoles } = useAccess();
  useEffect(() => {
    dispatch?.({ type: 'upmsRole/fetch' });
    dispatch?.({ type: 'upmsBuilding/fetchTree' });
    setTimeout(() => {
      dispatch?.({
        type: 'upmsDept/fetchTree',
      });
    }, 800);
  }, [dispatch]);

  const userTypeValueEnum = {
    0: { text: '系统用户', status: 'Default' },
    1: { text: '普通用户', status: 'Processing' },
    2: { text: '企业用户', status: 'Success' },
  };
  const sexValueEnum = {
    0: { text: '男', status: 'Default' },
    1: { text: '女', status: 'Processing' },
    2: { text: '保密', status: 'Error' },
  };
  const statusValueEnum = {
    1: { text: '启用', status: 'Success' },
    0: { text: '禁用', status: 'Warning' },
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '用户名为必填项',
          },
        ],
      },
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      valueEnum: userTypeValueEnum,
      hideInSearch: hashRoles(["ROLE_RSTADMIN"]),
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择用户类型用户类型',
          },
        ],
      },
    },
    {
      title: '姓名',
      dataIndex: 'nickname',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '姓名为必填项',
          },
        ],
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueEnum: sexValueEnum,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择性别',
          },
        ],
      },
    },
    {
      title: '部门',
      hideInForm: true,
      search: false,
      dataIndex: 'deptName',
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
    },
    {
      title: '办公电话',
      dataIndex: 'tel',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      valueEnum: statusValueEnum,
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
      title: '创建时间',
      dataIndex: 'createdAtRange',
      hideInForm: true,
      hideInTable: true,
      valueType: 'dateTimeRange',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: true,
      search: false,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: TableListItem) => (
        <a
          onClick={() => {
            const row = record;
            handleBuildingVisible(row.roles.includes(102));
            handleUpdateModalVisible(true);
            row.password = '[PROTECTED]';
            formRef.current?.setFieldsValue(row);
          }}
        >
          编辑
        </a>
      ),
    },
  ];
  return (
    <>
      <PageHeaderWrapper>
        <ProTable<TableListItem>
          headerTitle="查询表格"
          actionRef={actionRef}
          rowKey="userId"
          toolBarRender={(action, { selectedRowKeys }) => [
            <Button
              type="primary"
              key="create"
              onClick={() => {
                handleCreateModalVisible(true);
                handleBuildingVisible(false);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
            selectedRowKeys && selectedRowKeys.length > 0 && (
              <Dropdown
                key="batch"
                overlay={
                  <Menu
                    onClick={async (e) => {
                      if (e.key === 'remove') {
                        await handleRemove(selectedRowKeys);
                        action?.reload();
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
          request={(params, sorter, filter) => page({ ...params, sorter, filter })}
          columns={columns}
          rowSelection={{}}
          form={{
            labelCol: { span: 5 },
          }}
        />
        <ModalForm
          title={updateModalVisible ? '更新' : '新建'}
          visible={updateModalVisible || createModalVisible}
          initialValues={{ enabled: '1' }}
          formRef={formRef}
          modalProps={{
            onCancel: () => {
              handleCreateModalVisible(false);
              handleUpdateModalVisible(false);
            },
          }}
          onFinish={async (values) => {
            const ext: any = {};
            if (buildingVisible) {
              ext.buildingId = values['ext.buildingId'];
              // eslint-disable-next-line no-param-reassign
              values.ext = JSON.stringify(ext);
            }
            let result;
            if (updateModalVisible) {
              result = await handleUpdate(values as TableListItem);
            } else {
              result = await handleAdd(values as TableListItem);
            }
            if (result) {
              handleCreateModalVisible(false);
              handleUpdateModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
            return result;
          }}
          onValuesChange={(changedValues: any) => {
            // 保安角色显示楼栋字段
            if (changedValues.roles) {
              handleBuildingVisible(changedValues.roles.includes(102));
            }
          }}
        >
          <ProFormText
            name="userId"
            hidden
          />
          <ProFormText
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            rules={[{ required: true, message: '用户名为必填项' }]}
          />
          <ProFormSelect
            valueEnum={userTypeValueEnum}
            name="userType"
            label="用户类型"
            disabled={hashRoles(["ROLE_RSTADMIN"])}
            rules={[{ required: true, message: '用户类型为必选项' }]}
          />
          <ProFormText.Password label="密码" name="password" required />
          <ProFormText
            name="nickname"
            label="姓名"
            placeholder="请输入用户名"
            rules={[{ required: true, message: '姓名为必填项' }]}
          />
          <ProFormSelect
            valueEnum={sexValueEnum}
            name="sex"
            label="性别"
            rules={[{ required: true, message: '性别为必选项' }]}
          />
          <ProFormSelect
            fieldProps={{
              mode: 'multiple',
            }}
            name="roles"
            label="角色"
            request={async () => {
              return roleList?.map((item) => {
                return { label: item.roleName, value: item.roleId };
              });
            }}
            rules={[{ required: true, message: '角色为必选项' }]}
          />
          {
            buildingVisible ? (<Form.Item
              dependencies={['roles']}
              label="所属楼栋"
              name="ext.buildingId"
              rules={[{ required: true, message: '所属楼栋为必选项' }]}
            >
              <TreeSelect allowClear placeholder="请选择" treeData={buildingTree} />
            </Form.Item>) : null
          }

          <Form.Item
            label="部门"
            name="deptId"
            rules={[{ required: true, message: '部门为必选项' }]}
          >
            <TreeSelect allowClear placeholder="请选择" treeData={deptTree} />
          </Form.Item>
          <ProFormText name="mobile" label="手机号码" />
          <ProFormText name="tel" label="办公电话" />
          <ProFormText name="idNum" label="身份证号" />
          <ProFormText name="icNum" label="IC卡号" />
          <ProFormSelect
            valueEnum={statusValueEnum}
            name="enabled"
            label="状态"
            rules={[{ required: true, message: '状态为必选项' }]}
          />
          <ProFormTextArea name="description" label="个人描述" placeholder="请输入名称" />
        </ModalForm>
      </PageHeaderWrapper>
    </>
  );
};

export default connect(
  ({
     upmsDept,
     upmsBuilding,
     upmsRole,
   }: {
    upmsDept: ModelState;
    upmsBuilding: BuildingModelState;
    upmsRole: RoleModelState;
  }) => ({
    deptTree: upmsDept.tree,
    buildingTree: upmsBuilding.tree,
    roleList: upmsRole.list,
  }),
)(TableList);
