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
} from 'antd';
import React, { FC } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { LikeItem } from '@/pages/finance/wallet/data';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { like } from '@/pages/finance/wallet/service';
import { DiningRule } from '../rule/data';
import { list as ruleList } from '../rule/service';
import styles from './style.less';
import { manual } from './service';

const FormItem = Form.Item;
const { Option } = Select;

const dateFormat = 'YYYY-MM-DD';

const Toll: FC = () => {
  const [form] = Form.useForm();
  const [hidePackaging, setHidePackaging] = React.useState(true);
  const [ruleOption, setRuleOption] = React.useState<DiningRule[]>([]);
  const [users, setUsers] = React.useState<LikeItem[]>([]);
  const [userLoading, setUserLoading] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);

  React.useEffect(() => {
    ruleList().then((res) => {
      setRuleOption(res.data);
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
      .then((res) => {
        if (res.code === '00000') {
          notification.success({ message: '扣费成功' });
          form.resetFields(['ids']);
        } else {
          notification.error({ message: res.msg, description: res.data });
        }
        setSubmitLoading(false);
      })
      .catch(() => {
        setSubmitLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.error('Failed:', errorInfo);
  };

  const onValuesChange = (changedValues: { [key: string]: any }) => {
    const { ruleId } = changedValues;
    setHidePackaging(ruleId === 0);
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
          initialValues={{ date: moment(), ruleId: 0, packaging: 1 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={onValuesChange}
        >
          <FormItem
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
                  <Option key={item.userId} value={item.userId} label={item.userId}>
                    {item.userId} / {item.nickname} / {item.mobile} / {item.deptName}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem
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
          </FormItem>
          <FormItem
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
            <Radio.Group>
              <Radio value={0}>只收包装费</Radio>
              {ruleOption && ruleOption.length > 0
                ? ruleOption.map((field) => {
                    return (
                      <Radio key={field.id} value={field.id}>
                        {field.name}
                      </Radio>
                    );
                  })
                : null}
            </Radio.Group>
          </FormItem>
          <FormItem {...formItemLayout} label="包装费" name="packaging">
            <Radio.Group>
              <Radio value={1}>包装费</Radio>
              {!hidePackaging ? <Radio value={0}>无包装费</Radio> : null}
            </Radio.Group>
          </FormItem>

          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              提交
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};

export default Toll;
