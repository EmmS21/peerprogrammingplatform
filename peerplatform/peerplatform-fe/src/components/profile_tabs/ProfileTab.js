import React, { useState } from "react";
import '../../assets/other_css/tabs.css';
import Introduction from './Introduction';
import Second from './Introduction';
import "antd/dist/antd.css";
import { Steps } from 'antd'
import { AudioOutlined, MessageOutlined, CodeOutlined, BuildOutlined, SolutionOutlined } from '@ant-design/icons';


const Tabs = ({ index }) => {
  const { Step } = Steps;
//  const { index } = props

  return (
    <div>
        <Steps direction="vertical" current={index-1} >
            <Step title='Introduction' description="Time to introduce yourself to your peer." icon={<AudioOutlined/>} />
            <Step title="Pseudo Code" description="Time to pseudoCode potential solutions" icon={<MessageOutlined/>} />
            <Step title="Code" description="Time to Code" icon={<CodeOutlined />} />
            <Step title="Review and Rebuild" description="If you don't already have a working answer, time to find one and rebuild it" icon={<SolutionOutlined />} />
         </Steps>
    </div>
  );
};
export default Tabs;