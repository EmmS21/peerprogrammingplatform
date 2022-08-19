import React, { useEffect, useContext, useState } from 'react';
import NewRoom from './NewRoom';
import { Link, useHistory } from 'react-router-dom';
import { useGlobalState } from '../../context/RoomContextProvider';
import { useFetchRooms } from '../../hooks/useFetchRooms';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
//import OnlineUsersCarousel from './OnlineUsersCarousel';
import "../../assets/waitingRoom/app.css";
import PushNotifications from '../profile_components/PushNotifications'
import { Button, Modal, notification } from 'antd';


const WaitingRoom = () =>  {
    const [state, setState] = useGlobalState();
    const history = useHistory();
    const { user,
            logOutUser,
            updateProfile,
            pairUsers,
            allOnlineUsers,
            availableOnlineUsers,
            config } = useContext(AuthContext)
    const [usersInState, setUsersInState] = useState('')

    const openNotification = () => {
        const args = {
            message: 'You have not been matched yet',
            description: 'Please wait a little longer while we find you a match',
            duration: 4,
        };
        notification.open(args);
    };

//    console.log(`what do we have in state twilioToken: ${state.twilioToken}`)
//    console.log(`debug logs: ${Twilio.Voice.setLogLevel(.debug)}`)


    const contentStyle = {
        height: '80px',
        color: '#fff',
        lineHeight: '80px',
        textAlign: 'center',
        background: '#364d79',
    };

    useEffect((() => {
        const username = user.username
        console.log('username is', username)
        let matchedUser = availableOnlineUsers.current.filter(user =>
                                                                user !== username && user !== 'null'
                                                                && user !== 'undefined'
                                                                ).pop()
//        availableOnlineUsers.current = availableOnlineUsers.current.filter(user =>
//                                                                            user !== username
//                                                                            && user !== matchedUser
//        )
//        console.log('available users is now:', availableOnlineUsers.current)
//        console.log('matchedUser is', matchedUser)
        handleRoomCreate(username, matchedUser)
    }), [availableOnlineUsers.current])

    function createTwilioConference(){
        console.log('create twilio conference function triggered')
        let result = null;
        axios.post('http://127.0.0.1:8000/voice_chat/rooms')
            .then(res =>{
                console.log('response is', res.data)
            })
    }

    //new createRoomHandler without having to pass in data
    function createRoomHandler(username, matchedUser){
        console.log('createRoomHandler triggered')
        const pairedUsers ={}
        pairedUsers['roomName'] = username+matchedUser
        pairedUsers['participantLabel'] = username+matchedUser
        pairedUsers['currUser'] = username
        pairedUsers['matchedUser'] = matchedUser
        console.log('what are we sending', pairedUsers)
        console.log('username inside roomhandler', pairedUsers)
        axios.post('http://127.0.0.1:8000/voice_chat/rooms',pairedUsers)
            .then(res =>{
                console.log('axios hit', res.data)
            })
    }

    function deleteMatchedUsersRedis(username, matchedUser){
        console.log('deleteMatched triggered')
        const deletingUsers = {}
        deletingUsers['username'] = username
        deletingUsers['matched'] = matchedUser
        axios.delete('http://127.0.0.1:8000/cache/delete', deletingUsers)
            .then(res=> {
                console.log('axios delete response', res)
            })
    }



    const generateRandomTopicNum = () => {
        return Math.random().toString(36).slice(2, 7)
    }

    const handleRoomCreate = (username, matchedUser) => {
        console.log('handleRoomCreate is running')
        //get all users from redis cache
        //create room topics for each pair to store in state
        const createdRoomTopic = username+matchedUser
        console.log('createdRoomTopic is', createdRoomTopic)
        setState({ ...state, createdRoomTopic })
        console.log('room topic inside state', state.createdRoomTopic)
        const selectedRoom = {
            room_name: createdRoomTopic, participants: []
        };
        selectedRoom.participants.push(username)
        selectedRoom.participants.push(matchedUser)
        console.log('selectedroom participants', selectedRoom.participants)
        const rooms = state.rooms; //do we need this, rooms is empty after all
        const roomId = rooms.push(selectedRoom);
        console.log(`room id is, roomId: ${JSON.stringify(roomId)}`)
        setState({...state, rooms, selectedRoom, roomId});
        createRoomHandler(username, matchedUser)
        deleteMatchedUsersRedis(username, matchedUser)
        //delete user from redis cache
//        'http://127.0.0.1:8000/cache/

//        availableOnlineUsers.current =  availableOnlineUsers.current.filter(x => x !== username);
//        console.log('after availOnlineUsers is filtered', availableOnlineUsers.current)
//        if(matchedUser !== null){
//            availableOnlineUsers.current =  availableOnlineUsers.current.filter(x => x !== username);
//            console.log('after availOnlineUsers is filtered', availableOnlineUsers.current)
////            history.push(`/rooms/${roomId}`);
//
//        }
//        else {
//            openNotification();
//        }
//        window.location.replace(`/rooms/${roomId}`);
    }

//    };


    return (
    <>
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
            </div>
    </>
    );
};

export default React.memo(WaitingRoom);
