import React from 'react';
import { useGlobalState } from '../../context/RoomContextProvider';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const NewRoom = () => {
    const [state, setState] = useGlobalState();
    const history = useHistory();
    const updateRoomName = (createdRoomTopic) => {
        setState({...state, createdRoomTopic});
    };

    const createRoomHandler = () => {
        const userData = {'roomName': state.nickname, 'participantLabel': state.createdRoomTopic}
        console.log('Inside create room handler', userData.roomName, userData.participantLabel)
        axios.post('http://127.0.0.1:8000/voice_chat/rooms/', userData )
            .then(res => {
                console.log('axios call has been hit', res.data)
            })
    }

    const handleRoomCreate = () => {
        const selectedRoom = {
            room_name: state.createdRoomTopic, participants: []
        };
        const rooms = state.rooms;
        const roomId = rooms.push(selectedRoom);
        setState({...state, rooms });
        setState({...state, selectedRoom});
        createRoomHandler()
        history.push(`/rooms/${roomId}`);
    };

    return (
        <div>
            <input
                placeholder="Enter room topic..."
                onChange={ e => updateRoomName(e.target.value)}
            />
            <button onClick={handleRoomCreate}>
                Start room</button>
        </div>
    );
};

export default NewRoom;
