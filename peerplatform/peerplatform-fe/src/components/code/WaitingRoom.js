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
import { Button, Modal } from 'antd';


const WaitingRoom = () =>  {
    const [state, setState] = useGlobalState();
    const history = useHistory();
    const { user,
            logOutUser,
            updateProfile,
            pairUsers,
            allOnlineUsers,
            config, availableOnlineUsers } = useContext(AuthContext)
    const [usersInState, setUsersInState] = useState('')

//    console.log(`what do we have in state twilioToken: ${state.twilioToken}`)
//    console.log(getAllUsers())

    const contentStyle = {
        height: '80px',
        color: '#fff',
        lineHeight: '80px',
        textAlign: 'center',
        background: '#364d79',
    };
    //pick random user from state - user's match
    function pickRandom() {
        return availableOnlineUsers.current[Math.floor(Math.random()* allOnlineUsers.length)]
    }

    //pair up array of online users into
//    function createDict(data){
//        const newDict = {}
//        while(data.length !== 0){
//            const randomAnswer = data[Math.floor(Math.random()*data.length)]
//            data.splice(data.indexOf(randomAnswer), 1)
//            const secondAnswer = data[Math.floor(Math.random()*data.length)]
//            data.splice(data.indexOf(secondAnswer), 1)
//            data.length % 2 ? newDict[randomAnswer] = secondAnswer : newDict[randomAnswer] = 'unmatched'
//        }
//        return newDict
//    }

    useEffect((() => {
        const username = user.username
        console.log('inside useEffect', username)
        const matchedUsers = pickRandom()
        setUsersInState(matchedUsers)
        const currUsers = availableOnlineUsers.current
        console.log('matchedUser:', usersInState)
        //if user has been matched show notification
        if(matchedUsers){countDown(matchedUsers)}
//        console.log('who is online current', currUsers)
//        console.log('matchedUser is', matchedUsers)
//        console.log('paired users are:'. pairedUsers)
//        const updatedData = availableOnlineUsers.current
//        setUsersInState(createDict(updatedData))
//        console.log('what is in setUsersInState:', usersInState)
//        console.log('useEffect running, users:', createDict(allOnlineUsers))
    }), [availableOnlineUsers])

    //show user notification if they have been matched
    const countDown = (matchedUsers) => {
        let secondsToGo = 5;
        const modal = Modal.success({
            title: `You have been matched with ${matchedUsers}. Please do not refresh this page`,
            content: `Please click start once this modal closes. ${secondsToGo} seconds.`,
        });
        const timer = setInterval(() => {
            secondsToGo -= 1;
            modal.update({
                content: `Please click start once this modal closes. ${secondsToGo} seconds.`,
            });
        }, 1000);
        setTimeout(() => {
            clearInterval(timer);
            modal.destroy();
            }, secondsToGo * 1000);
    };

    const createRoomHandler = (username) => {
        const userData = {'roomName': username+usersInState, 'participantLabel': [username, usersInState] }
        axios.post('http://127.0.0.1:8000/voice_chat/rooms', userData )
            .then(res => {
                console.log('axios call has been hit', res.data)
            })
//        axios.post('http://127.0.0.1:8000/cache/', allUserNames)
//            .then(res => {
//                 console.log('into redis', res.data)
//            })
    }

    const generateRandomTopicNum = () => {
        return Math.random().toString(36).slice(2, 7)
    }

    function createRoomsWith() {
        console.log('what is username', user.username)
        const createdRoomTopic = user.username+usersInState
        setState({  ...state, createdRoomTopic })
        const selectedRoom = {
            room_name: state.createdRoomTopic, participants: [user.username, usersInState]
        };
        console.log(`what is in the selectedRoom variable roomName: ${selectedRoom.room_name} participants: ${selectedRoom.participants}`)
        const rooms = state.rooms
        const roomId = rooms.push(selectedRoom)
        setState({ ...state, rooms, selectedRoom, roomId });
        if(usersInState) {
            createRoomHandler(user.username)
        }
        else {
            console.log('No match found yet')
        }
    }


    const handleRoomCreate = () => {
        const createdRoomTopic = generateRandomTopicNum()
        setState({ ...state, createdRoomTopic })
        const selectedRoom = {
            room_name: state.createdRoomTopic, participants: []
        };
        const rooms = state.rooms; //do we need this, rooms is empty after all
        console.log(`Rooms currently has, rooms: ${JSON.stringify(rooms)}`)
        const roomId = rooms.push(selectedRoom);
        console.log(`room id is, roomId: ${JSON.stringify(roomId)}`)
        setState({...state, rooms, selectedRoom, roomId});
//        console.log(`in state selectedRoom is: ${state.selectedRoom} and createdRoomTopic is: ${state.createdRoomTopic} roomId: ${roomId}`)
//        createRoomHandler(username, matchedUsers)
        history.push(`/rooms/${roomId}`);
    };

    function redirectUsers(users){
        for (const prop in users) {
            console.log(`${prop}: ${users[prop]}`);
        }
    }


    return (
    <>
        <PushNotifications/>
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
                    <button onClick={createRoomsWith}>Start Session</button>
                </center>
            </div>
    </>
    );
};

export default React.memo(WaitingRoom);

