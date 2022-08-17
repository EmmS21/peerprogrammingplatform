import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useGlobalState } from '../../context/RoomContextProvider';
import { useFetchRooms } from '../../hooks/useFetchRooms';
import CodeEditor from './CodeEditor';


const Room = ({room}) => {
    const history = useHistory();
    const [state, setState] = useGlobalState();
    const [call, setCall] = useState();
    //we already have device in state
    const {device, nickname} = state;
<<<<<<< HEAD
    const roomName = state.selectedRoom.room_name;
=======
    //roomName is currently in RoomsView
    const roomName = state.selectedRoom.roomName;
>>>>>>> parent of 96faf56 (joining rooms approach)
    const fetchRooms = useFetchRooms('/voice_chat/rooms');

    console.log(`twilio token in state: ${state.twilioToken} device:${state.device}`)

    useEffect(() => {
    //roomName not in state
        const params = {
            roomName: roomName, participantLabel: nickname
        };
<<<<<<< HEAD
=======
        console.log(`inside Room useEffect, roomName: ${roomName}, participantLabel:${nickname}`)
        console.log('participants are:', state.selectedRoom.participants)
>>>>>>> parent of 96faf56 (joining rooms approach)
        if (!call) {
            const callPromise = device.connect({ params });
            callPromise.then((call) => {
                setCall(call);
            });
        }
        if (!state.selectedRoom.participants.includes(nickname)) {
            state.selectedRoom.participants.push(nickname);
        }
    }, [device, roomName, nickname, room, call]);
    //call doesn't seem to be dropping
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
        <div>
            <div>
                {state.selectedRoom.participants.length === 1? <button onClick={handleEndRoom}>End room</button>: null}
            </div>
        </div>
    </>
    )
}

export default Room;
