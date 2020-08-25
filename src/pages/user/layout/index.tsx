import React from 'react';
import { Link } from 'umi';
import Footer from '@/components/Footer';
import styles from './style.less';

const Login: React.FC = (props) => {
  return (
    <div className={styles.container}>
      {/* <div className={styles.lang}> */}
      {/*  <SelectLang/> */}
      {/* </div> */}
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.svg" />
              <span className={styles.title}>智慧食堂管理系统</span>
            </Link>
          </div>
          <div className={styles.desc}>广州天河软件园 - 高唐园区</div>
        </div>

        <div className={styles.main}>{props.children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
