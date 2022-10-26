import React, { useEffect, useContext, useState, useRef } from 'react';
import NewRoom from './NewRoom';
import { Link, useHistory } from 'react-router-dom';
import { useGlobalState } from '../../context/RoomContextProvider';
import { useFetchRooms } from '../../hooks/useFetchRooms';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import "../../assets/waitingRoom/app.css";
import { Button, Modal, notification } from 'antd';
import WebSocketInstance from '../../websocket/Connect';

let secondCounter = 0
const WaitingRoom = () =>  {
    const [state, setState] = useGlobalState();
    const history = useHistory();
    const { user, logOutUser,
            updateProfile, pairUsers,
            allOnlineUsers, availableOnlineUsers,
            config, authTokens,
            receiveWebSocketData
        } = useContext(AuthContext)
    const [websocketVal, setWebSocketVal] = useState('')
    const [matchedInState, setMatchedInState] = useState('')
    // const [timeoutModal, setTimeoutModal] = useState(false)

    useEffect(() => {
        createTwilioConference(user.username, matchedInState)
    },[])

    useEffect((() => {
        console.log('how many times is useEffect running')
        WebSocketInstance.connect()
        const username = user.username
        const matchedUser = availableOnlineUsers.current.filter(user =>
                                                                user !== username && user !== 'null'
                                                                && user !== 'undefined'
                                                                ).pop()
        setMatchedInState(matchedUser)
        setState({...state, username, matchedUser});        
        handleRoomCreate(username, matchedUser)
    }), [websocketVal])

    function sortUsersAlphabetically(str) {
        return [...str].sort((a, b) => a.localeCompare(b)).join("");
      }

    function createTwilioConference(username, matchedUser){
        const pairedUsers ={}
        pairedUsers['roomName'] = sortUsersAlphabetically([username,matchedUser])
        pairedUsers['participantLabel'] = sortUsersAlphabetically([username,matchedUser])
        pairedUsers['currUser'] = username
        pairedUsers['matchedUser'] = matchedUser
        axios.post('https://codesquad.onrender.com/voice_chat/rooms',pairedUsers)
            .then(res =>{
                console.log('twilio call created', res.data)
            })
    }

    function redirectMatchedUser(matchedID){
        if(matchedID) {
            console.log('incrementing secondCounter')
            secondCounter ++ }
        console.log(`****secondCounter ${secondCounter}****`)
        console.log('received', matchedID)
        const splitString = matchedID.text.split(' ')
        const roomId = splitString[8].slice(0, -2)
        setState({...state, roomId});
        setTimeout(() => {
            history.push(`/rooms/${roomId}`)
        }, "10000")
    }

    function deleteMatchedUsersRedis(username, matchedUser){
        console.log('deleteMatched triggered')
        const deletingUsers = {}
        deletingUsers['username'] = username
        deletingUsers['matched'] = matchedUser
        axios.delete('https://codesquad.onrender.com/cache/delete', deletingUsers)
            .then(res=> {
                console.log('axios delete response', res)
            })
    }

    const handleRoomCreate = (username, matchedUser) => {
        const createdRoomTopic = sortUsersAlphabetically([username,matchedUser])
        console.log('createdRoomTopic inside handleRoomCreate', createdRoomTopic)
        const selectedRoom = {
            room_name: createdRoomTopic, participants: []
        };
        selectedRoom.participants.push(username)
        selectedRoom.participants.push(matchedUser)
        const rooms = state.rooms; 
        const roomId = [username,matchedUser] 
        setState({...state, rooms, selectedRoom});
        receiveWebSocketData(matchedUser, roomId).then( (res) =>
                                                    { redirectMatchedUser(JSON.parse(res))
                                                      setWebSocketVal(res)
                                                    })
    }



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
