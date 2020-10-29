import React from 'react';

import { Input } from 'antd';
import styles from './PhoneView.less';

interface PhoneViewProps {
  value?: string;
  onChange?: (value: string) => void;
}

const PhoneView: React.FC<PhoneViewProps> = (props) => {
  const { value, onChange } = props;
  let values = ['', ''];
  if (value) {
    const split = value.split('-');
    if(split.length === 1){
      // eslint-disable-next-line prefer-destructuring
      values[1] = split[0];
    }else{
      values = split;
    }
  }

  return (
    <>
      <Input
        className={styles.area_code}
        value={values[0]}
        onChange={(e) => {
          if (onChange) {
            onChange(`${e.target.value}-${values[1]}`);
          }
        }}
        placeholder='区号'
      />
      <Input
        className={styles.phone_number}
        onChange={(e) => {
          if (onChange) {
            onChange(`${values[0]}-${e.target.value}`);
          }
        }}
        value={values[1]}
        placeholder='电话号码'
      />
    </>
  );
};

export default PhoneView;
