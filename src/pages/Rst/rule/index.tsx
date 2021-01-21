import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Skeleton,
  Slider,
  Space,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons/lib';
import { list, save } from './service';
import { DiningRule } from './data';

export default () => {
  const [sliderRule, setSliderRule] = useState<(number | [number, number])[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [useForm] = Form.useForm();
  const [loadingList, setLoadingList] = useState<boolean>(true);

  useEffect(() => {
    list().then((res) => {
      const { data } = res;
      const rule = data.map((item: DiningRule) => {
        return { ...item, rule: [item.rule1, item.rule2] };
      });
      useForm.setFieldsValue({
        rule,
      });

      setSliderRule(
        rule.map((item: any) => {
          return item.rule;
        }),
      );
      setLoadingList(true);
    });
  }, [useForm]);

  // 把一天24小时间按10分钟切段
  const period = (60 * 23) / 10;

  const marks = {};

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 24; i++) {
    const calc = i * 6;
    marks[calc] = `${i}点`;
  }

  function onFinish(values: any) {
    setLoading(true);
    const format = values.rule?.map((value: any) => {
      return { ...value, rule1: value.rule[0], rule2: value.rule[1] };
    });
    save(format)
      .then(() => {
        setLoading(false);
        message.success('规则更新成功!');
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function formatTooltip(val: number) {
    // eslint-disable-next-line radix
    const hour = parseInt(String(val / 6));
    const minute = (val % 6) * 10;
    return `${hour}点${minute}分`;
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <Form
          onFinish={onFinish}
          form={useForm}
          size="large"
          labelCol={{
            xs: { span: 24 },
            sm: { span: 4 },
            lg: { span: 3 },
            xl: { span: 2 },
          }}
        >
          <Form.List name="rule">
            {(fields, { add, remove }) => {
              if (fields.length <= 0 && loadingList) {
                return <Skeleton />;
              }
              return (
                <>
                  {fields.map((field) => {
                    return (
                      <div key={field.key}>
                        <Form.Item
                          label="规则名称"
                          name={[field.name, 'name']}
                          fieldKey={[field.fieldKey, 'name']}
                          rules={[{ required: true, message: '规则名称不能为空' }]}
                          required
                          wrapperCol={{
                            xs: { span: 24 },
                            sm: { span: 6 },
                          }}
                        >
                          <Input placeholder="请输入规则名称" />
                        </Form.Item>
                        <Form.Item
                          label="收费"
                          name={[field.name, 'fee']}
                          fieldKey={[field.fieldKey, 'fee']}
                          wrapperCol={{
                            xs: { span: 24 },
                            sm: { span: 3 },
                          }}
                        >
                          <InputNumber style={{ width: '100%' }} min={0} precision={2} />
                        </Form.Item>
                        <Form.Item
                          label="时间段"
                          name={[field.name, 'rule']}
                          fieldKey={[field.fieldKey, 'rule']}
                          validateTrigger="submit"
                          rules={[
                            ({ getFieldValue }) => ({
                              validator() {
                                let sum = 0;
                                getFieldValue('rule').forEach((value: any) => {
                                  if (value) {
                                    sum += value.rule[1] - value.rule[0];
                                  }
                                });
                                if (sum < period) {
                                  // eslint-disable-next-line prefer-promise-reject-errors
                                  return Promise.reject('有时间段没有指定收费规则');
                                }
                                if (sum > period) {
                                  // eslint-disable-next-line prefer-promise-reject-errors
                                  return Promise.reject('复重的时间段指定了收费规则');
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                          required
                        >
                          <Slider
                            onChange={(value: number | [number, number]) => {
                              const temp = sliderRule;
                              temp[field.key] = value;
                              setSliderRule({ ...temp });
                            }}
                            range
                            max={period}
                            value={0}
                            // marks={marks}
                            // @ts-ignore
                            tipFormatter={formatTooltip}
                          />
                        </Form.Item>
                        <Form.Item
                          wrapperCol={{
                            xs: { span: 24 },
                            sm: { offset: 4 },
                            lg: { offset: 3 },
                            xl: { offset: 2 },
                          }}
                        >
                          <Button
                            type="primary"
                            danger
                            onClick={() => {
                              remove(field.name);
                            }}
                          >
                            删除规则
                          </Button>
                        </Form.Item>
                        <Divider>
                          {formatTooltip(sliderRule[field.key]?.[0])} -{' '}
                          {formatTooltip(sliderRule[field.key]?.[1])}
                        </Divider>
                      </div>
                    );
                  })}

                  <Form.Item style={{ textAlign: 'right' }}>
                    <Space>
                      <Button
                        type="dashed"
                        onClick={() => {
                          add({ fee: 0, rule: [0, 0] });
                          sliderRule.push([0, 0]);
                          setSliderRule({ ...sliderRule });
                        }}
                        block
                      >
                        <PlusOutlined /> 添加规则
                      </Button>
                      <Button type="primary" htmlType="submit" loading={loading}>
                        保存规则
                      </Button>
                    </Space>
                  </Form.Item>
                </>
              );
            }}
          </Form.List>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};
