import React, { useState, useContext } from "react";
import { Modal, Button, Slider } from "antd";
import { FrownOutlined, SmileOutlined } from "@ant-design/icons";
import IconSlider from "./IconSlider.js";
import IconSliderTwo from "./IconSliderQuestionTwo.js";
import IconSliderThree from "./IconSliderQuestionThree.js";
import IconSliderFour from "./IconSliderQuestionFour.js";
import AuthContext from "../../context/AuthContext";

const Ratings = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { postReview } = useContext(AuthContext);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    postReview();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Completed
      </Button>
      {/* <Modal title="Rate your peer" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <center>How well did they explain their logic?</center>
        <IconSlider/>
        <center>How would you rate their problem solving skills?</center>
        <IconSliderTwo/>
        <center>How willing would you be to work with them again?</center>
        <IconSliderThree/>
        <center>How would you rate their ability to read and write clean code</center>
        <IconSliderFour/>
      </Modal> */}
    </>
  );
};
export default Ratings;
