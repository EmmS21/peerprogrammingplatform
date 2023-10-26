import React, { useEffect, useContext, useState } from 'react';
import CodeEditor from './CodeEditor';
import { Device } from '@twilio/voice-sdk';
import { useGlobalState } from '../../context/RoomContextProvider';
import AuthContext from '../../context/AuthContext';

const Room = () => {
    const [roomState, setRoomState] = useGlobalState()
    let {  roomName, username } = useContext(AuthContext)
    const [call, setCall] = useState()
    const [callConnected, setCallConnected] = useState(false)
    let checkCall = false
    const { device } = roomState


    useEffect(() => {
        console.log('inside use Effect')
        if(username.length > 0){
            console.log('username', username, 'roomName', roomName)
            const params = {
                roomName, participantLabel: username
            }
            if(checkCall === false){
                if(!call) {
                    const callPromise = device.connect({ params })
                    callPromise.then((twilioCall) => {
                        console.log('****call', twilioCall)
                        setCall((prev) => twilioCall)
                        setCallConnected(true)
                    })
                }
            }
            checkCall = true
        }
    }, [roomName, call, device])
    return (
    <>
        <CodeEditor/>
    </>
    )
}

export default Room;
