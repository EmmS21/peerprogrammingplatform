import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Form } from "antd";
import 'antd/dist/antd.css';
import "../../assets/other_css/startdisplay.css";
import mixpanel from 'mixpanel-browser';
import { useHistory } from "react-router-dom"; 


const { TextArea } = Input;

const CollectData = ({ exitSession }) => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [form] = Form.useForm();
    const history = useHistory();

    const handleSubmit = (values) => {
        const { email, impressions, helpful, oneChange, issues } = values;
        mixpanel.track('Form Submitted', {
            "Email Address": email,
            "Overall Impressions": impressions,
            "Helpfulness of Questions": helpful,
            "Suggested Change": oneChange,
            "Major Issues": issues
        });
        setIsModalOpen(false)
    };

    const handleCancel = () => {
        exitSession()
        setIsModalOpen(false)
        history.push('/')
    }

    return (
        <Modal 
            title="Post Session Feedback" 
            visible={isModalOpen}
            footer={null}
            onCancel={handleCancel}
            closable={false}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item 
                    name="email" 
                    rules={[{ required: true, message: 'Please enter your email address', type: 'email' }]}
                >
                    <Input placeholder="Please enter your email address" />
                </Form.Item>
                <Form.Item 
                    name="impressions" 
                    rules={[{ required: true, message: 'Please enter your overall impressions' }]}
                >
                    <TextArea placeholder="What were your overall impressions of this platform?" />
                </Form.Item>
                <Form.Item 
                    name="helpful" 
                    rules={[{ required: true, message: 'Please explain if the questions were helpful' }]}
                >
                    <TextArea placeholder="Did the questions help you solve the challenge, if yes, explain why?" />
                </Form.Item>
                <Form.Item 
                    name="oneChange" 
                    rules={[{ required: true, message: 'Please enter your suggestion for one change' }]}
                >
                    <TextArea placeholder="If you had to make one change to the platform to enhance your experience, what would it be and why" />
                </Form.Item>
                <Form.Item 
                    name="issues" 
                    rules={[{ required: true, message: 'Please detail any major issues encountered' }]}
                >
                    <TextArea placeholder="Did you encounter any major issues, please explain these in detail" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
  
export default CollectData;