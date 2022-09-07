import React, { useEffect, useContext, useState } from 'react';
import NewRoom from './NewRoom';
import { Link, useHistory } from 'react-router-dom';
import { useGlobalState } from '../../context/RoomContextProvider';
import { useFetchRooms } from '../../hooks/useFetchRooms';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
//import OnlineUsersCarousel from './OnlineUsersCarousel';
import "../../assets/waitingRoom/app.css";
//import PushNotifications from '../profile_components/PushNotifications'
import { Button, Modal, notification } from 'antd';
import WebSocketInstance from '../../websocket/Connect';


const WaitingRoom = () =>  {
    const [state, setState] = useGlobalState();
    const history = useHistory();
    const { user,
            logOutUser,
            updateProfile,
            pairUsers,
            allOnlineUsers,
            availableOnlineUsers,
            config,
            authTokens } = useContext(AuthContext)
    const [usersInState, setUsersInState] = useState('')
    const [websocketVal, setWebSocketVal] = useState('')

    const openNotification = () => {
        const args = {
            message: 'You have not been matched yet',
            description: 'Please wait a little longer while we find you a match',
            duration: 4,
        };
        notification.open(args);
    };

    const contentStyle = {
        height: '80px',
        color: '#fff',
        lineHeight: '80px',
        textAlign: 'center',
        background: '#364d79',
    };

    useEffect((() => {
        console.log('how many times is useEffect running')
        //connecting websocket
        WebSocketInstance.connect(authTokens)
        const username = user.username
        let matchedUser = availableOnlineUsers.current.filter(user =>
                                                                user !== username && user !== 'null'
                                                                && user !== 'undefined'
                                                                ).pop()
        handleRoomCreate(username, matchedUser)
    }), [])

    //new createRoomHandler without having to pass in data
    function createRoomHandler(username, matchedUser, roomId){
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
        receiveWebSocketData(matchedUser, roomId, username).then( (res) =>
                                                                { redirectMatchedUser(res.split(' ')[0], res.split(' ')[1])
                                                                 setWebSocketVal(res)
                                                                 } )
        console.log('websocket in state is', websocketVal)
        //deleting users from cache
//        deleteMatchedUsersRedis(username, matchedUser)
    }
    function redirectMatchedUser(matchedID, roomID){
        const userid = user.user_id
        console.log(`inside redirect function userID in state for userB is ${userid}`)
        if(userid === matchedID){
            history.push(`/rooms/${roomID}`)
        }
    }

    async function receiveWebSocketData(matchedUser, roomId){
        console.log(`we are sending UserBs username: ${matchedUser} and roomID:${roomId}`)
        return await WebSocketInstance.sendData(matchedUser+' '+roomId)
//        const fulfilled = userID.then((res)=> { return res })
//        console.log('fulfilled is returning', fulfilled)
//        const fulfilledPromise = fulfilled.then((result)=> { return result } )
//        console.log('fulfilled promise is', fulfilledPromise)
//        return fulfilledPromise;
    };

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

    const handleRoomCreate = (username, matchedUser) => {
        console.log('handleRoomCreate is running')
        //get all users from redis cache
        //create room topics for each pair to store in state
        const createdRoomTopic = username+matchedUser
        console.log('createdRoomTopic is', createdRoomTopic)
//        setState({ ...state, createdRoomTopic })
//        console.log('room topic inside state', state.createdRoomTopic)
        const selectedRoom = {
            room_name: createdRoomTopic, participants: []
        };
        selectedRoom.participants.push(username)
        selectedRoom.participants.push(matchedUser)
        const rooms = state.rooms; //do we need this, rooms is empty after all
        const roomId = rooms.push(selectedRoom);
        console.log(`room id is, roomId: ${JSON.stringify(roomId)}`)

        setState({...state, rooms, selectedRoom, roomId});

        createRoomHandler(username, matchedUser, roomId)
//        console.log('after availOnlineUsers is filtered', availableOnlineUsers.current)
//        if(matchedUser !== null){
////            console.log('after availOnlineUsers is filtered', availableOnlineUsers.current)
////            history.push(`/rooms/${roomId}`);
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
