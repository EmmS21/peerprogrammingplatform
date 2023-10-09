import React, { createContext,useState, useEffect, useRef } from 'react';
import axios from 'axios';
//decoding token with this function
import jwt_decode from 'jwt-decode';
//we are importing history to have the ability to redirect user to home page
import { useHistory } from 'react-router-dom';
import axiosWithAuth from "../axios"
import { Device } from '@twilio/voice-sdk';
import { useGlobalState } from '../context/RoomContextProvider';
import WebSocketInstance from '../websocket/Connect';
import { notification as notify } from 'antd';


const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user,setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)
    //creating new drop in audio chat
    const [state, setState] = useState(useGlobalState());
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [spinnerOn, setSpinnerOn] = useState(false)
    const [resp, setResp] = useState("")
    const [valueOne, setValueOne] = useState(0)
    const [valueTwo, setValueTwo] = useState(0)
    const [valueThree, setValueThree] = useState(0)
    const [valueFour, setValueFour] = useState(0)
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
    const [ allOnlineUsers, setAllOnlineUsers ] = useState([])
    const [loginError, setLoginError] = useState('');
    const availableOnlineUsers = useRef([])
    const matchedUserState = useRef([])
    const driverInState = useRef([])
    const room_name = useRef([])
    const participants = useRef([])
    //  const profileURL = 'http://127.0.0.1:8000/'
    const profileURL = 'https://aicoder.onrender.com/'
    const difficultySelected = useRef([])
    const [openModal, setOpenModal] = useState(true);
    const [gptresp, setGptResp] = useState({})
    const [api, contextHolder] = notify.useNotification();
    const [currentLanguage, setCurrentLanguage] = useState('63');
    const [formattedChallengeName, setFormattedChallengeName] = useState('')
    const [inputArr, setInputArr] = useState([])
    const [outputArr, setOutputArr] = useState([])
    const [showNextChallengeButton, setShowNextChallengeButton] = useState(false);
    const [challengeInState, setChallengeInState] = useState({});
    const [codeHelpState, setCodeHelpState] = useState(null); // New state for Code Help
    const [loadingCode, setLoadingCode] = useState(false);
    const [codeResp, setCodeResp] = useState("Please wait for code to load....");
    // const codeResp = useRef('')



    const history = useHistory();

    //we are going to pass this information down to login page
    //async function because we must wait for something to happen first
    const loginUser = async (tokens) => {
        let response = await axios.post(`${profileURL}api/token/`,tokens)
        try {
            setAuthTokens(authTokens => ({
                ...response.data
            }))
            const decoded = jwt_decode(response.data.access)
            setUser(user => ({
                ...decoded
            }))
            localStorage.setItem('authTokens',JSON.stringify(response.data))
            history.push('/')
        }
        catch(err) {
            setLoginError(response.data.user)
            alert(response.data.user);
        }
    }
    const onShowNotificationClicked = () => {
        setNotification({ title: "Notification",
                          body: "This is a test notification" })
        setShow(true);
    }

    //get profile information
    const getProfileInfo = (userId) => {
        axios.get(`${profileURL}users/${userId}`)
                .then(res => {
                    setUser({ ...user,
                            first_name: res.data.first_name,
                            last_name: res.data.last_name,
                            username: res.data.username,
                            city: res.data.city,
                            country: res.data.country,
                            profile_pic: res.data.profile_pic
                        })
                })
                // console.log(`what is inside user ${user.first_name}`)
    }

    //update profile information
    const updateProfile = (userData, userID) => {
        // console.log('userData contains', userData)
        axios.put(`${profileURL}${userID}/`, userData)
        .then(res => {
            // console.log('profile update', res)
            setUser({ ...user, 
                        first_name:res.data.first_name,
                        last_name: res.data_last_name,
                        username: res.data.username,
                        city: res.data.city,
                        country: res.data.country })
                    })
        .catch((error) => {
            console.log('error from update profile info', error)
        })
    }

    const updateProfilePic = (profilePicData, user_id) => {
        const headers = {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data`,
        }
        axios.put(`${profileURL}${user_id}/`,profilePicData, {
            headers,
        })
            .then( res => {
                // console.log('uploadProfilePic', res)
            })
            .catch((error) =>{
                // console.log('error',error)
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
        axios.patch(`${profileURL}update_profile/${user.user_id}/`, {
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
            let response = await axios.post(`${profileURL}api/token/refresh/`,refreshToken)
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
        .then((res) => {
            threeSecondWait().then(() => {
                axios.get(`${baseURL}/${res.data.token}`, {
                    headers
                })
                .then((res) => {
                    console.log('res', res)
                    setSpinnerOn(false)
                    !res.data.stdout ? setResp(res.data.stderr)
                        : setResp(res.data.stdout)
                })
                .catch((err) => {
                    setSpinnerOn(false)
                    console.error('Error fetching result:', err);
                    setResp('An error occurred while fetching the result. Please try again.');
                })
            })
        })
        .catch((err) => {
            if (err.response && err.response.status === 422) {
                setSpinnerOn(false)
                console.error('Unprocessable Content:', err.response.data);
                setResp('It seems you have not selected a programming language or used an incorrect language selection. Please check and try again.');
            } else {
                setSpinnerOn(false)
                console.error('An error occurred:', err);
                setResp('An unknown error occurred. Please try again.');
            }
        });
    }
    
    //send current and matched users to state
    const pairProgrammingMatching = (matchedUser) => {
        const username =  user.username
        setPairUsers({username: matchedUser })
    }

    //redis get request
    const config = {
        method: 'GET',
        url: `${profileURL}cache/`,
        headers: {
            "accept": "*/*",
        }
    }


    const onSubmit = (data) => {
        const user = {
            username: data.username,
            email: data.email,
            password: data.password,
            profile: {
                        city: data.city,
                        country: data.country,
            }
        };
        fetch(`${profileURL}api/register`, {
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
                            });
                    }
            })
        };
    
    async function sendWebSocketData(data){
        return await WebSocketInstance.sendData(data)
    };

    function sortUsersAlphabetically(str) {
        const hours = new Date(new Date().toLocaleString('en', {timeZone: 'America/New_York'})).getDay()
        if(hours % 2 === 0){
            return [...str].sort();
        } else {
            return [...str].sort().reverse();
        }
    }

    async function getSolution(title, query = null, opt=null){
        console.log('trigg', query)
        if(opt){
            setCodeResp("Please wait for code to load....");
        }
        // codeResp.current = "Please wait for code to load....";
        const leetObj = { data: title };
        if (query) {
          leetObj['query'] = query; 
        }
        if(opt){
            leetObj['opt'] = opt
        }

        const res = await axios.post(`${profileURL}/code_help/get`, leetObj)
        const content = res.data;
        if(query){
            console.log('content', content)
            setCodeHelpState(content)
        } else if(opt) {
            setGptResp(content)
            setCodeResp(content)
            // codeResp.current = content
            localStorage.setItem('codeResp', content)
            console.log('resp', codeResp, '***')
        } else{
            return content
        }
        setOpenModal(true)
        return content
    }
    

    function postReview(){
        // console.log('inside postReview')
        const review = {}
        review['user'] = user.username
        review['communication'] = valueOne
        review['problem-solving'] = valueTwo
        review['collaboration'] = valueThree
        review['programming'] = valueFour
        axios.post(`${profileURL}update_score/`, review)
        .then(res => {
            // console.log('our response', res)
        })
    }

    const openNotification = () => {
        api.open({
            message: "Select language first!",
            description: "Please select a language before trying to get a solution",
            duration: 0,
        })
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logOutUser:logOutUser,
        updateToken: updateToken,
        updateProfile: updateProfile,
        getProfileInfo: getProfileInfo,
        config: config,
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
        valueFour: valueFour, 
        setValueFour: setValueFour,
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
        pairUsers: pairUsers,
        allOnlineUsers: allOnlineUsers,
        setAllOnlineUsers: setAllOnlineUsers,
        availableOnlineUsers: availableOnlineUsers,
        matchedUserState: matchedUserState,
        loginError : loginError,
        updateProfilePic: updateProfilePic,
        sendWebSocketData: sendWebSocketData,
        driverInState: driverInState,
        sortUsersAlphabetically: sortUsersAlphabetically,
        profileURL: profileURL,
        postReview: postReview,
        room_name: room_name,
        participants: participants,
        difficultySelected: difficultySelected,
        challengeInState: challengeInState, 
        setChallengeInState: setChallengeInState,
        getSolution: getSolution,
        openModal: openModal,
        setOpenModal: setOpenModal,
        gptresp : gptresp,
        contextHolder: contextHolder,
        openNotification: openNotification,
        setCurrentLanguage: setCurrentLanguage,
        currentLanguage: currentLanguage,
        formattedChallengeName: formattedChallengeName,
        setFormattedChallengeName: setFormattedChallengeName,
        inputArr: inputArr,
        setInputArr: setInputArr,
        outputArr: outputArr,
        setOutputArr: setOutputArr,
        showNextChallengeButton: showNextChallengeButton, 
        setShowNextChallengeButton: setShowNextChallengeButton,
        codeHelpState: codeHelpState,
        codeResp: codeResp,
        setCodeResp: setCodeResp,
        loadingCode: loadingCode, 
        setLoadingCode: setLoadingCode
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
