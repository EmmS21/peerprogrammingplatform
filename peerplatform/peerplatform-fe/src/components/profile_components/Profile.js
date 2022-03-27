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
        let { user,logOutUser } = useContext(AuthContext)
        //modal state
        const { isShowing, toggle } = useModal();
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
//                  src={require("assets/img/damir-bosnjak.jpg").default}
                />
              </div>
              <CardBody>
                <div> {user.photo}</div>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
//                      src={require("assets/img/mike.jpg").default}
                    />
                    <h5 className="title">{ user.username }</h5>
                  </a>
                </div>
                <p className="description text-center">
                  { user.first_name }
                </p>
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
                          value={ user.username }
                          placeholder="Username"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">
                          Email address
                        </label>
                        <Input placeholder="Email" type="email" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>First Name</label>
                        <Input
                          value= {user.first_name}
                          placeholder="Enter your first name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Last Name</label>
                        <Input
                          value= { user.last_name }
                          placeholder="Enter your last name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                        <FormGroup>
                            <label>City</label>
                            <Input
                                value = { user.city }
                                placeholder="Enter your city"
                                type="text"
                            />
                        </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                        <FormGroup>
                            <label>Country</label>
                            <Input
                                value = { user.country }
                                placeholder="Enter your country"
                                type="text"
                            />
                        </FormGroup>
                    </Col>
                    <div className="update ml-auto mr-auto">
                      <Button
                        className="btn-round"
                        color="primary"
                        type="submit"
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