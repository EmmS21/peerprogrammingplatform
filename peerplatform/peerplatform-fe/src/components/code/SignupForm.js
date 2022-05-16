import React  from 'react';
import { useHistory } from 'react-router-dom';
import { Device } from '@twilio/voice-sdk';
import { useGlobalState } from '../../context/RoomContextProvider';

const SignupForm = () => {
    const history = useHistory();
    const [state, setState] = useGlobalState();
    //handle submission
    const handleSubmit = e => {
        e.preventDefault();
        const nickname = state.nickname;
        setupTwilio(nickname);
        history.push('/rooms');
    }
    const setupTwilio = (nickname) => {
        console.log('inside setupTwilio function', nickname)
        fetch(`http://127.0.0.1:8000/voice_chat/token/${nickname}`)
        .then(response => response.json())
        .then(data => {
            // setup device
            console.log(`data inside setupTwilio`, data)
            const twilioToken = data.token;
            console.log('debugging',twilioToken, typeof twilioToken)
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
                return {...state, device, twilioToken}
            });
            console.log(`device: ${device}, twilioToken: ${twilioToken}, state: ${state}`)
        })
        .catch((error) => {
            console.log(error)
        })
    };

    const updateNickname = (nickname) => {
        setState({...state, nickname});
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter nickname"
                onChange={ e => updateNickname(e.target.value)}
            />
             <input type="submit" value="Submit" />
        </form>
    );
};

export default SignupForm;
