import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import "../../assets/demo/buttonsflash.css";

const ShareLink = ({ visible, onCancel, shareableLink }) => {
  const [linkCopied, setLinkCopied] = useState(false); 

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink)
      setLinkCopied(true)
    }
    catch (err){
      console.error("Failed to copy text:", err)
    }
  };

  const handleModalCancel = () => {
    if (onCancel) {  
      onCancel(); 
    }
    setLinkCopied(false); 
  };

  return (
    <>
      <Modal
        title="Here's your shareable link"
        className='my-custom-modal'
        visible={visible}
        onCancel={handleModalCancel}
        footer={null}
        maskClosed={true}
        bodyStyle={{ backgroundColor: 'white', color: 'black' }} 
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {shareableLink}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button 
            type="primary" 
            onClick={copyLink}
            disabled={linkCopied}
            style={{ backgroundColor: linkCopied ? 'green' : undefined }} 
          >
            {linkCopied ? <CheckOutlined /> : null} 
            {linkCopied ? " Link Copied" : " Copy Link"} 
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ShareLink;
