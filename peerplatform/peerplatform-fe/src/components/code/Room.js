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
    const roomName = state.selectedRoom.room_name;
    const fetchRooms = useFetchRooms('/voice_chat/rooms');

    console.log(`twilio token in state: ${state.twilioToken} device:${state.device}`)

    useEffect(() => {
        const params = {
            roomName: roomName, participantLabel: nickname
        };
        console.log(`UseEffect inside rooms, params: ${params}`)
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
