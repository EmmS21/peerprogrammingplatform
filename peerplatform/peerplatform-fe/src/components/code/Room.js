import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useGlobalState } from '../../context/RoomContextProvider';
import { useFetchRooms } from '../../hooks/useFetchRooms';
import CodeEditor from './CodeEditor';
import AuthContext from '../../context/AuthContext';
import WebSocketInstance from '../../websocket/Connect';



const Room = ({room}) => {
    const history = useHistory();
    const [state, setState] = useGlobalState();
    const [call, setCall] = useState();
    const {device, nickname} = state;
    const { user, logOutUser} = useContext(AuthContext)
    // const roomName = state.selectedRoom.room_name;

    // console.log(`...device:${state.device}, roomName:${roomName}, nick:${nickname}...`)


//    useEffect(() => {
// //        const params = {
// //            roomName: roomName, participantLabel: nickname
// //        };
// //        console.log('participants are:', state.selectedRoom.participants)
// //        if (!call) {
// //            const callPromise = device.connect({ params });
// //            callPromise.then((call) => {
// //                setCall(call);
// //            });
// //        }
// //        if (!state.selectedRoom.participants.includes(nickname)) {
// //            state.selectedRoom.participants.push(nickname);
// //        }
//    }, [device, roomName, nickname, room, call]);
    const handleLeaveRoom = () => {
        call.disconnect();
        history.push('/rooms');
    };
    const handleEndRoom = () => {
        handleLeaveRoom();
        setState({...state, createdRoomTopic: null}); // clear created room.
    };

    return (
    <>
        <CodeEditor/>
    </>
    )
}

export default Room;
