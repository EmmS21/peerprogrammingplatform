import React, { useContext, useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { useGlobalState } from '../../context/RoomContextProvider';
import AuthContext from '../../context/AuthContext';
import { useParams, useLocation } from "react-router-dom";
import { Device } from '@twilio/voice-sdk';
import { useHistory } from 'react-router-dom';



const JoinRoom = () => {
    let {  username, setUserName, profileURL, setRoomName } = useContext(AuthContext)
    const [currentUser, setCurrentUser] = useState('');
    const [roomState, setRoomState] = useGlobalState();
    const { roomName } = useParams();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const firstUser = query.get("username");
    const history = useHistory();
    const [rooms, setRooms] = useState([]);
 

    const handleInputChange = (event) => {
        setCurrentUser(event.target.value);
    };

    const joinRoom = async () => {
        try {
            const response = await fetch(`${profileURL}voice_chat/join_conference`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomName: roomName })  // assuming roomNameFromUrl is the variable holding the room name extracted from the URL
            });
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            console.log('resp', response)
            const data = await response.text();
            console.log('data', data);
            setRooms(data.room_name);  // assuming the server returns the room name in the response
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };
    
    const handleFormSubmit = async () => {
        if (currentUser) { 
            setUserName(currentUser);
            try {
                const response = await fetch(`${profileURL}voice_chat/token/${currentUser}`)
                const data = await response.json()
                const twilioToken = JSON.parse(data).token
                await joinRoom()
                const device = new Device(twilioToken)
                device.updateOptions(twilioToken, {
                    codecPreferences: ['opus', 'pcmu'],
                    fakeLocalDTMF: true,
                    maxAverageBitrate: 16000,
                    maxCallSignalingTimeoutMs: 30000
                });
                device.connect({ roomName: rooms })
                device.on('connect', (connection) => {
                    console.log('Successfully connected', connection)
                })
                device.on('error', (device) => {
                    console.log('error', device)
                    console.error('Error message:', device.message);
                    console.error('Error code:', device.code);
                
                })
                setRoomState({ ...roomState, device, twilioToken, username})
                history.push(`/rooms/${roomName}`)
            }
            catch (error) {
                console.log(error)
            }
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
