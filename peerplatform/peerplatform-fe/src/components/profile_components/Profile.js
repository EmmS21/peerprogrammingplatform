import React, { Component,useContext, useState, useRef, useEffect } from "react";
import "../../assets/scss/core/signup_components/_signup.scss"
import "../../assets/scss/modal.scss"
import "../../assets/demo/demo.css";
import "../../assets/dashboard_scss/paper-dashboard.scss";
import "bootstrap/dist/css/bootstrap.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import AuthContext from '../../context/AuthContext';
//import modal and custom hook
import StartModal from './StartModal';
import useModal from './useModalCustomHook'
//update profile information
//import { updateProfile } from "../login_components/LoginActions.js";
//import monaco code editor
import CodeEditor from '../code/CodeEditor'
import { Link } from 'react-router-dom';
//import App from '../../../editor-ui/src/App.vue'
import StartCodingComponent from '../code/StartCodingComponent';
//import { useGlobalState } from '../../context/RoomContextProvider';
import Ratings from '../profile_tabs/Ratings'
import axios from 'axios';
import { useIdleTimer } from 'react-idle-timer'
import { useHistory } from 'react-router-dom';
import PushNotifications from './PushNotifications.js'

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import { Button as AntButton, Modal } from 'antd';
import StripeElementsProvider from '../payments/StripeElementsProvider';
import { useCookies } from 'react-cookie';

    const Profile = () => {
        let { user, logOutUser,
              updateProfile, retrieveChallenge,
              getProfileInfo, pairUsers } = useContext(AuthContext)
        //store users in state
        const[profileUser, setProfileUser] = useState({user})
        //modal state
        const { isShowing, toggle } = useModal();
        //open file browser
        const fileSelector = document.createElement('input');
        //get room global state
//        const { useGlobalState } = useContext(useGlobalState)
        fileSelector.setAttribute('type', 'file');
        const history = useHistory();
        //controls payment modal
        const [visible, setVisible] = useState(false);
        const [token, setToken] = useState('')
        const [cookies, setCookie] = useCookies();
//
        //service worker
//        const check = () => {
//            if(!('serviceWorker' in navigator)) {
//                throw new Error('No Service Worker support!')
//            }
//            if (!('PushManager' in window)) {
//                throw new Error('No Push API Support!')
//            }
//            console.log('check is running')
//        }
//
//
//        const registerServiceWorker = async () => {
//            const swRegistration = await navigator.serviceWorker.register('./service.js')
//            console.log('registering service worker')
//            return swRegistration;
//        }
//
//        const requestNotificationPermission = async () => {
//            const permission = await window.Notification.requestPermission();
//            if(permission !== 'granted') {
//                throw new Error('Permission not granted for Notification');
//            }
//        }
//
//        const showLocalNotification = (title, body, swRegistration) => {
//            const options = {
//                body,
//            };
//            swRegistration.showNotification(title, options)
//        };
//        //run main function to register service worker and get subscription object
//        const main = async () => {
//            check()
//            const swRegistration = await registerServiceWorker();
//            const permission = await requestNotificationPermission();
//            showLocalNotification('This is title', 'this is the message', swRegistration);
//        }

//        main();


        //on idle update Profile model activity field
        const handleOnIdle = (event: any) => {
            axios.patch(`http://127.0.0.1:8000/update_profile/${user.user_id}/`, {
                currently_active: false
            })
            .then(res => {
                console.log('user is idle',res.data)
            })
        }

        //on active update profile model activity field
        const handleOnActive = (event: any) => {
            axios.patch(`http://127.0.0.1:8000/update_active/${user.user_id}/`, {
                currently_active: true
            })
            .then(res => {
                console.log('user active', res.data)
            })
        }

        const { getLastActiveTime } = useIdleTimer ({
            timeout: 1000 * 60 * 15,
//            timeout: 1000 * 10,
            onIdle: handleOnIdle,
            onActive: handleOnActive,
            debounce: 500
        })

        //handle form submission
        const handleSubmit = e => {
            e.preventDefault();
            console.log('handle submit',profileUser)
            const updatedProfileInfo = {
                first_name: profileUser.first_name,
                last_name: profileUser.last_name,
                user_id: profileUser.user.user_id,
                city: profileUser.city,
                country: profileUser.country,
                profile_pic: profileUser.profile_pic,
            }
            updateProfile(updatedProfileInfo);
        }

        const countDown = () => {
            let secondsToGo = 5;
            const modal = Modal.success({
                title: 'Payment Success',
                content: `You have successfully paid, this message will close in ${secondsToGo} seconds.`,
            });
            const timer = setInterval(() => {
                secondsToGo -=1;
                modal.update({
                    content: `You have successfully paid, this message will close in ${secondsToGo} seconds.`,
                });
            }, 1000);
            setTimeout(() => {
                clearInterval(timer);
                modal.destroy();
            }, secondsToGo * 1000);
        };

        const updateWaitingRoomStatus = () => {
        axios.patch(`http://127.0.0.1:8000/update_profile/${user.user_id}/`, {
            in_waiting_room: false
        })
        .then(res => {
//            console.log('user is in waiting room', res.data)
        })
        }

        //get profile information
        useEffect(() => {
            getProfileInfo(user.user_id)
            //get all users
//            getAllUsers()
            updateWaitingRoomStatus()
            console.log('pair users', pairUsers)
        },[]);

        return (
              <>
                  <div className="content">
                        <PushNotifications />
                        <div class="d-flex flex-row-reverse">
                            <button className="button button-primary button-wide-mobile button-sm" color="primary" onClick={logOutUser}>
                                Logout
                            </button>
                            <StartCodingComponent/>
                        </div>
                <Row>
                  <Col md="4">
                    <Card className="card-user">
                      <div className="image">
                        <img
                          alt="..."
                          src={`http://127.0.0.1:8000/media/${user.photo.replace(/['"]+/g, '')}`}
                        />
                      </div>
                      <CardBody>
                    <input type="file" onChange={ e => setProfileUser({...profileUser, 'profile_pic': e.target.files[0].name }) }/>
                        <div className="author">
                          <a href="#pablo" onClick={(e) => e.preventDefault()}>
                            <label htmlFor="photo-upload" className="custom-file-upload fas">
                                <div className="img-wrap img-upload">
                                    <img
                                        alt="..."
                                        className="avatar border-gray"
                                        src={`http://127.0.0.1:8000/media/${user.photo.replace(/['"]+/g, '')}`}
                                    />
                                </div>
                            </label>
                            <h5 className="title">Hi, { user.username[0].toUpperCase()+user.username.slice(1) }</h5>
                            <h6> { user.city }, { user.country } </h6>
                          </a>
                        </div>
                        <p className="description text-center">
                        </p>
                      <center>
                        <AntButton type="primary" onClick={()=> setVisible(true)}>
                            Pay to unlock
                        </AntButton>
                        <Modal
                            title="Pay to unlock unlimited peer sessions"
                            centered
                            visible={visible}
                            okButtonProps={{ style: { display: 'none' } }}
                            cancelButtonProps={{ style: { display: 'none' } }}
                            onCancel={ ()=> setVisible(false) }
                            width={1000}
                        >
                        <StripeElementsProvider  setVisible={ setVisible } countDown={ countDown } />
                        </Modal>
                      </center>
                      </CardBody>
                      <CardFooter>
                        <hr />
                        <div className="button-container">
                          <Row>
                            <Col className="ml-auto mr-auto" lg="6">
                              <small>
                                 User score
                              </small>
                            </Col>
                            <Col className="mr-auto" lg="6">
                              <small>
                                Monthly Score
                              </small>
                            </Col>
                          </Row>
                        </div>
                      </CardFooter>
                    </Card>
                  </Col>
                  <Col md="8">
                    <Card className="card-user">
                      <CardHeader>
                        <CardTitle tag="h5">Edit Profile</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Form>
                          <Row>
                            <Col className="pr-1" md="6">
                              <FormGroup>
                                <label>First Name</label>
                                <Input
        //                          value= {user.first_name}
                                  placeholder="Enter your first name"
                                  type="text"
                                  name="first_name"
                                  onChange={ e => setProfileUser({...profileUser, 'first_name': e.target.value}) }
                                />
                              </FormGroup>
                            </Col>
                            <Col className="pr-1" md="6">
                              <FormGroup>
                                <label>Last Name</label>
                                <Input
        //                          value= { user.last_name }
                                  placeholder="Enter your last name"
                                  type="text"
                                  name="last_name"
                                  onChange={ e => setProfileUser({...profileUser, 'last_name': e.target.value}) }
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="pr-1" md="6">
                                <FormGroup>
                                    <label>City</label>
                                    <Input
        //                                value = { user.city }
                                        placeholder="Enter your city"
                                        type="text"
                                        name="city"
                                        onChange={ e => setProfileUser({...profileUser, 'city': e.target.value}) }
                                    />
                                </FormGroup>
                            </Col>
                            <Col className="pr-1" md="6">
                                <FormGroup>
                                    <label>Country</label>
                                    <Input
        //                                value = { user.country }
                                        placeholder="Enter your country"
                                        type="text"
                                        name="country"
                                        onChange={ e => setProfileUser({...profileUser, 'country': e.target.value}) }
                                    />
                                </FormGroup>
                            </Col>
                            <div className="update ml-auto mr-auto">
                              <Button
                                className="btn-round"
                                color="primary"
                                type="submit"
                                onClick={handleSubmit}
                              >
                                Update Profile
                              </Button>
                            </div>
                          </Row>
                        </Form>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
        </>
    );
}

export default Profile;