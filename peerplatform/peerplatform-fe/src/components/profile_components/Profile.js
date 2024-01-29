import React, {
  Component,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import "../../assets/scss/core/signup_components/_signup.scss";
import "../../assets/scss/modal.scss";
import "../../assets/demo/demo.css";
import "../../assets/dashboard_scss/paper-dashboard.scss";
import "bootstrap/dist/css/bootstrap.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import AuthContext from "../../context/AuthContext";
import useModal from "./useModalCustomHook";
import StartCodingComponent from "../code/StartCodingComponent";
import axios from "axios";
import { useIdleTimer } from "react-idle-timer";
import { useHistory } from "react-router-dom";
import "../../assets/dashboard_scss/image-uploader.scss";
import FormData from "form-data";

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
import { Button as AntButton, Modal } from "antd";
import StripeElementsProvider from "../payments/StripeElementsProvider";

const Profile = () => {
  let {
    user,
    logOutUser,
    updateProfile,
    getProfileInfo,
    updateProfilePic,
    profileURL,
  } = useContext(AuthContext);
  //store users in state
  const [profileUser, setProfileUser] = useState({ user });
  const fileSelector = document.createElement("input");
  fileSelector.setAttribute("type", "file");
  const [visible, setVisible] = useState(false);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const baseURL = `${profileURL}media/`;
  const photoURL = user.photo.split('"').join("");

  //on idle update Profile model activity field
  const handleOnIdle = () => {
    axios
      .patch(`${profileURL}update_profile/${user.user_id}/`, {
        currently_active: false,
      })
      .then((res) => {
        console.log("user is idle", res.data);
      });
  };

  //on active update profile model activity field
  const handleOnActive = () => {
    axios
      .patch(`${profileURL}update_active/${user.user_id}/`, {
        currently_active: true,
      })
      .then((res) => {
        console.log("user active", res.data);
      });
  };

  const { getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 15,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 500,
  });

  //handle form submission
  const handleSubmit = (e) => {
    // e.preventDefault();
    let profileData = new FormData();
    profileData.set("profile_pic", fileDataURL);
    const updatedProfileInfo = {
      first_name: profileUser.first_name,
      last_name: profileUser.last_name,
      city: profileUser.city,
      country: profileUser.country,
    };
    updateProfilePic(profileData, user.user_id);
    updateProfile(updatedProfileInfo, user.user_id);
  };

  const countDown = () => {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Payment Success",
      content: `You have successfully paid, this message will close in ${secondsToGo} seconds.`,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
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
    axios
      .patch(`${profileURL}update_profile/${user.user_id}/`, {
        in_waiting_room: false,
      })
      .then((res) => {});
  };

  //get profile information
  useEffect(() => {
    console.log("can I console log inside useEffect?!!!");
    getProfileInfo(user.user_id);
    updateWaitingRoomStatus();
  }, []);

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (profilePic) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result) {
          setFileDataURL(result);
        }
      };
      fileReader.readAsDataURL(profilePic);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [profilePic]);

  function onImageChange(e) {
    const image = e.target.files[0];
    setProfilePic(image);
  }

  return (
    <>
      <div className="content">
        <div class="d-flex flex-row-reverse">
          <button
            className="button button-primary button-wide-mobile button-sm"
            color="primary"
            onClick={logOutUser}
          >
            Logout
          </button>
          <StartCodingComponent />
        </div>
        <Row>
          <Col md="4">
            <Card className="card-user">
              <div className="image">
                <img
                  alt="..."
                  src={fileDataURL ? fileDataURL : `${baseURL}${photoURL}`}
                />
              </div>
              <CardBody>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <label
                      htmlFor="photo-upload"
                      className="custom-file-upload fas"
                    >
                      <div className="img-wrap img-upload">
                        <img
                          alt="..."
                          className="avatar border-gray"
                          src={
                            fileDataURL ? fileDataURL : `${baseURL}${photoURL}`
                          }
                        />
                      </div>
                    </label>
                  </a>
                  <div>
                    <form class="file-uploader">
                      <label for="file-input">Select Profile Picture</label>
                      <input
                        type="file"
                        id="file-input"
                        onChange={(e) => onImageChange(e)}
                        accept="image/*"
                      />
                    </form>
                  </div>
                  <h5 id="username-returned" className="title">
                    Hi, {user.username}
                  </h5>
                  <h6>
                    {" "}
                    {user.city}, {user.country}{" "}
                  </h6>
                </div>
                <p className="description text-center"></p>
                <center>
                  <AntButton type="primary" onClick={() => setVisible(true)}>
                    Pay to unlock
                  </AntButton>
                  <Modal
                    title="Pay to unlock unlimited peer sessions"
                    centered
                    visible={visible}
                    okButtonProps={{ style: { display: "none" } }}
                    cancelButtonProps={{ style: { display: "none" } }}
                    onCancel={() => setVisible(false)}
                    width={1000}
                  >
                    <StripeElementsProvider
                      setVisible={setVisible}
                      countDown={countDown}
                    />
                  </Modal>
                </center>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="button-container">
                  <Row>
                    <Col className="ml-auto mr-auto" lg="4" md="6" xs="6">
                      <small>User score</small>
                    </Col>
                    <Col className="mr-auto" lg="3">
                      <small>Monthly Score</small>
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
                          placeholder="Enter your first name"
                          type="text"
                          name="first_name"
                          onChange={(e) =>
                            setProfileUser({
                              ...profileUser,
                              first_name: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Last Name</label>
                        <Input
                          placeholder="Enter your last name"
                          type="text"
                          name="last_name"
                          onChange={(e) =>
                            setProfileUser({
                              ...profileUser,
                              last_name: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>City</label>
                        <Input
                          placeholder="Enter your city"
                          type="text"
                          name="city"
                          onChange={(e) =>
                            setProfileUser({
                              ...profileUser,
                              city: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Country</label>
                        <Input
                          placeholder="Enter your country"
                          type="text"
                          name="country"
                          onChange={(e) =>
                            setProfileUser({
                              ...profileUser,
                              country: e.target.value,
                            })
                          }
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
};

export default Profile;
