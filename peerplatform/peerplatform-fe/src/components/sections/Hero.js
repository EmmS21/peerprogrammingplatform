import React, { useState,useContext } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';
import { Modal, Input } from 'antd';
import {Alert} from 'antd';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';


const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {

  const [videoModalActive, setVideomodalactive] = useState(false);
  const [visible, setVisible] = useState(false)
  const history = useHistory();
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  let { profileURL } = useContext(AuthContext)

  const handleGetStarted = () => {
    setIsEmailModalVisible(true);
  };

  const handleEmailSubmit = async () => {
    // Make API call to store email in the backend
    console.log('handleEmailSubmit')
    await fetch(`${profileURL}api/addEmail/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    setIsEmailModalVisible(false);
    history.push('/rooms');
  };


  const openModal = (e) => {
    e.preventDefault();
    setVideomodalactive(true);
  }

  const closeModal = (e) => {
    e.preventDefault();
    setVideomodalactive(false);
  }   

  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );



  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content">
            <h1 id="header" className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
              Learn Leetcode <span className="text-color-primary">using AI</span>
            </h1>
            <div className="container-xs">
              <p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
              </p>
              <div className="reveal-from-bottom" data-reveal-delay="600">
                  { visible ?
                    (
                        <Alert message="This platform is currently invite only, please subscribe to the mailing list and you will be notified when you can create a profile" type="error" showIcon closable />
                    ): null
                  }
                  <Button tag="a" color="primary" wideMobile onClick={handleGetStarted} id="get-started">
                    Get started
                  </Button>
                  <Modal
                    title="Enter your email"
                    visible={isEmailModalVisible}
                    onCancel={() => setIsEmailModalVisible(false)}
                    footer={[
                      <Button key="submit" type="primary" onClick={handleEmailSubmit}>
                        Submit
                      </Button>,
                    ]}
                  >
                    <Input
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Modal>
              </div>
            </div>
          </div>
          <div className="hero-figure reveal-from-bottom illustration-element-01" data-reveal-value="20px" data-reveal-delay="800">
            <a
              id="video-icon"
              data-video="https://youtu.be/n_OT7bHZ-ls"
              href="#0"
              aria-controls="video-modal"
              onClick={openModal}
            >
              <Image
                className="has-shadow"
                src={require('./../../assets/images/peerprogramming.png')}
                alt="Hero"
                width={896}
                height={504} />
            </a>
          </div>
          <Modal
            id="video-modal"
            show={videoModalActive}
            handleClose={closeModal}
            video= "https://www.youtube.com/embed/n_OT7bHZ-ls"
            videoTag="iframe" />
        </div>
      </div>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;