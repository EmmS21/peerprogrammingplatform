import React from 'react';
import { useGlobalState } from '../../context/RoomContextProvider';
import { useHistory } from 'react-router-dom';


const NewRoom = () => {
    const [state, setState] = useGlobalState();
    const history = useHistory();
    const updateRoomName = (createdRoomTopic) => {
        setState({...state, createdRoomTopic});
    };

    const handleRoomCreate = () => {

        const selectedRoom = {
            room_name: state.createdRoomTopic, participants: []
        };
//        selectedRoom[participants].push(user.username)
        const rooms = state.rooms;
        const roomId = rooms.push(selectedRoom);
        setState({...state, rooms });
        setState({...state, selectedRoom});
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
