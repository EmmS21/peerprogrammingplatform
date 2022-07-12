import React, { useContext, useState }  from 'react';
import { useHistory } from 'react-router-dom';
import { Device } from '@twilio/voice-sdk';
import { useGlobalState } from '../../context/RoomContextProvider';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';

//            logOutUser,
//            updateProfile,
//            onlineUsers,
//            pairProgrammingMatching,
//            setPairUsers,
//            pairUsers } = useContext(AuthContext)


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
            config } = useContext(AuthContext)
//    const [ allOnlineUsers, setAllOnlineUsers ] = useState([])

    //generate room topic name
    const generateRandomTopicNum = () => {
        return Math.random().toString(36).slice(2, 7)
    }

//    const pickRandom = () => {
//        const random =  Math.abs(Math.round(Math.random() * checkOnlineUsers().length - 1))
//        return checkOnlineUsers()[random].username;
//    }
    //filter online and active users
    const checkOnlineUsers = () => {
//        const results = onlineUsers.filter(obj => {
//            return obj.profile.is_online === true && obj.profile.currently_active === false && obj.username !== user.username
//        })
        console.log('online users', onlineUsers)
//        return results
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
//        console.log('sendWaiting')
//        axios(config)
//        .then(res =>{
//            console.log('data', res.data)
//            setAllOnlineUsers([ res?.data?.items])
//            console.log('inside state', allOnlineUsers)
//        })
//        //array of all users in redis
//        const newArr = Object.keys(allOnlineUsers).concat(Object.values(allOnlineUsers))
        axios.get('http://127.0.0.1:8000/users/')
            .then(res => {
                    const filteredUsers = res.data.filter(filtered => filtered.profile.in_waiting_room === true)
                    const allUserNames  = filteredUsers.map(arr => arr.username)
                    //write users to Redis set
                    axios.post('http://127.0.0.1:8000/cache/', allUserNames)
                        .then(res => {
                            console.log('into redis', res.data)
                        })
                        axios(config)
                        .then(res => {
                            const availUsers = res.data.elements.filter(name => name !== user.username)
                            console.log('availUsers', availUsers)
                            setAllOnlineUsers(result => [...result, availUsers]);
//                            setAllOnlineUsers([ ...availUsers])
//                            setAllOnlineUsers((data) => [ ...availUsers])
//                            setAllOnlineUsers([ ...availUsers])
                            console.log('inside state', allOnlineUsers)
                        })
            })
        }
    //handle submission
    const handleSubmit = e => {
        e.preventDefault();
        const nickname = user.username;
        const createdRoomTopic = generateRandomTopicNum()
        setupTwilio(nickname, createdRoomTopic);
        const selectedRoom = { room_name: state.createdRoomTopic, participants: [] };
        console.log(`selected Room ${selectedRoom}`)
        const rooms = state.rooms;
        updateWaitingRoomStatus()
        const roomId = rooms.push(selectedRoom);
        setState((state) => {
            return {...state, rooms,selectedRoom }
        });
        sendWaitingRoomUsersToRedisCache()
//        setPairUsers({ ...pairUsers,
//                        [nickname]: checkOnlineUsers(pickRandom())[0].username })
        history.push('/rooms');
    }

    const setupTwilio = (nickname, createdRoomTopic) => {
        fetch(`http://127.0.0.1:8000/voice_chat/token/${nickname}`)
        .then(response => response.json())
        .then(data => {
            // setup device
            const twilioToken = JSON.parse(data).token;
            const device = new Device(twilioToken);
            device.updateOptions(twilioToken, {
                codecPreferences: ['opus', 'pcmu'],
                fakeLocalDTMF: true,
                maxAverageBitrate: 16000
            });
            device.on('error', (device) => {
                console.log("error: ", device)
            });
            setState({... state, device, twilioToken, nickname, createdRoomTopic})
            console.log(`setupTwilio has been hit, device: ${device}, twilioToken: ${twilioToken}`)
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


