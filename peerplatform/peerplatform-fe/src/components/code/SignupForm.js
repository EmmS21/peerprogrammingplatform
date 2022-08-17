import React, { useContext, useState }  from 'react';
import { useHistory } from 'react-router-dom';
import { Device } from '@twilio/voice-sdk';
import { useGlobalState } from '../../context/RoomContextProvider';
import AuthContext from '../../context/AuthContext';


const SignupForm = () => {
    const history = useHistory();
    const [ state, setState ] = useGlobalState();
    const { user,logOutUser, updateProfile } = useContext(AuthContext)

    //generate room topic name
    const generateRandomTopicNum = () => {
        return Math.random().toString(36).slice(2, 7)
    }


    //handle submission
    const handleSubmit = e => {
        e.preventDefault();
        const nickname = user.username;
        const createdRoomTopic = generateRandomTopicNum()
        setupTwilio(nickname, createdRoomTopic);
        const selectedRoom = { room_name: state.createdRoomTopic, participants: [] };
        const rooms = state.rooms;
        const roomId = rooms.push(selectedRoom);
        setState((state) => {
            return {...state, rooms,selectedRoom }
        });
        history.push('/rooms');
    }

    const setupTwilio = (nickname, createdRoomTopic) => {
        fetch(`http://127.0.0.1:8000/voice_chat/token/${nickname}`)
        .then(response => response.json())
        .then(data => {
            // setup device
            const twilioToken = data.token;
            const device = new Device(twilioToken);
            device.updateOptions(twilioToken, {
                codecPreferences: ['opus', 'pcmu'],
                fakeLocalDTMF: true,
                maxAverageBitrate: 16000
            });
            device.on('error', (device) => {
                console.log("error: ", device)
            });
            setState((state) => {
                return {...state, device, twilioToken, nickname, createdRoomTopic}
            });
        })
        .catch((error) => {
            console.log(error)
        })
    };

    return (
            <button className="button button-primary button-wide-mobile button-sm"
                onClick={handleSubmit}> Start Coding
            </button>
    );
};

export default SignupForm;


