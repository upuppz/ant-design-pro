import { InfoCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Radio,
  Tooltip,
  Space,
  Select,
  notification,
  Spin,
  Empty,
  Checkbox,
} from 'antd';
import React, { FC } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { LikeItem } from '@/pages/Finance/Wallet/data';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { like } from '@/pages/Finance/Wallet/service';
import { TableListItem } from '@/pages/Rst/ExtraCost/data';
import { DiningRule } from '../rule/data';
import { list as ruleList } from '../rule/service';
import styles from './style.less';
import { manual } from './service';
import { all } from '../ExtraCost/service';

const dateFormat = 'YYYY-MM-DD';

const Toll: FC = () => {
  const [form] = Form.useForm();
  const [ruleOption, setRuleOption] = React.useState<DiningRule[]>([]);
  const [users, setUsers] = React.useState<LikeItem[]>([]);
  const [extraCosts, setExtraCosts] = React.useState<TableListItem[]>([]);
  const [userLoading, setUserLoading] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);

  React.useEffect(() => {
    ruleList().then((res) => {
      setRuleOption(res.data);
    });
    all().then((res) => {
      setExtraCosts(res.data);
    });
  }, []);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };

  const submitFormLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
    },
  };

  const onFinish = (values: { [key: string]: any }) => {
    setSubmitLoading(true);
    manual({ ...values, date: values.date.format(dateFormat) })
      .then(() => {
        notification.success({ message: '扣费成功' });
        form.resetFields(['ids']);
        setSubmitLoading(false);
      })
      .catch((err) => {
        notification.error({ message: err.data.data, description: err.data.msg });
        setSubmitLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.error('Failed:', errorInfo);
  };

  const onSearch = debounce((value: string) => {
    setUserLoading(true);
    like(value)
      .then((res) => {
        setUsers(res.data);
        setUserLoading(false);
      })
      .catch(() => {
        setUserLoading(false);
      });
  }, 500);

  return (
    <PageHeaderWrapper content="在特殊场景下，硬件设备未能识别用户自动扣费，可通过此页面进行人为捐款。">
      <Card bordered={false}>
        <Form
          hideRequiredMark
          style={{ marginTop: 8 }}
          form={form}
          name="toll"
          initialValues={{ date: moment(), ruleId: 0 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            {...formItemLayout}
            label={
              <Space>
                <span>用户</span>
                <Tooltip
                  className={styles.optional}
                  title="可通过 姓名／工号/手机号 进行模糊匹配，以便于精准确认扣费的用户. 查找到的数据格式为 姓名／工号/手机号/部门"
                >
                  <InfoCircleOutlined style={{ marginRight: 4 }} />
                </Tooltip>
              </Space>
            }
            name="ids"
            rules={[
              {
                required: true,
                message: '请选择要扣费的用户',
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="请通过 姓名／工号/手机号 进行选择"
              filterOption={false}
              optionLabelProp="label"
              notFoundContent={
                userLoading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
              onSearch={onSearch}
              loading={userLoading}
            >
              {users.map((item) => {
                return (
                  <Select.Option key={item.userId} value={item.userId} label={item.userId}>
                    {item.userId} / {item.nickname} / {item.mobile} / {item.deptName}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="消费日期"
            name="date"
            rules={[
              {
                required: true,
                message: '请选择消费日期',
              },
            ]}
          >
            <DatePicker
              /* format={dateFormat} */
              style={{ width: '100%' }}
              placeholder="请选择消费日期"
            />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label={
              <Space>
                <span>消费规则</span>
                <Tooltip
                  className={styles.optional}
                  title="会员在相同时间段内重复消费只扣费一次; 例如:人脸消费后在人工扣费，后者系统会自动忽略"
                >
                  <InfoCircleOutlined style={{ marginRight: 4 }} />
                </Tooltip>
              </Space>
            }
            name="ruleId"
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value={0}>单独收取包装费</Radio.Button>
              {ruleOption && ruleOption.length > 0
                ? ruleOption.map((field) => {
                    return (
                      <Radio.Button key={field.id} value={field.id}>
                        {field.name}
                      </Radio.Button>
                    );
                  })
                : null}
            </Radio.Group>
          </Form.Item>
          <Form.Item {...formItemLayout} name="extraCost" label="包装费">
            <Checkbox.Group>
              {extraCosts.map((value) => (
                <Checkbox key={value.id} value={value.id}>
                  {value.name}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
          <Form.Item {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};

export default Toll;
