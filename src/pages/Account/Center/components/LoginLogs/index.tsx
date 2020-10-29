import { Button, Tag, Timeline } from 'antd';
import React from 'react';
import {
  DesktopOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  ApiOutlined,
  EnvironmentOutlined,
  ChromeOutlined,
  LoadingOutlined,
  StopOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { connect } from '@@/plugin-dva/exports';
import { Dispatch } from '@@/plugin-dva/connect';
import { ModalState } from '../../model';

interface PageProps extends ModalState {
  dispatch?: Dispatch;
  loading?: boolean;
  finished?: boolean;
}

const Articles: React.FC<Partial<PageProps>> = ({ logs, dispatch, loading, finished }) => {
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
    dispatch?.({
      type: 'accountCenter/listLoginLog',
    });
  };

  const pendingHandler = () => {
    if (finished && loading) {
      return <Tag color="blue"> 加载中...</Tag>;
    }
    if (!finished && !loading) {
      return <Tag color="blue">已加载完所有...</Tag>;
    }
    return true;
  };

  return (
    <>
      <Timeline
        mode="left"
        pending={pendingHandler()}
        pendingDot={
          // eslint-disable-next-line no-nested-ternary
          finished ? (
            loading ? (
              <LoadingOutlined style={{ fontSize: '16px' }} />
            ) : (
              <TagOutlined style={{ fontSize: '16px' }} />
            )
          ) : (
            <StopOutlined style={{ fontSize: '16px' }} />
          )
        }
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
        {finished ? (
          <Button onClick={onLoadMore} loading={loading}>
            加载更多
          </Button>
        ) : null}
      </div>
    </>
  );
};

export default connect(
  ({
    accountCenter,
    loading,
  }: {
    accountCenter: ModalState;
    loading: { effects: { [key: string]: boolean } };
    infoLoading: { effects: { [key: string]: boolean } };
  }) => ({
    logs: accountCenter.logs,
    finished: accountCenter.logsCurrent <= accountCenter.logsPages,
    loading: loading.effects['accountCenter/listLoginLog'],
  }),
)(Articles);
