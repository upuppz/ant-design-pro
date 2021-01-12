import { PlusOutlined } from '@ant-design/icons';
import { Button, message, TreeSelect } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { TableListItem } from './data';
import { tree, update, add, remove } from './service';

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
 * @param id
 */
const handleRemove = async (id: string | number) => {
  const hide = message.loading('正在删除');
  try {
    await remove(id);
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
  const actionRef = useRef<ActionType>();
  const [buildingTree, setBuildingTree] = useState<any>([]);

  const fetchData = async () => {
    const msg = await tree();
    setBuildingTree(msg.data);
    return msg;
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '楼栋名称',
      dataIndex: 'buildingName',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '楼栋名称为必填项',
          },
        ],
      },
    },
    {
      title: '楼栋名称',
      dataIndex: 'title',
      hideInForm: true,
    },
    {
      title: '上级',
      dataIndex: 'parentId',
      hideInTable: true,
      renderFormItem: () => {
        return <TreeSelect allowClear placeholder="请选择" treeData={buildingTree} />;
      },
    },
    {
      title: '排序',
      search: false,
      dataIndex: 'orderNum',
      valueType: 'digit',
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
      render: (_, record: TableListItem) => [
        <a
          key="edit"
          onClick={() => {
            handleUpdateModalVisible(true);
            setUpdateFormValues({
              // @ts-ignore
              id: record.value,
              // @ts-ignore
              buildingName: record.title,
              // @ts-ignore
              parentId: record.pId === 0 ? null : record.pId,
              level: record.level,
              orderNum: record.orderNum,
            });
          }}
        >
          编辑
        </a>,
        <a
          key="del"
          onClick={async () => {
            // @ts-ignore
            const success = await handleRemove(record.value);
            if (success && actionRef.current) {
              actionRef.current.reload();
            }
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="value"
        search={false}
        toolBarRender={() => [
          <Button key="create" type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
          /*     selectedRowKeys && selectedRowKeys.length > 0 && (
                 <Dropdown
                   overlay={
                     <Menu
                       onClick={async (e) => {
                         if (e.key === "remove') {
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
                     批量操作 <DownOutlined/>
                   </Button>
                 </Dropdown>
               ), */
        ]}
        request={fetchData}
        columns={columns}
        form={{
          labelCol: { span: 5 },
        }}
      />
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            const success = await handleAdd({ ...value });
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
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
              const success = await handleUpdate({ ...value, id: updateFormValues.id });
              if (success) {
                handleUpdateModalVisible(false);
                setUpdateFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
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
