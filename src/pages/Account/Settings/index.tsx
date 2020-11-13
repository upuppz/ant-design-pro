import React, { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import { history } from 'umi';
import BaseView from './components/base';
import BindingView from './components/binding';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import styles from './style.less';

const { Item } = Menu;

type SettingsStateKeys = 'base' | 'security' | 'binding' | 'notification';

interface SettingsState {
  menuMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: SettingsStateKeys;
}

class Settings extends Component<any, SettingsState> {
  main: HTMLDivElement | undefined = undefined;

  constructor(props: any) {
    super(props);
    const menuMap = {
      base: '基本设置',
      security: '安全设置',
      binding: '账号绑定',
      notification: '新消息通知',
    };

    this.state = {
      menuMap,
      selectKey: history?.location?.state?.selectKey ||'base',
    };
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = (key: SettingsStateKeys) => {
    this.setState({
      selectKey: key,
    });
  };

  renderChildren = () => {
    const { selectKey } = this.state;

    switch (selectKey) {
      case 'base':
        return <BaseView />;

      case 'security':
        return <SecurityView />;

      case 'binding':
        return <BindingView />;

      case 'notification':
        return <NotificationView />;

      default:
        break;
    }

    return null;
  };

  render() {
    const { selectKey } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={(ref) => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className={styles.leftMenu}>
            <Menu
              selectedKeys={[selectKey]}
              onClick={({ key }) => this.selectKey(key as SettingsStateKeys)}
            >
              {this.getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {this.renderChildren()}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default Settings;
