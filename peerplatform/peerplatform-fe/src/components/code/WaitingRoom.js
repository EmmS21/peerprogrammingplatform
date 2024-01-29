import React, { useEffect, useContext, useState, useRef } from "react";
import NewRoom from "./NewRoom";
import { Link, useHistory } from "react-router-dom";
import { useGlobalState } from "../../context/RoomContextProvider";
import { useFetchRooms } from "../../hooks/useFetchRooms";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import "../../assets/waitingRoom/app.css";
import { Button, Modal, notification } from "antd";
import WebSocketInstance from "../../websocket/Connect";

let secondCounter = 0;
const WaitingRoom = () => {
  const [state, setState] = useGlobalState();
  const history = useHistory();
  const {
    user,
    logOutUser,
    updateProfile,
    pairUsers,
    allOnlineUsers,
    availableOnlineUsers,
    config,
    authTokens,
    receiveWebSocketData,
    matchedUserState,
    sortUsersAlphabetically,
    profileURL,
    room_name,
    participants,
  } = useContext(AuthContext);
  const [websocketVal, setWebSocketVal] = useState("");

  useEffect(() => {
    // WebSocketInstance.connect()
    console.log(`$$$ device is now:${state.device} $$$`);
    const username = user.username;
    const matchedUser = availableOnlineUsers.current
      .filter(function (user) {
        return (
          user !== username &&
          user !== "" &&
          user !== "null" &&
          user !== "undefined"
        );
      })
      .pop();
    let sending = {};
    sending.data = username + "," + matchedUser;
    console.log("sending", sending);
    //don't need this in state
    matchedUserState.current = matchedUser;
    console.log("matched in state", matchedUserState.current);
    setState({ ...state, username });
    createTwilioConference(user.username, matchedUserState.current);
    handleRoomCreate(username, matchedUserState.current);
    axios.post(`${profileURL}get_room/`, sending).then((res) => {
      redirectMatchedUser(res.data);
    });
  }, []);

  function createTwilioConference(username, matchedUser) {
    console.log(" *** creating TwiML response *** ");
    const pairedUsers = {};
    pairedUsers["roomName"] = sortUsersAlphabetically([
      username,
      matchedUser,
    ]).join("");
    pairedUsers["participantLabel"] = username;
    pairedUsers["matchedUser"] = matchedUser;
    console.log(`@@@ we are sending ${JSON.stringify(pairedUsers)}`);
    axios.post(`${profileURL}voice_chat/rooms`, pairedUsers).then((res) => {
      console.log("twilio call created", res.data);
    });
  }

  function redirectMatchedUser(roomId) {
    setState({ ...state, roomId });
    setTimeout(() => {
      history.push(`/rooms/${roomId}`);
    }, "10000");
  }

  function deleteMatchedUsersRedis(username, matchedUser) {
    console.log("deleteMatched triggered");
    const usersToDelete = {};
    usersToDelete["username"] = username;
    usersToDelete["matched"] = matchedUser;
    axios.delete(`${profileURL}cache/delete`, usersToDelete).then((res) => {
      console.log("axios delete response", res);
    });
  }

  const handleRoomCreate = (username, matchedUser) => {
    const createdRoomTopic = sortUsersAlphabetically([
      username,
      matchedUser,
    ]).join("");
    console.log("createdRoomTopic inside handleRoomCreate", createdRoomTopic);
    // const selectedRoom = {
    //     room_name: createdRoomTopic, participants: []
    // };
    participants.current.push(username);
    participants.current.push(matchedUser);
    const rooms = state.rooms;
    const roomId = [username, matchedUser];
    // setState({...state, rooms, selectedRoom});
    setState({ ...state, rooms });
    room_name.current = createdRoomTopic;
    // console.log('room name in state', state.selectedRoom)
  };

  return (
    <>
      <center>
        <h6>How it works</h6>
      </center>
      <p className="text">The session will be split into 5 phases:</p>
      <ul>
        <li>
          <strong>Introductions:</strong> You will be given 5 minutes for
          introductions. Get to know who you are coding with.
        </li>
        <li>
          <strong>Pseudo-Code</strong> You will receive your problem statement
          and be given 10 minutes to pseudo code potential solutions. If your
          solution is a recipe, what steps will you need to make your meal. Use
          basic english, do not worry about coding concepts yet.
        </li>
        <li>
          <strong>Time to Code</strong> You will be given 40 minutes to
          collaboratively find a solution to the problem or get as close to a
          solution as possible.
        </li>
        <li>
          <strong>Solution</strong> Could not solve the problem? Don't fret, you
          will be given a solution and 20 minutes to break down the solution and
          try and rebuild it yourselves.
        </li>
        <li>
          <strong>Rating</strong> To close things off you will rate each other
          on; i.) logic, ii.) collaboration iii.) general coding skills and iv.)
          communication{" "}
        </li>
      </ul>
      <div></div>
    </>
  );
};

export default React.memo(WaitingRoom);
