//import React, { useState, useEffect } from 'react';
//import { useHistory } from 'react-router-dom';
//import { useGlobalState } from '../../context/RoomContextProvider';
//import { useFetchRooms } from '../../hooks/useFetchRooms';
//
//
//const Room = ({room}) => {
//    const history = useHistory();
//    const [state, setState] = useGlobalState();
//    const [call, setCall] = useState();
//    const {device, nickname} = state;
//    const roomName = room.room_name;
//    const fetchRooms = useFetchRooms('/voice_chat/rooms');
//
//    useEffect(() => {
//        const params = {
//            roomName: roomName, participantLabel: nickname
//        };
//        if (!call) {
//            const callPromise = device.connect({ params });
//            callPromise.then((call) => {
//                setCall(call);
//            });
//        }
//        if (!room.participants.includes(nickname)) {
//            room.participants.push(nickname);
//        }
//    }, [device, roomName, nickname, room, call]);
//
//    const handleLeaveRoom = () => {
//        call.disconnect();
//        history.push('/rooms');
//    };
//    const handleEndRoom = () => {
//        handleLeaveRoom();
//        setState({...state, createdRoomTopic: null}); // clear created room.
//    };
//    const refreshRooms = () => {
//        fetchRooms()
//        .then(rooms => {
//            const selectedRoom = rooms.find((room) => {
//                return room.room_name === roomName
//            });
//            if (selectedRoom) {
//                setState({ ...state, selectedRoom });
//            }
//        });
//    }
//
//    return (
//        <div>
//            <h1>{room.room_name}</h1>
//            <p>Others in the room</p>
//            <ul>
//                {
//                    room.participants.map((participant, index) => (
//                        participant === nickname? <li key={index}><em>{participant}</em></li>: <li key={index}>{participant}</li>
//                    ))
//                }
//            </ul>
//            <div>
//                <button onClick={refreshRooms}>Refresh</button>
//                <button onClick={handleLeaveRoom}>Leave Quietly</button>
//                {room.participants.length === 1? <button onClick={handleEndRoom}>End room</button>: null}
//            </div>
//        </div>
//    )
//}
//
//export default Room;
