import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Menu,
  message,
  Input,
  Select,
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

const { Option } = Select;

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
  const formRef = useRef<FormInstance|undefined>();

  // const [faceVisible, handleFaceVisible] = useState<boolean>(true);
  // const [faces, setFaces] = useState<Array<UploadFile>>([]);
  // const [previewImage, setPreviewImage] = useState<string>();
  // const [previewVisible, setPreviewVisible] = useState<boolean>(false);

  useEffect(() => {
    dispatch?.({ type: 'upmsRole/fetch' });
    dispatch?.({ type: 'upmsBuilding/fetchTree' });
    setTimeout(() => {
      dispatch?.({
        type: 'upmsDept/fetchTree',
      });
    }, 800);
  }, []);

  // const handlePreview = (file: any) => {
  //   setPreviewImage(file.url);
  //   setPreviewVisible(true);
  // };

  // TODO:2020年07月29日09:15:05 上传人脸，对人脸照片质量进行检测
  // const handleChange = (info: { fileList: React.SetStateAction<UploadFile[]> }) =>
  //   setFaces(info.fileList);

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
      title: '密码',
      dataIndex: 'password',
      hideInTable: true,
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '密码为必填项',
          },
        ],
      },
      renderFormItem: (_: any, config) => {
        console.log(config);
        return <Input.Password placeholder="请输入" />;
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
      title: '角色',
      dataIndex: 'roles',
      hideInTable: true,
      search: false,
      renderFormItem: (_: any, { fieldProps }: any) => {
        return (
          <Select
            mode="multiple"
            {...fieldProps}
            onChange={(value: any[]) => {
              // 保安角色显示楼栋字段
              handleBuildingVisible(value.includes(102));
            }}
            placeholder="请选择"
          >
            {roleList?.map((item) => {
              return (
                <Option key={item.roleId} value={item.roleId}>
                  {item.roleName}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: '部门',
      dataIndex: 'deptId',
      search: false,
      hideInTable: true,
      renderFormItem: (_: any, { fieldProps }: any) => {
        return <TreeSelect allowClear {...fieldProps} placeholder="请选择" treeData={deptTree} />;
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '部门为必选项',
          },
        ],
      },
    },
    {
      title: '部门',
      dataIndex: 'deptId',
      hideInTable: true,
      hideInForm: true,
      renderFormItem: (_: any, { fieldProps }: any) => {
        return <TreeSelect allowClear {...fieldProps} placeholder="请选择" treeData={deptTree} />;
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
      title: '身份证号',
      dataIndex: 'idNum',
      hideInTable: true,
      search: false,
    },
    {
      title: 'IC卡号',
      dataIndex: 'icNum',
      search: false,
      hideInTable: true,
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
      title: '所属楼栋',
      dataIndex: 'ext.buildingId',
      hideInForm: !buildingVisible,
      search: false,
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: buildingVisible,
            message: '所属楼栋必填项',
          },
        ],
      },
      renderFormItem: (
        _: any,
        { type, defaultRender, fieldProps, ...rest }: any,
        form: {
          setFields: (arg0: { name: any; value: any }[]) => void;
          getFieldValue: (arg0: string) => { (): any; new (): any; buildingId: any };
        },
      ) => {
        if (rest.value === undefined) {
          setTimeout(() => {
            // @ts-ignore
            form.setFields([{ name: rest.id, value: form.getFieldValue('ext')?.buildingId }]);
          }, 100);
        }
        return <TreeSelect {...fieldProps} placeholder="请选择" treeData={buildingTree} />;
      },
    },
    {
      title: '个人描述',
      dataIndex: 'description',
      search: false,
      hideInTable: true,
      valueType: 'textarea',
    },
    // {
    //   title: '人脸',
    //   dataIndex: 'faces',
    //   search: false,
    //   hideInTable: true,
    //   hideInForm: faceVisible,
    //   renderFormItem: (_) => {
    //     const uploadButton = (
    //       <div>
    //         <PlusOutlined />
    //         <div className="ant-upload-text">Upload</div>
    //       </div>
    //     );
    //
    //     return (
    //       <Upload
    //         listType="picture-card"
    //         onPreview={handlePreview}
    //         fileList={faces}
    //         onChange={handleChange}
    //       >
    //         {faces.length > 3 ? null : uploadButton}
    //       </Upload>
    //     );
    //   },
    // },
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
            // 请求人脸数据
            // listFaces(row.userId).then((res) => {
            //   setFaces(res.data);
            // });
            handleBuildingVisible(row.roles.includes(102));
            handleUpdateModalVisible(true);
            row.password = '[PROTECTED]';
            formRef.current?.setFieldsValue(row)
            // handleFaceVisible(row.userType != '1');
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
                // handleFaceVisible(true);
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
          initialValues={{ enabled: '1'}}
          formRef={formRef}
          modalProps={{
            onCancel: () => {
              handleCreateModalVisible(false);
              handleUpdateModalVisible(false);
            }
          }}
          onFinish={async (values) => {
            // value.faces = faces;
            const ext: any = {};
            if (buildingVisible) {
              ext.buildingId = values['ext.buildingId'];
              // eslint-disable-next-line no-param-reassign
              values.ext = JSON.stringify(ext);
            }
            let result;
            if(updateModalVisible){
              result = await handleUpdate(values as TableListItem);
            }else{
              result = await handleAdd(values as TableListItem);
            }
            if (result) {
              handleCreateModalVisible(false);
              // setFaces([]);
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
            </Form.Item>) :null
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

        {/*  <CreateForm onCancel={() => handleCreateModalVisible(false)} modalVisible={createModalVisible}>
          <ProTable<TableListItem, TableListItem>
            onSubmit={async (value) => {
              // value.faces = faces;
              const ext: any = {};
              if (buildingVisible) {
                ext.buildingId = value['ext.buildingId'];
                // eslint-disable-next-line no-param-reassign
                value.ext = JSON.stringify(ext);
              }
              const success = await handleAdd(value);
              if (success) {
                handleCreateModalVisible(false);
                // setFaces([]);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            rowKey="userId"
            type="form"
            columns={columns}
            form={{
              initialValues: { enabled: '1' },
              labelCol: { span: 4 },
            }}
          />
         </CreateForm> */}
        {/* {updateFormValues && Object.keys(updateFormValues).length ? (
          <UpdateForm
            onCancel={() => {
              handleUpdateModalVisible(false);
              // setFaces([]);
              setUpdateFormValues({});
            }}
            modalVisible={updateModalVisible}
          >
            <ProTable<TableListItem, TableListItem>
              onSubmit={async (value) => {
                const fields = { ...value, userId: updateFormValues.userId };
                const ext: any = {};
                if (buildingVisible) {
                  ext.buildingId = value['ext.buildingId'];
                  fields.ext = JSON.stringify(ext);
                }
                const success = await handleUpdate(fields);
                if (success) {
                  handleUpdateModalVisible(false);
                  // setFaces([]);
                  setUpdateFormValues({});
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              }}
              rowKey="userId"
              type="form"
              columns={columns}
              form={{
                initialValues: updateFormValues,
                labelCol: { span: 4 },
              }}
            />
          </UpdateForm>
        ) : null} */}
      </PageHeaderWrapper>
      {/* <Modal visible={previewVisible} onCancel={() => setPreviewVisible(false)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal> */}
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
