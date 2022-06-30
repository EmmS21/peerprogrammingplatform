import React, { useEffect, useContext } from 'react';
import NewRoom from './NewRoom';
import { Link, useHistory } from 'react-router-dom';
import { useGlobalState } from '../../context/RoomContextProvider';
import { useFetchRooms } from '../../hooks/useFetchRooms';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import OnlineUsersCarousel from './OnlineUsersCarousel';
import "../../assets/waitingRoom/app.css";

const WaitingRoom = () =>  {
    const [state, setState] = useGlobalState();
    const history = useHistory();
    const { user,
            logOutUser,
            updateProfile,
            pairUsers } = useContext(AuthContext)
    const username = user.username
//    console.log(`what do we have in state twilioToken: ${state.twilioToken}`)
//    console.log(getAllUsers())

    const contentStyle = {
        height: '80px',
        color: '#fff',
        lineHeight: '80px',
        textAlign: 'center',
        background: '#364d79',
    };

    useEffect((() => {
        console.log('inside pairUsers state', pairUsers)
    }), [])

    const createRoomHandler = () => {
        const userData = {'roomName': state.nickname, 'participantLabel': state.createdRoomTopic}
        axios.post('http://127.0.0.1:8000/voice_chat/rooms', userData )
            .then(res => {
                console.log('axios call has been hit', res.data)
            })
    }

    const generateRandomTopicNum = () => {
        return Math.random().toString(36).slice(2, 7)
    }


    const handleRoomCreate = () => {
        const createdRoomTopic = generateRandomTopicNum()
        setState({ ...state, createdRoomTopic })
        console.log(`What do we have in state createdRoomTopic: ${state.createdRoomTopic}`)
        const selectedRoom = {
            room_name: state.createdRoomTopic, participants: []
        };
        const rooms = state.rooms; //do we need this, rooms is empty after all
        console.log(`sanity check, rooms: ${rooms}`)
        const roomId = rooms.push(selectedRoom);
        console.log(`room id is: ${roomId}`)
        setState({...state, rooms, selectedRoom, roomId});
        console.log(`in state selectedRoom is: ${state.selectedRoom} and createdRoomTopic is: ${state.createdRoomTopic} roomId: ${roomId}`)
        createRoomHandler()
        history.push(`/rooms/${roomId}`);
    };

    return (
    <>
        <OnlineUsersCarousel/>
        <center><h6>How it works</h6></center>
                <p className='text'>The session will be split into 5 phases:</p>
                <ul>
                    <li><strong>Introductions:</strong> You will be given 5 minutes for introductions. Get to know who you are coding with.</li>
                    <li><strong>Pseudo-Code</strong> You will receive your problem statement and be given 10 minutes to pseudo code potential solutions. If your solution is a recipe, what steps will you need to make your meal. Use basic english, do not worry about coding concepts yet.</li>
                    <li><strong>Time to Code</strong> You will be given 40 minutes to collaboratively find a solution to the problem or get as close to a solution as possible.</li>
                    <li><strong>Solution</strong> Could not solve the problem? Don't fret, you will be given a solution and 20 minutes to break down the solution and try and rebuild it yourselves.</li>
                    <li><strong>Rating</strong> To close things off you will rate each other on; i.) logic, ii.) collaboration iii.) general coding skills and iv.) communication </li>
                </ul>
            <div>
                <center>
                    <button onClick={handleRoomCreate}>Start Session</button>
                </center>
            </div>
    </>
    );
};

export default React.memo(WaitingRoom);

