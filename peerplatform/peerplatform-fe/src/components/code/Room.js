import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useGlobalState } from '../../context/RoomContextProvider';
import CodeEditor from './CodeEditor';
import AuthContext from '../../context/AuthContext';
import WebSocketInstance from '../../websocket/Connect';
import axios from 'axios';

let checkCall = false
const Room = ({ showSelect,setShowSelect}) => {
    const history = useHistory();
    const [state, setState] = useGlobalState();
    const [call, setCall] = useState();
    const [callConnected, setCallConnected] = useState(false)
    const { device } = state;
    const { user, logOutUser, 
            matchedUserState, driverInState, 
            sortUsersAlphabetically,room_name, 
            participants, profileURL
         } = useContext(AuthContext)
    const roomName = room_name.current

    
    useEffect(() => {
        function selectDriver() {
            driverInState.current = sortUsersAlphabetically([user.username, matchedUserState.current])[0]
        }
        console.log('!!!*** how many times is twilio being called ***!!!')
        WebSocketInstance.connect()
        selectDriver()
        // const params = {
        //     roomName: roomName, participantLabel: user.username
        // };
        // if(checkCall === false){
        //     if (!call) {
        //         const callPromise = device.connect({ params });
        //         callPromise.then((twilioCall) => {
        //         console.log(' ***what is call', twilioCall)
        //         setCall((prev) => twilioCall);
        //         setCallConnected(true)
        //         });
        //     }
        //     if (!participants.current.includes(user.username)) {
        //             participants.current.push(user.username);
        //     }
        //     checkCall = true
        // }
    }, [roomName, user, call, device, participants, driverInState,matchedUserState,sortUsersAlphabetically]);
    
    const handleLeaveRoom = () => {
        console.log('INSIDE FUNCTION TO TERMINATE CALL', JSON.stringify(call))
        // history.push('/rooms');
    };
    const endCall = () => {
        handleLeaveRoom();
        setState({...state, createdRoomTopic: null}); // clear created room.
    };

    return (
    <>
        <button onClick={ ()=> endCall() }>End Call</button>
        <CodeEditor endCall={endCall} />
    </>
    )
}

export default Room;
