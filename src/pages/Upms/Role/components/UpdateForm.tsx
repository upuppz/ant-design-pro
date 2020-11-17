import React from 'react';
import {Modal} from 'antd';

interface UpdateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<UpdateFormProps> = (props) => {
  const {modalVisible, onCancel} = props;

  return (
    <Modal
      destroyOnClose
      title="更新用户"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
