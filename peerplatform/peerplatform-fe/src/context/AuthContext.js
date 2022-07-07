import React, { createContext,useState, useEffect } from 'react';
import axios from 'axios';
//decoding token with this function
import jwt_decode from 'jwt-decode';
//we are importing history to have the ability to redirect user to home page
import { useHistory } from 'react-router-dom';
import axiosWithAuth from "../axios"
import { Device } from '@twilio/voice-sdk';
import { useGlobalState } from '../context/RoomContextProvider';
import { onMessageListener } from '../firebase';


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
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [spinnerOn, setSpinnerOn] = useState(false)
    const [resp, setResp] = useState("")
    const [valueOne, setValueOne] = useState(0)
    const [valueTwo, setValueTwo] = useState(0)
    const [valueThree, setValueThree] = useState(0)
    const [errorText, setErrorText] = useState('');
    const [visible, setVisible] = useState(false);
    const [successSignup, setSuccessSignup] = useState(false)
    const baseURL = "https://judge0-ce.p.rapidapi.com/submissions"
    //show toast
    const [show, setShow] = useState(false);
    const [notification, setNotification] = useState({title: '', body: ''});
    const [isTokenFound, setTokenFound] = useState(false);
    //store current and matched users in state
    const  [pairUsers, setPairUsers] = useState([])

    const history = useHistory();

    const codeWarsIds = ['523a86aa4230ebb5420001e1','541c8630095125aba6000c00','5266876b8f4bf2da9b000362',
    '526dbd6c8c0eb53254000110','514a024011ea4fb54200004b','5270d0d18625160ada0000e4','520b9d2ad5c005041100000f',
    '52742f58faf5485cae000b9a','546f922b54af40e1e90001da','546f922b54af40e1e90001da',
    '523f5d21c841566fde000009','52597aa56021e91c93000cb0','57cebe1dc6fdc20c57000ac9',
    '55f8a9c06c018a0d6e000132','545cedaa9943f7fe7b000048','55908aad6620c066bc00002a',
    '546e2562b03326a88e000020','5390bac347d09b7da40006f6','5264d2b162488dc400000001',
    '50654ddff44f800200000004']

    //we are going to pass this information down to login page
    //async function because we must wait for something to happen first
    const loginUser = async (tokens) => {
        let response = await axios.post('http://127.0.0.1:8000/api/token/',tokens)
        try {
//            let response = await axios.post('http://127.0.0.1:8000/api/token/',tokens)
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
            alert(response.data.user);
        }
    }

    onMessageListener().then(payload => {
        setNotification({ title: payload.notification.title,
                          body: payload.notification.body })
        setShow(true);
        console.log(payload);
    }).catch(err => console.log('failed: ', err));

    const onShowNotificationClicked = () => {
        setNotification({ title: "Notification",
                          body: "This is a test notification" })
        setShow(true);
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
        console.log(userData.profile_pic)
//        axios.put(`http://127.0.0.1:8000/update_profile/${userData.user_id}/`, userData)
//            .then(res => {
//                setUser({ ...user, first_name:res.data.first_name,
//                        last_name: res.data_last_name,
//                        username: res.data.username,
//                        city: res.data.city,
//                        country: res.data.country })
//            })
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

    //retrieve random programming challenge
    const retrieveChallenge = () => {
        const challenge = codeWarsIds[(Math.random() * codeWarsIds.length) | 0]
        const roomName = user.username
        axios.get(`https://www.codewars.com/api/v1/code-challenges/${challenge}`)
            .then(res=>{
                setChallengeInState(res.data)
            })
            .catch(err=> {
                console.log(err)
            })
    }

    let logOutUser = () => {
        handleServerLogout()
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        history.push('/')
    }

    //turn is_online off
    let handleServerLogout = () => {
        axios.patch(`http://127.0.0.1:8000/update_profile/${user.user_id}/`, {
            is_online: 'False'
        })
        .then(res => {
                console.log('user logged out')
            })
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
    //get all users
    let getAllUsers = () => {
        axios.get('http://127.0.0.1:8000/users/')
                .then(res =>{
                    const filteredUsers = res.data.filter(filtered =>
                                                                filtered.profile.is_online === true)
                    setOnlineUsers([ ...filteredUsers])
                    const usernameEmailKeyPair =  filteredUsers.reduce((obj, item) => ({...obj, [item.username]: item.email}) ,{});
                    console.log('inside getAllUsers state:', usernameEmailKeyPair)
//                    axios.post('http://127.0.0.1:8000/cache/', usernameEmailKeyPair)
//                        .then(res => {
//                            console.log('inside post', res.data)
//                        })
                })
    }
    //code editor functionality - wait three seconds before getting input
    const threeSecondWait = () => {
            return new Promise(resolve => setTimeout(() => resolve("result"),3000));
    };

    //headers to send to Judge0API
    const headers = {
            'X-RapidAPI-Key': 'bcc33499f9msh5f6c898ed17eea7p121b52jsn76ceee08eab4'
    }
    //send code and required data to Judge0API
    const sendCodeJudge0 = (requestBody) => {
        axios.post(`${baseURL}`, requestBody, {
            headers
            })
            .then((res)=> {
                threeSecondWait().then(()=>{
                    axios.get(`${baseURL}/${res.data.token}`, {
                        headers
                    })
                    .then((res)=> {
                        setSpinnerOn(false)
                        !res.data.stdout ? setResp(res.data.stderr)
                            : setResp(res.data.stdout)
                    })
                    .catch((err)=> {
                        console.log('err',err)
                    })
                })
            })
    }
    //send current and matched users to state
    const pairProgrammingMatching = ( matchedUser) => {
        const username =  user.username
        setPairUsers({username: matchedUser })
    }


    const onSubmit = (data) => {
        const user = {
            username: data.username,
            email: data.email,
            password: data.password,
//            topic: Math.random().toString(36).slice(2,7)
            profile: {
                        city: data.city,
                        country: data.country,
            }
        };
        fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(user)
            })
            .then(res => {
                if(!res.ok){
                   return res.text().then(text=> {
                    const cleanText = text.split(':')[1].replace('[', '').replace(']','').replace('}','')
                    setErrorText(cleanText)
                    setVisible(true)
                   })
                }
                else {
                    return res.json()
                            .then(data=> {
                                    setSuccessSignup(true)
                              //we no longer need to store the token in local storage
//                            if(data.token) {
//                                const tokensAuth = {
//                                    'authTokens': {
//                                        'refresh': data.token.refresh_token,
//                                        'access': data.token.access_token,
//                                    }
//                                }
//                                localStorage.clear();
//
//                                localStorage.setItem('authTokens',tokensAuth);
//                                history.push('/profile')
//                            }

                            });
                    }
            })
        };


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
        getAllUsers: getAllUsers,
        onlineUsers: onlineUsers,
        availableUsers: availableUsers,
        sendCodeJudge0: sendCodeJudge0,
        spinnerOn: spinnerOn,
        setSpinnerOn: setSpinnerOn,
        resp: resp,
        setResp: setResp,
        valueOne: valueOne,
        setValueOne: setValueOne,
        valueTwo: valueTwo,
        setValueTwo: setValueTwo,
        valueThree: valueThree,
        setValueThree: setValueThree,
        onSubmit: onSubmit,
        errorText: errorText,
        visible: visible,
        successSignup: successSignup,
        onShowNotificationClicked: onShowNotificationClicked,
        show: show,
        setShow: setShow,
        notification: notification,
        setNotification: setNotification,
        isTokenFound: isTokenFound,
        setTokenFound: setTokenFound,
        pairProgrammingMatching: pairProgrammingMatching,
        setPairUsers: setPairUsers,
        pairUsers: pairUsers
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