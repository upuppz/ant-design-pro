import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, InputNumber, Menu, message, TreeSelect } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { connect,ConnectProps} from 'umi';
import { ModelState as BuildingModelState } from '@/pages/Upms/Building/model';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { TableListItem } from './data';
import { tree, update, add, remove } from './service';
import { TableListItem as BuildingTableListItem } from '../Building/data';


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
  buildingTree: BuildingTableListItem[];
}

const TableList: React.FC<PageProps> = ({buildingTree,dispatch}) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState<TableListItem | any>({});
  const [deptTree, setDeptTree] = useState([]);
  // const [buildingTree, setBuildingTree] = useState([]);
  const actionRef = useRef<ActionType>();

  const fetchData = async () => {
    const msg = await tree();
    setDeptTree(msg.data);
    return msg;
  };

  useEffect(() => {
    dispatch?.({type:"upmsBuilding/fetchTree"});
  }, []);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '组织代码',
      dataIndex: 'value',
      hideInForm: true,
    },
    {
      title: '组织代码',
      dataIndex: 'deptId',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <InputNumber
            {...rest}
            style={{ width: '100%' }}
            min={1}
            placeholder="为空由系统自动生成"
            disabled={updateModalVisible}
          />
        );
      },
    },
    {
      title: '部门名称',
      dataIndex: 'deptName',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择部门',
          },
        ],
      },
    },
    {
      title: '组织名称',
      dataIndex: 'title',
      hideInForm: true,
    },
    {
      title: '上级组织',
      dataIndex: 'parentId',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return <TreeSelect {...rest} placeholder="请选择" treeData={deptTree} allowClear />;
      },
    },
    {
      title: '所属楼栋',
      dataIndex: 'buildings',
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        return (
          <TreeSelect
            {...rest}
            allowClear
            multiple
            treeCheckStrictly
            treeCheckable
            placeholder="请选择"
            treeData={buildingTree}
          />
        );
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
                deptId: record.value,
                deptName: record.title,
                parentId: record.pId === 0 ? null : record.pId,
                ...record,
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
          <Button key="create" type="primary" onClick={() => handleModalVisible(true)}>
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
              const success = await handleUpdate({ ...value, deptId: updateFormValues.deptId });
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

export default connect(({
                          upmsBuilding,
                        }: {
  upmsBuilding: BuildingModelState
}) => ({ buildingTree: upmsBuilding.tree }))(TableList);
