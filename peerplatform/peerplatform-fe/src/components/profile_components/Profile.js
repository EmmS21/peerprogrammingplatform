import React, { Component,useContext, useState, useRef } from "react";
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


    const Profile = () => {
        let { user,logOutUser, updateProfile } = useContext(AuthContext)
        //store users in state
        const[profileUser, setProfileUser] = useState({user})
        //modal state
        const { isShowing, toggle } = useModal();
        //open file browser
        const fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');

        //handle form submission
        const handleSubmit = e => {
            e.preventDefault();
            console.log('handle submit',profileUser)
            const updatedProfileInfo = {
                username: profileUser.username,
                email: profileUser.email,
                first_name: profileUser.first_name,
                last_name: profileUser.last_name,
                user_id: profileUser.user.user_id,
            }
            console.log(updateProfile)
            updateProfile(updatedProfileInfo);
        }
        //open file browser on click
        const openFile = (e) => {
            fileSelector.onChange = fileSelectedHandler
            fileSelector.click();
//            console.log(e.target.files[0])
//            const { current } = inputRef
//            console.log(e.target.files[0])
        }
        //on change handler
        const fileSelectedHandler = (e) => {
            console.log(e);
        }

        return (
              <>
          <div className="content">
          <button
            className="btn-round"
            color="primary"
            onClick={logOutUser}
          >
          Logout
          </button>
          <Link to={"/code_editor"} className="button button-primary button-wide-mobile button-sm">
            Start Coding
          </Link>
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
            <input type="file"/>
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
                  </a>
                </div>
                <p className="description text-center">

                </p>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="button-container">
                  <Row>
                    <Col className="ml-auto mr-auto" lg="4" md="6" xs="6">
                      <small>
                         User score
                      </small>
                    </Col>
                    <Col className="mr-auto" lg="3">
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
                        <label>Username</label>
                        <Input
//                          value={ user.username }
                          placeholder="Username"
                          type="text"
                          name="username"
                          onChange={ e => setProfileUser({...profileUser, 'username': e.target.value}) }
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">
                          Email address
                        </label>
                        <Input
                            placeholder="Email"
                            type="email"
                            name="email"
                            value={profileUser.email}
                            onChange={ e => setProfileUser({...profileUser, 'email': e.target.value}) }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
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