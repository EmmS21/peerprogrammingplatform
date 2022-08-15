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
//    console.log(`debug logs: ${Twilio.Voice.setLogLevel(.debug)}`)


    const contentStyle = {
        height: '80px',
        color: '#fff',
        lineHeight: '80px',
        textAlign: 'center',
        background: '#364d79',
    };
    //pick random user from state - user's match
    function pickRandom() {
        console.log('available users are', availableOnlineUsers.current)
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


//var newArr={};
//for(var i=0,len=arrayKeys.length;i<len;i+=2) {
//    newArr[arrayKeys[i]]=(arrayKeys[i+1]);
//}
//console.log(newArr)

    function randomizeAndMatch(allUsers) {
        let newArr = {}
        for(var i=0, len=allUsers.length; i<len; i+=2) {
            newArr[allUsers[i]] =  (allUsers[i+1])
        }
        return newArr
    }
    //pipe output of randomizeAndMatch - then have another function that finalizes the data
    //finalized in exact shape I want it

    useEffect((() => {
        console.log('randomized:', randomizeAndMatch(availableOnlineUsers.current))
        handleRoomCreate()
        const username = user.username
    }), [])

    function createTwilioConference(){
        console.log('create twilio conference function triggered')
        let result = null;
        axios.post('http://127.0.0.1:8000/voice_chat/rooms')
            .then(res =>{
                result = res
            })
        return result
    }

//    const createRoomHandler = (curr,matched) => {
//        const userData = {'roomName': curr+matched, 'participantLabel': [curr, matched] }
//        console.log(`userData roomName: ${userData.roomName}, participantLabel: ${userData.participantLabel}`)
//        axios.post('http://127.0.0.1:8000/voice_chat/rooms', userData )
//            .then(res => {
//                console.log('axios call has been hit', res.data)
//            })
//    }
    //new createRoomHandler without having to pass in data
    function createRoomHandler(){
        axios.post('http://127.0.0.1:8000/voice_chat/rooms')
            .then(res =>{
                console.log('axios hit', res.data)
            })
    }



    const generateRandomTopicNum = () => {
        return Math.random().toString(36).slice(2, 7)
    }

    const handleRoomCreate = () => {
        console.log('handleRoomCreate is running')
        //get all users from redis cache
        //create room topics for each pair to store in state
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
//        createRoomHandler(username, matchedUsers)
        createRoomHandler()
//        history.push(`/rooms/${roomId}`);
    }

//    };


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
            </div>
    </>
    );
};

export default React.memo(WaitingRoom);
