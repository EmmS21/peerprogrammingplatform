import React, { useState, useContext } from 'react';
import { Slider } from 'antd';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import '../../assets/other_css/sliders.css';
import AuthContext from '../../context/AuthContext';


const IconSlider = (props) => {
  const { max, min } = props;
//  const [valueOne, setValueOne] = useState(0);
  const mid = Number(((max - min) / 2).toFixed(5));
  const { valueOne, setValueOne } = useContext(AuthContext);

  const preColorCls = valueOne >= mid ? '' : 'icon-wrapper-active';
  const nextColorCls = valueOne >= mid ? 'icon-wrapper-active' : '';

  console.log(`what is the value in state: ${valueOne}`)
  return (
    <div className="icon-wrapper">
      <FrownOutlined className={preColorCls} />
      <Slider {...props} onChange={setValueOne} value={valueOne} />
      <SmileOutlined className={nextColorCls} />
    </div>
  );
};

const IconSliderOne = () => <IconSlider min={0} max={20} />;

export default IconSliderOne;



