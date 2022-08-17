import React, { useState } from 'react';
import { useGlobalState } from '../../context/RoomContextProvider';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import "../../assets/scss/modal.scss"

const NewRoom = () => {
    const [state, setState] = useGlobalState();
    const history = useHistory();
    console.log(`inside NewRoom, roomID: ${state.roomId}, room topic: ${state.createdRoomTopic} selectedRoom: ${state.selectedRoom}`)
//    const updateRoomName = (createdRoomTopic) => {
//        setState({...state, createdRoomTopic});
//    };

    const createRoomHandler = () => {
        const userData = {'roomName': state.nickname, 'participantLabel': state.createdRoomTopic}
        console.log('Inside create room handler', userData.roomName, userData.participantLabel)
        axios.post('http://127.0.0.1:8000/voice_chat/rooms', userData )
            .then(res => {
                console.log('axios call has been hit', res.data)
            })
    }


    const handleRoomCreate = () => {
        console.log('handle Room Created has been triggered')
        console.log(`checking global state, twilioToken: ${state.twilioToken}`)
//        const createdRoomTopic = generateRandomTopicNum()
//        console.log(`we have generated a room topic, createdRoomTopic is: ${state,createdRoomTopic}`)
//        setState((state) => {
//            return {...state, createdRoomTopic}
//        });
//        setState({ ...state, createdRoomTopic })
//        console.log(`What do we have in state createdRoomTopic: ${state.createdRoomTopic}`)
        const selectedRoom = {
            room_name: state.createdRoomTopic, participants: []
        };
        const rooms = state.rooms; //do we need this, rooms is empty after all
//        console.log(`sanity check, rooms: ${rooms}`)
        const roomId = rooms.push(selectedRoom);
//        console.log(`room id is: ${roomId}`)
//        setState({...state, rooms });
//        setState({...state, selectedRoom});
//        console.log(`in state selectedRoom is: ${state.selectedRoom} and createdRoomTopic is: ${state.createdRoomTopic}`)
//        createRoomHandler()
        history.push(`/rooms/${roomId}`);
    };

    return (
    <>
        <div className="md-content">
            <p>The session will be split into 5 phases:</p>
                <ul>
                    <li><strong>Introductions:</strong> You will be given 5 minutes for introductions. Get to know who you are coding with.</li>
                    <li><strong>Pseudo-Code</strong> You will receive your problem statement and be given 10 minutes to pseudo code potential solutions. If your solution is a recipe, what steps will you need to make your meal. Use basic english, do not worry about coding concepts yet.</li>
                    <li><strong>Time to Code</strong> You will be given 40 minutes to collaboratively find a solution to the problem or get as close to a solution as possible.</li>
                    <li><strong>Solution</strong> Could not solve the problem? Don't fret, you will be given a solution and 20 minutes to break down the solution and try and rebuild it yourselves.</li>
                    <li><strong>Rating</strong> To close things off you will rate each other on; i.) ability to effectively communicate logic, ii.) ability to collaborate/how well did you work together and iii.) general coding skills. Leave your peer some notes on what to work on.</li>
                </ul>
                </div>
        <div>
            <center>
                <button onClick={handleRoomCreate}>Start Session</button>
            </center>
        </div>
    </>
    );
};

export default NewRoom;
