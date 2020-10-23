import { Button, Tag, Timeline } from 'antd';
import React from 'react';

import { Dispatch } from 'umi';
import {
  DesktopOutlined,
  CloseCircleOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  ApiOutlined,
  EnvironmentOutlined,
  ChromeOutlined,
} from '@ant-design/icons';
import { ModalState } from '../../model';

const Articles: React.FC<ModalState & { dispatch: Dispatch; loading: boolean }> = ({
  logs,
  dispatch,
  loading,
  logsCurrent,
  logsPages,
}) => {
  const statusColorHandler = (status: number): string => {
    if (status === 0) {
      return 'green';
    }
    if (status === 1) {
      return 'red';
    }
    return 'gray';
  };

  const statusTextHandler = (status: number): string => {
    if (status === 0) {
      return '登陆成功';
    }
    if (status === 1) {
      return '用户名或密码错误';
    }
    return '其它错误';
  };

  const onLoadMore = () => {
    dispatch({
      type: 'userCenter/listLoginLog',
    });
  };

  return (
    <>
      <Timeline
        mode="left"
        pending={
          logsCurrent < logsPages ? true : (
            <Tag color="blue">{loading ? '加载中...' : '已加载完所有...'}</Tag>
          )
        }
        pendingDot={loading ? null : <CloseCircleOutlined style={{ fontSize: '16px' }} />}
      >
        {logs?.map((value) => {
          return (
            <Timeline.Item
              key={value.id}
              dot={
                value.status === 0 ? (
                  <CheckCircleTwoTone
                    style={{
                      fontSize: '16px',
                    }}
                    twoToneColor="#52c41a"
                  />
                ) : (
                  <CloseCircleTwoTone
                    style={{
                      fontSize: '16px',
                    }}
                    twoToneColor="red"
                  />
                )
              }
              color={statusColorHandler(value.status)}
              label={value.createdAt}
            >
              <p>
                <Tag color={value.status === 0 ? 'green' : 'red'}>
                  {statusTextHandler(value.status)}
                </Tag>
              </p>
              <p>
                <ApiOutlined
                  style={{
                    marginRight: 8,
                  }}
                />
                IP: {value.ip}
              </p>
              <p>
                <EnvironmentOutlined
                  style={{
                    marginRight: 8,
                  }}
                />
                登录地点: {value.location}
              </p>
              <p>
                <ChromeOutlined
                  style={{
                    marginRight: 8,
                  }}
                />
                浏览器: {value.browser}
              </p>
              <p>
                <DesktopOutlined
                  style={{
                    marginRight: 8,
                  }}
                />
                登录系统: {value.system}
              </p>
            </Timeline.Item>
          );
        })}
      </Timeline>
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        {logsCurrent < logsPages ? (
          <Button onClick={onLoadMore} loading={loading}>
            加载更多
          </Button>
        ) : null}
      </div>
    </>
  );
};

export default Articles;
