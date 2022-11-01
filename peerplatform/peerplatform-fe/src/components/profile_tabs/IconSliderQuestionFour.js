import React, { useState,useContext } from 'react';
import { Slider } from 'antd';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import '../../assets/other_css/sliders.css';
import AuthContext from '../../context/AuthContext';

const IconSlider = (props) => {
  const { max, min } = props;
  const { valueFour, setValueFour } = useContext(AuthContext);
  const mid = Number(((max - min) / 2).toFixed(5));
  const preColorCls = valueFour >= mid ? '' : 'icon-wrapper-active';
  const nextColorCls = valueFour >= mid ? 'icon-wrapper-active' : '';
  return (
    <div className="icon-wrapper">
      <FrownOutlined className={preColorCls} />
      <Slider {...props} onChange={setValueFour} value={valueFour} />
      <SmileOutlined className={nextColorCls} />
    </div>
  );
};

const IconSliderFour = () => <IconSlider min={0} max={20} />;


export default IconSliderFour;



