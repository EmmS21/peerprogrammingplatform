import React, { createContext,useState, useEffect } from 'react';
import axios from 'axios';
//decoding token with this function
import jwt_decode from 'jwt-decode';
//we are importing history to have the ability to redirect user to home page
import { useHistory } from 'react-router-dom';
import axiosWithAuth from "../axios"
import { Device } from '@twilio/voice-sdk';
import { useGlobalState } from '../context/RoomContextProvider';



const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {
    //ensure user remains logged in even if browser is refreshed, we are going to start off by getting access token from local storage
    //start off by checking if we have tokens in localStorage, if we have token parse it    //set some states for user and authentication tokens
    //we have an anonymous function so that we get keys from localStorage once on initial load to make it less expensive on the browser
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    //now  we want the information contained in tokens -> jwt.io
    let [user,setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)
    let [challengeInState, setChallengeInState] = useState([])
    //creating new drop in audio chat
    const [state, setState] = useState(useGlobalState());

    const history = useHistory();

    //we are going to pass this information down to login page
    //async function because we must wait for something to happen first
    const loginUser = async (tokens) => {
        try {
            let response = await axios.post('http://127.0.0.1:8000/api/token/',tokens)
            //we are going to set our tokens in state so we can easily access it
            setAuthTokens(authTokens => ({
                ...response.data
            }))
            //we are decoding access information and storing that in our user state
            const decoded = jwt_decode(response.data.access)
            setUser(user => ({
                ...decoded
            }))
            //store tokens in localStorage
            //we stringify because we can only store strings in localStorage
            localStorage.setItem('authTokens',JSON.stringify(response.data))
            history.push('/')
        }
        catch(err) {
            alert(err.response.data.detail);
        }
    }

    //get profile information
    const getProfileInfo = (userId) => {
        axios.get(`http://127.0.0.1:8000/users/${userId}`)
                .then(res => {
                    setUser({ ...user,
                            first_name: res.data.first_name,
                            last_name: res.data.last_name,
                            username: res.data.username,
                            city: res.data.city,
                            country: res.data.country })
                })
                console.log(`what is inside user ${user.first_name}`)
    }

    //update profile information
    const updateProfile = (userData) => {
        axios.put(`http://127.0.0.1:8000/update_profile/${userData.user_id}/`, userData)
            .then(res => {
                setUser({ ...user, first_name:res.data.first_name,
                        last_name: res.data_last_name,
                        username: res.data.username,
                        city: res.data.city,
                        country: res.data.country })
            })
    }
    //retrieve profile information
    const retrieveProfileInformation = () => {
        axios.get('http://127.0.0.1:8000/api/')
    }
    //retrieve programming challenge
    //select random element
    Array.prototype.random = function() {
        return this[Math.floor(Math.random()*this.length)]
    }
    //from profile page to rooms
    const navToRooms = () => {
        const roomName = user.username
        console.log('roomname', roomName)
        setupTwilio(roomName);
        console.log('twilio token is', state.twilioToken)
        history.push('/rooms');
    }
    //retrieve random programming challenge
    const retrieveChallenge = () => {
        const roomName = user.username
        setupTwilio(roomName);
        axios.get('http://127.0.0.1:8000/api/programming_challenges/')
            .then(res => {
                setChallengeInState(res.data.random())
            })
            .catch(err => {
                console.log(err)
            })
    }
//            {
//                headers: {
//                    'Authorization': "jwt" + JSON.parse(window.localStorage.getItem('authTokens')).access,
//                    'Accept' : 'application/json',
//                    'Content-Type': 'application/json'
//                },
//                body: userData
//                })
    //handle submission
//    const handleSubmit = () => {
//        setupTwilio(nickname);
//        history.push('/rooms');
//    }
    const setupTwilio = (roomName) => {
        fetch(`http://127.0.0.1:8000/voice_chat/token/${roomName}`)
        .then(response => response.json())
        .then(data => {
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
                return {...state, device, twilioToken}
            });
            console.log('we are inside setup Twilio')
            console.log('responses: device', device)
        })
        .catch((error) => {
            console.log(error)
        })
    };

    let logOutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        history.push('/')
    }

    //method to update token - token is refreshed every 5 minutes
    let updateToken = async ()=> {
        const refreshToken = {
            'refresh': authTokens.refresh
        }
        console.log('Update token function has been triggered')
        try {
            let response = await axios.post('http://127.0.0.1:8000/api/token/refresh/',refreshToken)
            //update state with token
            setAuthTokens({'access': response.data.access,
                            'refresh': refreshToken.refresh})
            //update user state
            const decoded = jwt_decode(response.data.access)
            setUser(user => ({
                ...decoded
            }))
            console.log('user token', refreshToken.refresh)
            //store tokens in localStorage
            //we stringify because we can only store strings in localStorage
            localStorage.setItem('authTokens',JSON.stringify(authTokens))
            }
        catch(err) {
            //if fail, something is wrong with refresh token
            logOutUser()
        }
    }

    //going to be passed down to AuthContext
    let contextData = {
        user:user,
        loginUser:loginUser,
        logOutUser:logOutUser,
        updateToken: updateToken,
        updateProfile: updateProfile,
        getProfileInfo: getProfileInfo,
        retrieveChallenge: retrieveChallenge,
        challengeInState: challengeInState,
        navToRooms: navToRooms
    }

    //so we refresh our refresh token and update state every 4 minutes
    useEffect(()=> {
        let fourMinutes = 1000 * 60 * 4
        //set an interval
        let interval = setInterval(()=> {
            if(authTokens){
                updateToken()
            }
        }, fourMinutes)
        //we need to clear interval to ensure we only have one cycle running
        return ()=> clearInterval(interval)
    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    )
}