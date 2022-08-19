import React, { useContext, useState }  from 'react';
import { useHistory } from 'react-router-dom';
import { Device } from '@twilio/voice-sdk';
import { useGlobalState } from '../../context/RoomContextProvider';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';
import WebSocketInstance from '../../websocket/Connect';

const StartCodingComponent = () => {
    const history = useHistory();
    const [ state, setState ] = useGlobalState();
    const { user,
            logOutUser,
            updateProfile,
            getUsers,
            onlineUsers,
            setPairUsers,
            pairUsers,
            allOnlineUsers,
            setAllOnlineUsers,
            config, availableOnlineUsers } = useContext(AuthContext)

    const updateWaitingRoomStatus = () => {
        axios.patch(`http://127.0.0.1:8000/update_profile/${user.user_id}/`, {
            in_waiting_room: true
        })
        .then(res => {
//            console.log('user is in waiting room', res.data)
        })
    }

    const sendWaitingRoomUsersToRedisCache = () => {
        axios.get('http://127.0.0.1:8000/users/')
            .then(res => {
                    const filteredUsers = res.data.filter(filtered => filtered.profile.in_waiting_room === true)
                    const allUserNames  = filteredUsers.map(arr => arr.username)
                    //specifying key we will be using to retrieve these users in Redis with pre-defined pattern to clearly identify key in server
                    //write users to Redis set
                    axios.post('http://127.0.0.1:8000/cache/', allUserNames)
                        .then(res => {
//                            console.log('into redis', res.data)
                        })
                        //get all users who aren't the current user
                        axios(config)
                        .then(res => {
                            console.log('online users', res.data.elements)
                            availableOnlineUsers.current = res.data.elements
                            console.log('availusers in startcoding is now', availableOnlineUsers.current)
                        })
            })
        }
    //handle submission
    const handleSubmit = e => {
        e.preventDefault();
        const nickname = user.username;
        setupTwilio(nickname);
        const rooms = state.rooms;
        updateWaitingRoomStatus()
        setState((state) => {
            return {...state, rooms }
        });
        sendWaitingRoomUsersToRedisCache()
        WebSocketInstance.connect()
        let availUsers = null ;
//        sending data through websocket
        WebSocketInstance.sendData()
        history.push('/rooms');
    }

    const setupTwilio = (nickname) => {
        fetch(`http://127.0.0.1:8000/voice_chat/token/${nickname}`)
        .then(response => response.json())
        .then(data => {
            // setup device
            const twilioToken = JSON.parse(data).token;
            const device = new Device(twilioToken);
            device.updateOptions(twilioToken, {
                codecPreferences: ['opus', 'pcmu'],
                fakeLocalDTMF: true,
                maxAverageBitrate: 16000,
                maxCallSignalingTimeoutMs: 30000
            });
            device.on('error', (device) => {
                console.log("error: ", device)
            });
            setState({... state, device, twilioToken, nickname})
//            console.log(`setupTwilio has been hit, device: ${device}, twilioToken: ${twilioToken}`)
        })
        .catch((error) => {
            console.log(error)
        })
    };

    return (
            <button className="button button-primary button-wide-mobile button-sm"
                onClick={handleSubmit}> Join Waiting Room
            </button>
    );
};

export default StartCodingComponent;