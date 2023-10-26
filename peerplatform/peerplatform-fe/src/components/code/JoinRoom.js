import React, { useContext, useState } from 'react';
import { Input, Button } from 'antd';
import { useGlobalState } from '../../context/RoomContextProvider';
import AuthContext from '../../context/AuthContext';
import { useParams, useLocation } from "react-router-dom";
import { Device } from '@twilio/voice-sdk';
import { useHistory } from 'react-router-dom';



const JoinRoom = () => {
    let {  username, setUserName, profileURL } = useContext(AuthContext)
    const [currentUser, setCurrentUser] = useState('');
    const [roomState, setRoomState] = useGlobalState()
    const { roomName } = useParams()
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const firstUser = query.get("username")
    const history = useHistory();
 

    const handleInputChange = (event) => {
        setCurrentUser(event.target.value);
    };
    // fetch(`${profileURL}voice_chat/token/${nickname}`)

    const handleFormSubmit = () => {
        if (currentUser) { 
            setUserName(currentUser);
            console.log('currUser', currentUser)
            fetch(`${profileURL}voice_chat/token/${currentUser}`)
                .then(response => response.json())
                .then(data => {
                    const twilioToken = JSON.parse(data).token
                    const device = new Device(twilioToken)
                    device.updateOptions(twilioToken, {
                        codecPreferences: ['opus', 'pcmu'],
                        fakeLocalDTMF: true,
                        maxAverageBitrate: 16000,
                        maxCallSignalingTimeoutMs: 30000
                    });
                    device.on('error', (device) => {
                        console.log('error', device)
                    })
                    setRoomState(roomName)
                    console.log('roomName', roomName)
                    setRoomState({ ...roomState, device, twilioToken, username})
                    history.push(`/rooms/${roomName}`)

                })
                .catch((error) => {
                    console.log(error)
                })
        }
    };

    return (
        <div style={{
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'          
        }}>
            <h1 style={{ color: 'black' }}>You have been invited by {firstUser} to join a pair programming session</h1>
            <Input 
                placeholder="Enter your username" 
                style={{ width: '50%' }} 
                onChange={handleInputChange} 
                value={currentUser}
            />
            <Button 
                onClick={handleFormSubmit}
                disabled={!currentUser} 
            >
                Submit
            </Button>
        </div>
    );
}

export default JoinRoom;
