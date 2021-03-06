import React, { useContext, useState }  from 'react';
import { useHistory } from 'react-router-dom';
import { Device } from '@twilio/voice-sdk';
import { useGlobalState } from '../../context/RoomContextProvider';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';

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

    //generate room topic name
    const generateRandomTopicNum = () => {
        return Math.random().toString(36).slice(2, 7)
    }

    //filter online and active users
    const checkOnlineUsers = () => {
        console.log('online users', onlineUsers)
    }

    //pick random number to select random user who is online
    const pickRandom = () => {
        return Math.abs(Math.round(Math.random() * checkOnlineUsers().length - 1))
    }

    const updateWaitingRoomStatus = () => {
        axios.patch(`http://127.0.0.1:8000/update_profile/${user.user_id}/`, {
            in_waiting_room: true
        })
        .then(res => {
            console.log('user is in waiting room', res.data)
        })
    }

    //randomly pair all available users
    function getPicks(names) {
        const arrOfUsers =  names
        const newDict = {}
        while(arrOfUsers.length){
            let randomInd = Math.floor(Math.random() * arrOfUsers.length);
            let randomItem = arrOfUsers.splice(randomInd, 1)[0];
            let randomValInd = Math.floor(Math.random() * arrOfUsers.length);
            let randomVal = arrOfUsers.splice(randomValInd, 1)[0];
            newDict[randomItem] = randomVal
        }
        return newDict
    }

    const sendWaitingRoomUsersToRedisCache = () => {
        axios.get('http://127.0.0.1:8000/users/')
            .then(res => {
                    const filteredUsers = res.data.filter(filtered => filtered.profile.in_waiting_room === true)
                    const allUserNames  = filteredUsers.map(arr => arr.username)
                    //specifying key we will be using to retrieve these users in Redis with pre-defined pattern to clearly identify key in server
                    console.log('allusernames push is', allUserNames)
                    //write users to Redis set
                    axios.post('http://127.0.0.1:8000/cache/', allUserNames)
                        .then(res => {
                            console.log('into redis', res.data)
                        })
                        //get all users who aren't the current user
                        axios(config)
                        .then(res => {
                            const availUsers = res.data.elements.filter(name => name !== user.username)
                            availableOnlineUsers.current = availUsers
                            console.log('inside StartCodingComponent', availableOnlineUsers.current)
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
        history.push('/rooms');
    }

    const setupTwilio = (nickname) => {
        fetch(`http://127.0.0.1:8000/voice_chat/token/${nickname}`)
        .then(response => console.log('setupTwilio returns: ',response.json()))
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


