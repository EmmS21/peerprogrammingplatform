import React, { Component,useContext, useState } from "react";
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
//        let [ updateProfile ] = useContext(AuthContext)
        //store users in state
        const[profileUser, setProfileUser] = useState({user})
        //modal state
        const { isShowing, toggle } = useModal();
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
//                city: profileUser.city,
//                country: profileUser.country
            }
            console.log(updateProfile)
            updateProfile(updatedProfileInfo);
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
          <button
            className="md-trigger"
            onClick={toggle}
          >
          Start Coding
          </button>
          <StartModal
            isShowing={isShowing}
            hide={toggle}
          />
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
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src={`http://127.0.0.1:8000/media/${user.photo.replace(/['"]+/g, '')}`}
                    />
                    <h5 className="title">{ profileUser.username }</h5>
                  </a>
                </div>
                <p className="description text-center">

                </p>
                <Button
                    className="btn-round"
                    color="primary"
                    type="submit"
                    name="first_name"
                    >
                    Change Profile pic
                </Button>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="button-container">
                  <Row>
                    <Col className="ml-auto" lg="3" md="6" xs="6">
                      <h5>
                        12 <br />
                        <small>Files</small>
                      </h5>
                    </Col>
                    <Col className="ml-auto mr-auto" lg="4" md="6" xs="6">
                      <h5>
                        2GB <br />
                        <small>Used</small>
                      </h5>
                    </Col>
                    <Col className="mr-auto" lg="3">
                      <h5>
                        24,6$ <br />
                        <small>Spent</small>
                      </h5>
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
//
//                  <Row>
//                    <Col className="pr-1" md="6">
//                      <FormGroup>
//                        <label>City</label>
//                        <Input
//                          value="Melbourne"
//                          placeholder="Enter your city"
//                          type="text"
//                        />
//                      </FormGroup>
//                    </Col>
//                    <Col className="pr-1" md="6">
//                      <FormGroup>
//                        <label>Country</label>
//                        <Input
//                          defaultValue="Australia"
//                          placeholder="Country"
//                          type="text"
//                        />
//                      </FormGroup>
//                    </Col>
//                  </Row>
//                  <Row>
//                    <Col md="12">
//                      <FormGroup>
//                        <label>Bio</label>
//                        <Input
//                          type="textarea"
//                          defaultValue="Oh so, your weak rhyme You doubt I'll bother, reading into it"
//                        />
//                      </FormGroup>
//                    </Col>
//                  </Row>