import React, { useEffect, useContext, useState } from "react";
import CodeEditor from "./CodeEditor";
import { Device } from "@twilio/voice-sdk";
import { useGlobalState } from "../../context/RoomContextProvider";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

const Room = () => {
  const [roomState, setRoomState] = useGlobalState();
  let {
    roomName,
    username,
    profileURL,
    startTime,
    setStartTime,
    elapsedTime,
    setElapsedTime,
  } = useContext(AuthContext);
  const [call, setCall] = useState();
  const [callConnected, setCallConnected] = useState(false);
  const [shareableLink, setShareableLink] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  let checkCall = false;
  const { device } = roomState;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    const fetchRooms = async () => {
      console.log("inside useEffect");
      if (username.length > 0) {
        console.log("username", username, "roomName", roomName);
        const params = {
          roomName,
          participantLabel: username,
        };
        if (checkCall === false) {
          if (!call) {
            const callPromise = device.connect({ params });
            callPromise.then((twilioCall) => {
              const roomName = twilioCall.customParameters.get("roomName");
              console.log("Room Name:", roomName);
              setCall((prev) => twilioCall);
              setCallConnected(true);
            });
            await sleep(10000);
            try {
              const roomsResponse = await fetch(
                `${profileURL}voice_chat/rooms`,
              );
              if (!roomsResponse.ok) {
                throw new Error(
                  "Network response was not ok " + roomsResponse.statusText,
                );
              }
              const roomsData = await roomsResponse.json();
              // console.log('rooms', roomsData);
              console.log("roomData", roomsData.rooms);
              console.log("**username", username);

              // Filter for rooms where participants include username
              const matchedRoom = roomsData.rooms.find((room) =>
                room.participants.includes(username),
              );
              if (matchedRoom) {
                const matchedRoomName = matchedRoom.room_name;
                // console.log('Matched Room Name:', matchedRoomName);
                const linkToShare = `${window.location.origin}/join/${matchedRoomName}?username=${username}`;
                console.log("linktoShare", linkToShare);
                setShareableLink(linkToShare);
                setIsModalVisible(true);
              } else {
                console.log("No matching room found");
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
        checkCall = true;
      }
    };

    fetchRooms();
  }, [roomName, call, device]);

  return (
    <>
      <CodeEditor />
    </>
  );
};

export default Room;
