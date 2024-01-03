import React, { useState,useContext } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import Button from '../elements/Button';
import { Modal } from 'antd';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import "../../assets/demo/buttonsflash.css";
import axios from 'axios';
import { useGlobalState } from '../../context/RoomContextProvider';
import { Device } from '@twilio/voice-sdk';
import ShareLink from './ShareLink';
import SignupModal from '../layout/SignupModal';
import LoginModal from '../layout/LoginModal';

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

  const history = useHistory();
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [clockSpin, setClockSpin] = useState(false);
  const [stage, setStage] = useState(0);
  let { profileURL, setRoomName, setQuestion,
        isLoginModalVisible, setLoginModalVisible,
        isSignupModalVisible, setIsSignupModalVisible } = useContext(AuthContext);

        // isSignupModalVisible: isSignupModalVisible,
        // setIsSignupModalVisible: setIsSignupModalVisible

  const [roomState, setRoomState] = useGlobalState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shareableLink, setShareableLink] = useState("")


  const handleGetStarted = () => {
    setIsEmailModalVisible(true);
  };

  function handleSelect(e, data){
    e.preventDefault()
    setClockSpin(true)
    let selection;
    // console.log('data', data)
    if(data === 'Easy'){
        selection = 'get_easy'
    }
    else if(data === 'Medium'){
        selection = 'get_medium'
    }
    else {
        selection = 'get_hard'
    }
    const base_url = `${profileURL}programming_challenge/${selection}` 
    axios.get(base_url)
    .then(async (res)=>{
      console.log('sending to funct', res.data)
      setQuestion(res.data)
      setClockSpin(false)
      history.push(`/rooms/${generateRandomString(5)}`)
    })
    .catch(err=> {
        console.log(err)
        setClockSpin(false);
    })  
  }

  function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
  }

  async function handleStageSet(bttn, nickname) {
    console.log('bttn', bttn);
    console.log('nickname', nickname);
    if (bttn === 'pair') {
      try {
        const tokenResponse = await fetch(`${profileURL}voice_chat/token/${nickname}`);
        const tokenData = await tokenResponse.json();
        const twilioToken = JSON.parse(tokenData).token;
        const device = new Device(twilioToken);
        device.updateOptions(twilioToken, {
          codecPreferences: ['opus', 'pcmu'],
          fakeLocalDTMF: true,
          maxAverageBitrate: 16000,
          maxCallSignalingTimeoutMs: 30000
        });
        console.log('token', twilioToken);
        console.log('***device', device);
        device.on('error', (device) => {
          console.log('error', device);
          console.log('error', device.message);

        });
        setRoomState({ ...roomState, device, twilioToken, nickname });
  
        const roomResponse = await axios.post(`${profileURL}voice_chat/rooms`, {}, {
          headers: {
            'Accept': 'application/xml'
          }
        });
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(roomResponse.data, 'text/xml');
        const confElement = xmlDoc.getElementsByTagName("Conference")[0];
        const xmlRoomNameVal = confElement.textContent;
        setRoomName(xmlRoomNameVal);
      } catch (error) {
        console.log(error);
      }
      setStage(2);
    }
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
              Practice programming challenges for interviews <span className="text-color-primary">guided by AI</span>
            </h1>
            <div className="container-xs">
              <p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
              </p>
              <ShareLink 
                visible={isModalVisible} 
                onCancel={()=> setIsModalVisible(false)} 
                shareableLink={shareableLink}
              />
              <div className="reveal-from-bottom" data-reveal-delay="600">
                  <Button tag="a" color="primary" wideMobile onClick={handleGetStarted} id="get-started">
                    Get started
                  </Button>
                  <div style={{ marginBottom: '80px' }}></div>
                  <Modal
                    className="my-custom-modal"
                    title={
                      <div style={{ textAlign: 'center' }}>
                          Select Challenge Difficulty
                      </div>
                    }                    
                    visible={isEmailModalVisible}
                    onCancel={() => {
                      setIsEmailModalVisible(false)
                      setStage(0)
                    }}
                    footer={null}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                      <Button className="flash-on-hover" type="primary" onClick={(e) => handleSelect(e, e.currentTarget.innerText)} style={{ marginBottom: '10px' }}>
                        Easy
                      </Button>
                      {/* <Button className="flash-on-hover" type="primary" onClick={(e) => handleSelect(e, e.currentTarget.innerText)} style={{ marginBottom: '10px' }}>
                        Medium
                      </Button>
                      <Button className="flash-on-hover" type="primary" onClick={(e) => handleSelect(e, e.currentTarget.innerText)}>
                        Hard
                      </Button> */}
                    </div>
                  </Modal>
                  <div>
                    <h2>
                      How it works
                    </h2>
                    <div>Practice programming challenges guided by advice and tips from AI to help you learn more effectively and ace your interviews.</div>
                  </div>
                  { isLoginModalVisible && <LoginModal closeModal={() => setLoginModalVisible(false)} />}
                  { isSignupModalVisible && <SignupModal closeModal={() => setIsSignupModalVisible(false)} />} 
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;

// isSignupModalVisible, setIsSignupModalVisible