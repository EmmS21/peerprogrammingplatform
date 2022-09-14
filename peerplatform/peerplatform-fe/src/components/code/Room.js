import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useGlobalState } from '../../context/RoomContextProvider';
import { useFetchRooms } from '../../hooks/useFetchRooms';
import CodeEditor from './CodeEditor';


const Room = ({room}) => {
    const history = useHistory();
    const [state, setState] = useGlobalState();
    const [call, setCall] = useState();
    const {device, nickname} = state;
    const roomName = state.selectedRoom.roomName;
//    const fetchRooms = useFetchRooms('http://127.0.0.1:8000/voice_chat/rooms');

    console.log(`twilio token in state: ${state.twilioToken} device:${state.device}`)

//    useEffect(() => {
//        const params = {
//            roomName: roomName, participantLabel: nickname
//        };
//        console.log('participants are:', state.selectedRoom.participants)
////        if (!call) {
////            const callPromise = device.connect({ params });
////            callPromise.then((call) => {
////                setCall(call);
////            });
////        }
////        if (!state.selectedRoom.participants.includes(nickname)) {
////            state.selectedRoom.participants.push(nickname);
////        }
//    }, [device, roomName, nickname, room, call]);
    //call doesn't seem to be dropping
    const handleLeaveRoom = () => {
        call.disconnect();
        history.push('/rooms');
    };
    const handleEndRoom = () => {
        handleLeaveRoom();
        setState({...state, createdRoomTopic: null}); // clear created room.
    };
//    const refreshRooms  = () => {
//        fetchRooms()
//            .then(rooms => {
//                const selectedRoom = rooms.find((room) => {
//                    return room.room_name = roomName
//                });
//                if(selectedRoom){
//                    setState({ ...state, selectedRoom});
//                }
//            });
//    }

    return (
    <>
        <h1></h1>
        <p>Others in the room</p>

        <CodeEditor/>
        <div>
        </div>
    </>
    )
}

export default Room;
