import React, { useEffect, useContext } from 'react';
import NewRoom from './NewRoom';
import { Link, useHistory } from 'react-router-dom';
import { useGlobalState } from '../../context/RoomContextProvider';
import { useFetchRooms } from '../../hooks/useFetchRooms';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';


const RoomList = () =>  {
    const [state, setState] = useGlobalState();
    const history = useHistory();
    const { user,logOutUser, updateProfile } = useContext(AuthContext)

//    console.log(`Inside RoomList state is ${state.twilioToken} nickname is: ${state.nickname} createdRoomTopic ${state.createdRoomTopic}`)

//    console.log(`token is currently : ${state.twilioToken}, username is: ${state.nickname}`)
//    const fetchRooms = useFetchRooms('/rooms');
//    //we update the application state with the list of rooms we receive
//    useEffect(() => {
//        fetchRooms().then(rooms => {
//            setState((state) => {
//                return {...state, rooms};
//            });
//        })
//    }, [fetchRooms, setState]);
//    console.log('we are inside RoomList')

    const createRoomHandler = () => {
        const userData = {'roomName': state.nickname, 'participantLabel': state.createdRoomTopic}
        console.log('Inside create room handler', userData.roomName, userData.participantLabel)
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
//        setState((state) => {
//            return {...state, createdRoomTopic}
//        });
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
        <div>
            <center><h6>How it works</h6></center>
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
        </div>
    </>
    );
};

export default React.memo(RoomList);




//                { state.rooms.length > 0?
//                    <ul>
//                        {state.rooms.map((selectedRoom, index) => (
//                        <li key={index + 1}>
//                            <Link to={`/rooms/${index + 1}`} onClick={() => {setState({...state, selectedRoom})}}>{selectedRoom.room_name}</Link>
//                        </li>
//                        ))}
//                    </ul>: <div>Create a new room to get started</div>}


//<div className="md-modal md-effect-12">
//                <div className="md-content">
//                    <h3>Ready to start pair programming? Here is how it works</h3>
//                    <div>
//                        <p>The session will be split into 5 phases:</p>
//                        <ul>
//                            <li><strong>Introductions:</strong> You will be given 5 minutes for introductions. Get to know who you are coding with.</li>
//                            <li><strong>Pseudo-Code</strong> You will receive your problem statement and be given 10 minutes to pseudo code potential solutions. If your solution is a recipe, what steps will you need to make your meal. Use basic english, do not worry about coding concepts yet.</li>
//                            <li><strong>Time to Code</strong> You will be given 40 minutes to collaboratively find a solution to the problem or get as close to a solution as possible.</li>
//                            <li><strong>Solution</strong> Could not solve the problem? Don't fret, you will be given a solution and 20 minutes to break down the solution and try and rebuild it yourselves.</li>
//                            <li><strong>Rating</strong> To close things off you will rate each other on; i.) ability to effectively communicate logic, ii.) ability to collaborate/how well did you work together and iii.) general coding skills. Leave your peer some notes on what to work on.</li>
//                        </ul>
//                        <button
//                            className="md-close"
//                            onClick={hide}
//                        >Close</button>
//                    </div>
//                </div>
//        </div>
//        <div className="md-overlay"></div>