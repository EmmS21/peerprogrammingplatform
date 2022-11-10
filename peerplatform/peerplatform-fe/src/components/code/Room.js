import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useGlobalState } from '../../context/RoomContextProvider';
import { useFetchRooms } from '../../hooks/useFetchRooms';
import CodeEditor from './CodeEditor';
import AuthContext from '../../context/AuthContext';
import WebSocketInstance from '../../websocket/Connect';
import { Select } from 'semantic-ui-react';
import axios from 'axios';

let checkCall = false
const Room = ({room}) => {
    const history = useHistory();
    const [state, setState] = useGlobalState();
    const [call, setCall] = useState();
    const { device } = state;
    const { user, logOutUser, 
            matchedUserState, driverInState, 
            sortUsersAlphabetically,room_name, 
            participants, difficultySelected,
            setChallengeInState
         } = useContext(AuthContext)
    const roomName = room_name.current
    const difficultyLevels = [
        { key: 'e', value: 'easy', text: 'Easy' },
        { key: 'm', value: 'medium', text: 'Medium' },
        { key: 'h', value: 'hard', text: 'Hard' },
    ]
    const [showSelect, setShowSelect] = useState(true)

    console.log('what is device', device)
    console.log('do we have room name in state in Rooms', roomName)
    console.log('participantLabel', user.username)
    console.log('participants are:', participants)

    // useEffect(() => {
    //     WebSocketInstance.connect()
    //     selectDriver()
    // }, [])
    
    function selectDriver() {
        console.log('matched', matchedUserState.current)
        driverInState.current = sortUsersAlphabetically([user.username, matchedUserState.current])[0]
        console.log('driver in state', driverInState.current)
    }


    useEffect(() => {
        console.log('!!!*** how many times is twilio being called ***!!!')
        console.log('what is checkCall', checkCall)
        WebSocketInstance.connect()
        selectDriver()
        const params = {
            roomName: roomName, participantLabel: user.username
        };
        console.log('inside params', params.roomName, params.participantLabel)
        // if(checkCall === false){
        //     if (!call) {
        //         const callPromise = device.connect({ params });
        //         callPromise.then((call) => {
        //         console.log(' ***what is call', call)
        //         setCall(call);
        //         });
        //     }
        //     if (!participants.current.includes(user.username)) {
        //             participants.current.push(user.username);
        //     }
        //     checkCall = true
        // }
    }, []);
    // [device, state.selectedRoom.room_name, nickname, room, call]
    const handleLeaveRoom = () => {
        call.disconnect();
        history.push('/rooms');
    };
    const handleEndRoom = () => {
        handleLeaveRoom();
        setState({...state, createdRoomTopic: null}); // clear created room.
    };


    function handleOnChange(e, data){
        difficultySelected.current = data.value
        let selection = null
        setShowSelect(false)
        if(data.value === 'Easy'){
            selection = 'get_easy'
        }
        else if(data.value === 'Medium'){
            selection = 'get_medium'
        }
        else {
            selection = 'get_hard'
        }
        const base_url = `http://127.0.0.1:8000/programming_challenge/${selection}` 
        axios.get(base_url)
        .then(res=>{
            setChallengeInState(res.data)
        })
        .catch(err=> {
            console.log(err)
        })
    }

    return (
    <>  {
            driverInState.current === user.username ?
                showSelect === true ?
                    <Select 
                        placeholder='Select Level of Difficulty' 
                        options={difficultyLevels}
                        onChange={handleOnChange}
                        />
                    : null
                        : null
        }
        <CodeEditor />
    </>
    )
}

export default Room;
