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
    let [loading, setLoading] = useState(false);
    const [color, setColor] = useState("#3f37db");


    const updateWaitingRoomStatus = async () => {
        await axios.patch(`https://codesquad.onrender.com/update_profile/${user.user_id}/`, {
            in_waiting_room: true
        })
        .then(res => {
           console.log('user updated waiting room status', res.data)
        })
    }

    const sendWaitingRoomUsersToRedisCache = () => {
        axios.patch(`https://codesquad.onrender.com/update_profile/${user.user_id}/`, {
            in_waiting_room: true
        })
        .then(res => {
            console.log('Updated user', res.data)
            axios.get('https://codesquad.onrender.com/users/')
                .then(res => {
                        const filteredUsers = res.data.filter(filtered => filtered.profile.in_waiting_room === true)
                        const allUserNames  = filteredUsers.map(arr => arr.username)
                        //specifying key we will be using to retrieve these users in Redis with pre-defined pattern to clearly identify key in server
                        //write users to Redis set
                        axios.post('https://codesquad.onrender.com/cache/', allUserNames)
                            .then(res => {
                            })
                            axios(config)
                            .then(res => {
                                console.log('online users', res.data.elements)
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
        // updateWaitingRoomStatus()
        setState((state) => {
            return {...state, rooms }
        });
        sendWaitingRoomUsersToRedisCache()
        let availUsers = null ;
        if(availableOnlineUsers.current.length){
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
        fetch(`https://codesquad.onrender.com/voice_chat/token/${nickname}`)
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