import React, { useContext, useState }  from 'react';
import { useHistory } from 'react-router-dom';
import { Device } from '@twilio/voice-sdk';
import { useGlobalState } from '../../context/RoomContextProvider';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';
import SyncLoader from "react-spinners/ClipLoader";
import WebSocketInstance from '../../websocket/Connect';


const StartCodingComponent = () => {
    const history = useHistory();
    const [ state, setState ] = useGlobalState();
    const { user, logOutUser,
            updateProfile, getUsers,
            onlineUsers, setPairUsers,
            pairUsers, allOnlineUsers,
            setAllOnlineUsers, config, 
            availableOnlineUsers, profileURL } = useContext(AuthContext)
    let [loading, setLoading] = useState(false);
    const [color, setColor] = useState("#3f37db");


    const updateWaitingRoomStatus = async () => {
        await axios.patch(`${profileURL}update_profile/${user.user_id}/`, {
            in_waiting_room: true
        })
        .then(res => {
           console.log('user updated waiting room status', res.data)
        })
    }

    const sendWaitingRoomUsersToRedisCache = () => {
        axios.patch(`${profileURL}update_profile/${user.user_id}/`, {
            in_waiting_room: true
        })
        .then(res => {
            // console.log('Updated user', res.data)
            axios.get(`${profileURL}users/`)
                .then(res => {
                        const filteredUsers = res.data.filter(filtered => filtered.profile.in_waiting_room === true)
                        const allUserNames  = filteredUsers.map(arr => arr.username)
                        //specifying key we will be using to retrieve these users in Redis with pre-defined pattern to clearly identify key in server
                        //write users to Redis set
                        axios.post(`${profileURL}cache/`, allUserNames)
                            .then(res => {
                            })
                            axios(config)
                            .then(res => {
                                availableOnlineUsers.current = res.data.elements
                                console.log('availusers in startcoding is now', availableOnlineUsers.current)
                            })
                })
            })
        }
    //handle submission
    const handleSubmit = e => {
        e.preventDefault();
        const nickname = user.username;
        setupTwilio(nickname);
        const rooms = state.rooms;
        setState((state) => {
            return {...state, rooms }
        });
        sendWaitingRoomUsersToRedisCache()
        if(availableOnlineUsers.current.length){
            console.log('redirected')
                history.push('/rooms');
        }
        else {
            setLoading(true);
            setTimeout(()=>{
                history.push('/rooms');
            },7000)
        }
    }

    const setupTwilio = (nickname) => {
        fetch(`${profileURL}voice_chat/token/${nickname}`)
        .then(response => response.json())
        .then(data => {
            // setup device
            // console.log('are we getting a response from twilio')
            const twilioToken = JSON.parse(data).token;
            // console.log('***what is twiliotoken', twilioToken)
            const device = new Device(twilioToken);
            // console.log('!!!!!!!!what is device', JSON.stringify(device))
            device.updateOptions(twilioToken, {
                codecPreferences: ['opus', 'pcmu'],
                fakeLocalDTMF: true,
                maxAverageBitrate: 16000,
                maxCallSignalingTimeoutMs: 30000
            });
            device.on('error', (device) => {
                console.log("error: ", device)
            });
            setState({...state, device, twilioToken, nickname})
            // console.log(` !!! device in state: ${state.device} !!!!`)
        })
        .catch((error) => {
            console.log(error)
        })
    };

    return (
        <div>
        {
            loading === true ?
                <SyncLoader loading={loading} color={color} size={30} />
                :
                <button className="button button-primary button-wide-mobile button-sm"
                    onClick={handleSubmit}> Join Waiting Room
                </button>
        }
        </div>
    );
};

export default StartCodingComponent;