import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import { Button, message, Menu, Dropdown, Input, Upload, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import { UploadFile } from 'antd/es/upload/interface';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { TableListItem } from './data.d';
import { page, update, create, remove, userFaces } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleCreate = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await create({ ...fields });
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
  const hide = message.loading('正在更新..');
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

const TableList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState<TableListItem | any>({});
  const [faceVisible, handleFaceVisible] = useState<boolean>(true);
  const [faces, setFaces] = useState<Array<UploadFile>>([]);

  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>();

  const actionRef = useRef<ActionType>();

  /**
   * 人脸更改
   * @param info
   */
  const handleFacesChange = (info: { fileList: React.SetStateAction<UploadFile[]> }) =>
    setFaces(info.fileList);

  /**
   *  查看人脸
   */
  const handlePreview = (file: any) => {
    setPreviewImage(file.url);
    setPreviewVisible(true);
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      rules: [
        {
          required: true,
          message: '用户名称为必填项',
        },
      ],
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      valueEnum: {
        1: { text: '普通用户', status: 'Processing' },
        2: { text: '企业管理员', status: 'Success' },
      },
      renderFormItem: (item, { defaultRender, onChange }) => {
        return defaultRender({
          ...item,
          formItemProps: {
            onChange: (val: string) => {
              handleFaceVisible(val !== '1');
              onChange?.(val);
            },
          },
        });
      },
      rules: [
        {
          required: true,
          message: '请选择用户类型用户类型',
        },
      ],
    },
    {
      title: '姓名',
      dataIndex: 'nickname',
      rules: [
        {
          required: true,
          message: '姓名为必填项',
        },
      ],
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueEnum: {
        0: { text: '男', status: 'Default' },
        1: { text: '女', status: 'Processing' },
        2: { text: '保密', status: 'Error' },
      },
      rules: [
        {
          required: true,
          message: '请选择性别',
        },
      ],
    },
    {
      title: '密码',
      dataIndex: 'password',
      hideInTable: true,
      hideInSearch: true,
      rules: [
        {
          required: true,
          message: '密码为必填项',
        },
      ],
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return <Input.Password {...rest} placeholder="请输入" />;
      },
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      valueEnum: {
        1: { text: '启用', status: 'Success' },
        0: { text: '禁用', status: 'Warning' },
      },
      rules: [
        {
          required: true,
          message: '请选择状态',
        },
      ],
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '身份证号',
      dataIndex: 'idNum',
      hideInTable: true,
    },
    {
      title: 'IC卡号',
      dataIndex: 'icNum',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '最近登陆时间',
      dataIndex: 'lastLoginTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '个人描述',
      dataIndex: 'description',
      hideInSearch: true,
      hideInTable: true,
      valueType: 'textarea',
    },
    {
      title: '人脸',
      dataIndex: 'faces',
      hideInSearch: true,
      hideInTable: true,
      hideInForm: faceVisible,
      renderFormItem: () => {
        const uploadButton = (
          <div>
            <PlusOutlined />
            <div className="ant-upload-text">上传</div>
          </div>
        );

        return (
          <Upload
            listType="picture-card"
            onPreview={handlePreview}
            fileList={faces}
            onChange={handleFacesChange}
          >
            {faces.length > 3 ? null : uploadButton}
          </Upload>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              const row = record;
              // 请求人脸数据
              userFaces(row.userId).then((res) => {
                setFaces(res.data);
              });
              handleUpdateModalVisible(true);
              row.password = '[PROTECTED]';
              setUpdateFormValues(record);
              handleFaceVisible(row.userType !== '1');
            }}
          >
            编辑
          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="userId"
        // tableAlertRender={false}
        form={{
          labelCol: { span: 6 },
        }}
        toolBarRender={(action, { selectedRowKeys }) => [
          <Button
            type="primary"
            onClick={() => {
              handleModalVisible(true);
              handleFaceVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
          selectedRowKeys && selectedRowKeys.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  // @ts-ignore
                  onClick={async (e: { key: string }) => {
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
      />
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            const success = await handleCreate({ ...value, faces });
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
          rowSelection={{}}
          form={{
            initialValues: { enabled: '1', userType: '1' },
            labelCol: { span: 6 },
          }}
        />
      </CreateForm>
      {updateFormValues && Object.keys(updateFormValues).length ? (
        <UpdateForm
          onCancel={() => {
            handleUpdateModalVisible(false);
            setFaces([]);
            setUpdateFormValues({});
          }}
          modalVisible={updateModalVisible}
        >
          <ProTable<TableListItem, TableListItem>
            onSubmit={async (value) => {
              const success = await handleUpdate({
                ...value,
                faces,
                userId: updateFormValues.userId,
              });
              if (success) {
                handleUpdateModalVisible(false);
                setFaces([]);
                setUpdateFormValues({});
                if (actionRef.current) {
                  actionRef.current.reloadAndRest();
                }
              }
            }}
            rowKey="userId"
            type="form"
            columns={columns}
            form={{
              initialValues: updateFormValues,
              labelCol: { span: 6 },
            }}
          />
        </UpdateForm>
      ) : null}
      <Modal visible={previewVisible} onCancel={() => setPreviewVisible(false)}>
        <img alt="face" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </PageContainer>
  );
};

export default TableList;
