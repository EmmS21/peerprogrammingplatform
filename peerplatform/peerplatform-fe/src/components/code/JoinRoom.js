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

    useEffect(() => {
        const pathName = window.location.pathname
        const parts = pathName.split('/')
        const roomName = parts[parts.length - 2];
        setRooms(roomName)
    }, [])
 

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
                // Fetch existing rooms using Twilio API
                const response = await fetch(`${profileURL}voice_chat/rooms`);
                const roomsData = await response.json();
                console.log('roomsData', roomsData)
                console.log('cuurRoom',rooms.room_name)
                
                // Identify the target room using the room name from the URL
                const targetRoom = roomsData.rooms.find(room => room.room_name === rooms);
                
                if (targetRoom) {
                    const twilioTokenResponse = await fetch(`${profileURL}voice_chat/token/${currentUser}`);
                    const tokenData = await twilioTokenResponse.json();
                    const twilioToken = JSON.parse(tokenData).token;
    
                    // Connect to the identified room
                    const device = new Device(twilioToken);
                    device.updateOptions(twilioToken, {
                        codecPreferences: ['opus', 'pcmu'],
                        fakeLocalDTMF: true,
                        maxAverageBitrate: 16000,
                        maxCallSignalingTimeoutMs: 30000
                    });
                    device.connect({ roomName: targetRoom.room_name });
    
                    device.on('connect', (connection) => {
                        console.log('Successfully connected', connection);
                    });
    
                    device.on('error', (device) => {
                        console.log('error', device);
                        console.error('Error message:', device.message);
                        console.error('Error code:', device.code);
                    });
    
                    setRoomState({ ...roomState, device, twilioToken, username });
                    history.push(`/rooms/${targetRoom.room_name}`);
                } else {
                    console.log('No matching room found');
                }
            } catch (error) {
                console.log(error);
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
