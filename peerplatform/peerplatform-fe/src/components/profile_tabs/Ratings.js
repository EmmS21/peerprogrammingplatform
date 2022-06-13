import React, { useState,useContext } from 'react';
import { Modal, Button, Slider } from 'antd';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import IconSlider from './IconSlider.js'
import IconSliderTwo from './IconSliderQuestionTwo.js'
import IconSliderThree from './IconSliderQuestionThree.js'
import AuthContext from '../../context/AuthContext';

const Ratings = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { valueOne, valueTwo, valueThree } = useContext(AuthContext);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Rate Peer
      </Button>
      <Modal title="Rate your peer" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <center>How well did they explain their logic?</center>
        <IconSlider/>
        <center>How would you rate their problem solving skills?</center>
        <IconSliderTwo/>
        <center>How willing would you be to work with them again?</center>
        <IconSliderThree/>

      </Modal>
    </>
  );
};
export default Ratings;

