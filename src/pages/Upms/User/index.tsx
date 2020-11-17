import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message, Input, Select, TreeSelect } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { connect, ConnectProps } from 'umi';
import { ModelState } from '@/pages/Upms/Dept/model';
import { ModelState as BuildingModelState } from '@/pages/Upms/Building/model';
import { TableListItem as BuildingTableListItem } from '@/pages/Upms/Building/data';
import { TableListItem as RoleTableListItem } from '@/pages/Upms/Role/data';
import { ModelState as RoleModelState } from '@/pages/Upms/Role/model';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { TableListItem } from './data';
import { page, updateUser, addUser, removeUser } from './service';
import { TableListItem as DeptTableListItem } from '../Dept/data';

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

interface PageProps extends ConnectProps {
  deptTree: DeptTableListItem[];
  buildingTree: BuildingTableListItem[];
  roleList: RoleTableListItem[];
}

const TableList: React.FC<PageProps> = ({ deptTree, buildingTree,roleList, dispatch }) => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [buildingVisible, handleBuildingVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState<TableListItem | any>({});

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
      valueEnum: {
        0: { text: '系统用户', status: 'Default' },
        1: { text: '普通用户', status: 'Processing' },
        2: { text: '企业用户', status: 'Success' },
      },
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
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return <Input.Password {...rest} placeholder="请输入" />;
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
      valueEnum: {
        0: { text: '男', status: 'Default' },
        1: { text: '女', status: 'Processing' },
        2: { text: '保密', status: 'Error' },
      },
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
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <Select
            mode="multiple"
            {...rest}
            onChange={(value) => {
              // @ts-ignore
              rest.onChange(value);
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
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        if (deptTree.length > 0) {
          return <TreeSelect {...rest} placeholder="请选择" treeData={deptTree} />;
        }
        return null;
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
      valueEnum: {
        1: { text: '启用', status: 'Success' },
        0: { text: '禁用', status: 'Warning' },
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
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        if (rest.value === undefined) {
          setTimeout(() => {
            // @ts-ignore
            form.setFields([{ name: rest.id, value: form.getFieldValue('ext')?.buildingId }]);
          }, 100);
        }
        return <TreeSelect {...rest} placeholder="请选择" treeData={buildingTree} />;
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
      render: (_, record: TableListItem) => (
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
            setUpdateFormValues(row);
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
                handleModalVisible(true);
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
          request={(params, sorter, filter) => page({ ...params, sorter, filter })}
          columns={columns}
          rowSelection={{}}
          form={{
            labelCol: { span: 5 },
          }}
        />
        <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
          <ProTable<TableListItem, TableListItem>
            onSubmit={async (value) => {
              // value.faces = faces;
              const ext: any = {};
              if (buildingVisible) {
                ext.buildingId = value['ext.buildingId'];
                value.ext = JSON.stringify(ext);
              }
              const success = await handleAdd(value);
              if (success) {
                handleModalVisible(false);
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
        </CreateForm>
        {updateFormValues && Object.keys(updateFormValues).length ? (
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
                const fields = { ...value, /* faces, */ userId: updateFormValues.userId };
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
        ) : null}
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
    upmsDept: ModelState,
    upmsBuilding: BuildingModelState,
    upmsRole: RoleModelState
  }) => ({
    deptTree: upmsDept.tree,
    buildingTree: upmsBuilding.tree,
    roleList: upmsRole.list,
  }))(TableList);
