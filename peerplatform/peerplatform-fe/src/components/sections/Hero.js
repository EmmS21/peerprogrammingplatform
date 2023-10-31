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
import "../../assets/demo/buttonsflash.css";
import axios from 'axios';
import ClockLoader from "react-spinners/ClockLoader";
import { useGlobalState } from '../../context/RoomContextProvider';
import { Device } from '@twilio/voice-sdk';
import ShareLink from './ShareLink';

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
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [clockSpin, setClockSpin] = useState(false);
  const [stage, setStage] = useState(0);
  let { profileURL, setChallengeInState, setShowNextChallengeButton, 
        getSolution, setRoomName, username, setUserName, roomName } = useContext(AuthContext);
  const [roomState, setRoomState] = useGlobalState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shareableLink, setShareableLink] = useState("")
  const { device } = roomState



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
    // console.log('selection', selection)
    const base_url = `${profileURL}programming_challenge/${selection}` 
    axios.get(base_url)
    .then(async (res)=>{
      let opt = "three"
      const challengeName = res.data[0].title
      const challengeDescription = res.data[0].place
      const challenge = {challengeName, challengeDescription}
      let result = await getSolutionHandler(challenge, null, opt)
      result = result.replace(/\n/g, ' ');
      result = JSON.stringify(result)
      res.data[0].extra_explain = JSON.parse(result);
      // console.log('res', res.data)
      setChallengeInState(res.data)
      //   // console.log('res.data', res.data)
      setShowNextChallengeButton(true)
      if(res.data[0] && res.data.length > 0){
        let opt = "one"
        // console.log('res', res.data)
        // console.log('challenge', res.data)
        // console.log('before setting to local', JSON.stringify(res.data))
        localStorage.setItem('challenge', JSON.stringify(res.data));
        let result = await getSolutionHandler(challenge, null, opt)
        // console.log('Hero **** result', result)
        setClockSpin(false);
        history.push(`/rooms/${generateRandomString(5)}`)
      }
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

  async function getSolutionHandler(challenge, query=null, opt){
    try {
        return await getSolution(challenge, query, opt)
    } catch(error){
        return console.error('Error fetching the solution:', error)
    } 
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


  function openModal (e) {
    e.preventDefault();
    setVideomodalactive(true);
  }

  function closeModal (e) {
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
              <ShareLink 
                visible={isModalVisible} 
                onCancel={()=> setIsModalVisible(false)} 
                shareableLink={shareableLink}
              />
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
                    className="my-custom-modal"
                    title={
                      <div style={{ textAlign: 'center' }}>
                        {clockSpin ? (
                          <>
                            Please Wait
                            <span className="bouncing-dot"></span>
                            <span className="bouncing-dot"></span>
                            <span className="bouncing-dot"></span>
                          </>
                        ) : stage === 0 ? (
                          "Choose Mode"
                        ): stage === 1 ? (
                          "Pick a nickname"
                        ):
                        (
                          "Select Challenge Difficulty"
                        )}
                      </div>
                    }                    
                    visible={isEmailModalVisible}
                    onCancel={() => {
                      setIsEmailModalVisible(false)
                      setStage(0)
                    }}
                    footer={null}
                  >
                    {clockSpin ? (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <ClockLoader color="#36d7b7" />
                      </div>
                    ): stage === 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                      <Button type="primary" onClick={() => setStage(2)} style={{ marginBottom: '10px' }}>
                        Solo
                      </Button>
                      <Button type="primary" onClick={() => setStage(1)}>
                        Pair Program
                      </Button>
                    </div>            
                    ): stage === 1 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                          <Input
                            placeholder="Enter your username"
                            value={username}
                            onChange={e => setUserName(e.target.value)}
                            style={{ marginBottom: '10px' }}
                          />
                          <Button 
                            type="primary"
                            disabled={!username} 
                            onClick={() => {
                            if (username) {
                              handleStageSet('pair', username.toLowerCase());  
                            }
                          }}>
                            Submit
                          </Button>
                      </div>          
                    ):
                    (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                      <Button className="flash-on-hover" type="primary" onClick={(e) => handleSelect(e, e.currentTarget.innerText)} style={{ marginBottom: '10px' }}>
                        Easy
                      </Button>
                      <Button className="flash-on-hover" type="primary" onClick={(e) => handleSelect(e, e.currentTarget.innerText)} style={{ marginBottom: '10px' }}>
                        Medium
                      </Button>
                      <Button className="flash-on-hover" type="primary" onClick={(e) => handleSelect(e, e.currentTarget.innerText)}>
                        Hard
                      </Button>
                    </div>
                    )}
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