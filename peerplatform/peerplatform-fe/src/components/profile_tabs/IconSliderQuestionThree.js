import React, { useState, useContext } from "react";
import { Slider } from "antd";
import { FrownOutlined, SmileOutlined } from "@ant-design/icons";
import "../../assets/other_css/sliders.css";
import AuthContext from "../../context/AuthContext";

const IconSlider = (props) => {
  const { max, min } = props;
  const { valueThree, setValueThree } = useContext(AuthContext);
  const mid = Number(((max - min) / 2).toFixed(5));
  const preColorCls = valueThree >= mid ? "" : "icon-wrapper-active";
  const nextColorCls = valueThree >= mid ? "icon-wrapper-active" : "";
  return (
    <div className="icon-wrapper">
      <FrownOutlined className={preColorCls} />
      <Slider {...props} onChange={setValueThree} value={valueThree} />
      <SmileOutlined className={nextColorCls} />
    </div>
  );
};

const IconSliderThree = () => <IconSlider min={0} max={20} />;

export default IconSliderThree;
