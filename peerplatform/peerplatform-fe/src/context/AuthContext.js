import React, { createContext,useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useHistory } from 'react-router-dom';
import WebSocketInstance from '../websocket/Connect';
import { notification as notify } from 'antd';


const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user,setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)
    //creating new drop in audio chat
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
    const profileURL = 'http://127.0.0.1:8000/'
    // const profileURL = 'https://aicoder.onrender.com/'
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
    const [roomName, setRoomName] = useState("")
    const [username, setUserName] = useState("")
    const [isLoadingSolution, setIsLoadingSolution] = useState(false);
    const [optimalAnswer, setOptimalAnswer] = useState()
    const history = useHistory();
    const [checkAnswers, setCheckAnswers] = useState([])
    const [isLoginModalVisible, setLoginModalVisible] = useState(false);
    const [isSignupModalVisible, setIsSignupModalVisible] = useState(false)

    //we are going to pass this information down to login page
    //async function because we must wait for something to happen first
    const loginUser = async (tokens) => {
        try {
            const response = await axios.post(`${profileURL}api/token/`,tokens)
            console.log('resp', response)
            const { access, refresh } = response.data
            setAuthTokens({
                access,
                refresh
            })
            const decoded = jwt_decode(access)
            if (!decoded || !decoded.username) {
                throw new Error("Invalid token structure or missing information");
            }    
            setUser(decoded)
            localStorage.setItem('authTokens',JSON.stringify(response.data))
            history.push('/')
        } catch (error) {
            setLoginError(error.response?.data?.detail || "An error occurred during login", error);
            console.log('login error', error)
            alert(error.response?.data?.detail || "An error occurred during login");
        }
    };


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
        axios.put(`${profileURL}${userID}/`, userData)
        .then(res => {
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

    const submitJudge0 = (requestBody) => {
    return new Promise((resolve, reject) => {
        let compareArr = requestBody.expected_output
        console.log('compareArr', compareArr)
        let emptyArr = new Array(requestBody.expected_output.length).fill(false);
        // console.log('expected', requestBody.expected_output);
        axios
        .post(`${baseURL}`, requestBody, {
            headers,
        })
        .then((res) => {
            threeSecondWait().then(() => {
            axios
                .get(`${baseURL}/${res.data.token}`, {
                headers,
                })
                .then((res) => {
                let resultsOutput = res.data.stdout;
                resultsOutput = resultsOutput.trim()
                let resultsArr = resultsOutput.split("\n")
                for (let i = 0; i < resultsArr.length; i++) {
                    let resultValue = resultsArr[i];
                    let expectedValue = compareArr[i];
                    if(typeof expectedValue === 'boolean'){
                        expectedValue = String(expectedValue)
                    }
                    if (resultValue == expectedValue) {
                    console.log('changedTrue');
                    emptyArr[i] = true;
                    }
                }
                console.log('respArr***', emptyArr);
                resolve(emptyArr); // Resolve the promise with the resultArr
                })
                .catch((err) => {
                console.error('Error fetching result:', err);
                setResp(
                    'An error occurred while fetching the result. Please try again.'
                );
                reject(err); // Reject the promise with the error
                });
            });
        })
        .catch((err) => {
            if (err.response && err.response.status === 422) {
            console.error('Unprocessable Content:', err.response.data);
            setResp(
                'It seems you have not selected a programming language or used an incorrect language selection. Please check and try again.'
            );
            } else {
            setSpinnerOn(false);
            console.error('An error occurred:', err);
            setResp('An unknown error occurred. Please try again.');
            }
            reject(err); // Reject the promise with the error
        });
    });
    };

    const submitCodeJudge0 = (requestBody, answers) => {
        let result = new Array(answers.length).fill(0)
        // Step 1: Format the Expected Output
        axios.post(`${baseURL}`, requestBody, {
            headers
        })
        .then((postRes) => {
            axios.get(`${baseURL}/${postRes.data.token}`, {
                headers
            })
            .then((getRes) => {
                const { status, stdout, stderr } = getRes.data;
                const splitResults = stdout.split("\n").filter(line => line !== '');
                for(let i = 0; i < splitResults.length; i++){
                    result[i] = splitResults[i] == answers[i]
                }
                setCheckAnswers(result)
            })
            .catch((err) => {
                console.error('Error fetching result:', err);
            });
        })
        .catch((err) => {
            console.error('Error submitting code:', err);
        });
    };

    //send code and required data to Judge0API
    const sendCodeJudge0 = (requestBody) => {
        const reqUrl = `${baseURL}?wait=true`
        axios.post(reqUrl, requestBody, {
            headers
        })
        .then((res) => {
            const token = res.data.token
            if(!token){
                console.error('Invalid token received', res.data)
                setSpinnerOn(false);
                setResp('Oops, this is on us, it seems we are having an issue running your code, please screenshot this and send an email to emmanuelsibandaus@gmail.com')
                return;
            }
            const resultUrl = `${baseURL}/${token}`;
            axios.get(resultUrl, {
                headers
            })
            .then((res) => {
                console.log('res', res)
                setSpinnerOn(false)
                const { status, stdout, stderr } = res.data;
                if(stdout && stdout.length > 1){
                    let resp = decodeURIComponent(stdout)
                    setResp(resp)
                }    
                if (status && status.description === "Processing") {
                    setResp("Your code is taking too long to execute. It might contain an infinite loop or a very intensive computation.")
                } 
                if (!stdout) {
                    console.log('err', stderr)
                    setResp(stderr || "An unknown error occurred.");
                }
            })
            .catch((err) => {
                setSpinnerOn(false)
                if(err.response){
                    console.error('Error Response:', err.response);
                    setResp(`Error: ${err.response.status} - ${err.response.statusText}`)
                } else {
                    console.error('An error occurred while fetching the result:', err)
                    setResp('An unknown error occurred. Please try again.')
                }
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
            username: data.email,
            email: data.email,
            password: data.password,
        };
        fetch(`${profileURL}api/register`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(user)
            })
            .then(async (res) => {
                if(!res.ok){
                    const errorText = await res.text()
                    const cleanText = errorText
                        .split(":"[1])
                        .replace("[", "")
                        .replace("]", "")
                        .replace("}", "")
                    setErrorText(cleanText)
                    setVisible(true)
                   } else {
                    const userData = await res.json()
                    setSuccessSignup(true)
                   }
                })
                .catch((error) => {
                    console.error("Unexpected error:", error)
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

    async function getAnswer(challenge, query){
        // console.log('challenge', challenge)
        let leetObj = {}
        leetObj = {
            title: challenge['title'],
            description: challenge['place'],
            query: query
        }
        const res = await axios.post(`${profileURL}code_help/answer`, leetObj)
        setOptimalAnswer(res.data)
        localStorage.setItem('answer', res.data)
    }

    async function getSolution(challenge, query = null, opt=null){
        console.log('getSolution', challenge)
        console.log('query', query)
        if(!query){
            setIsLoadingSolution(true)
        }
        // console.log('trigg', query)
        console.log('what are we sending', challenge)
        // console.log('what query are we sending', query)
        if(opt === 'one'){
            setCodeResp("Please wait for code to load....");
        }
        let leetObj = {}
        leetObj = { title: challenge['title'],
                        description: challenge['place'],
                    }
        if (query) {
          leetObj['query'] = query; 
        }
        if(opt){
            leetObj['opt'] = opt
        }
        console.log('leetObj sending***', leetObj)
        const res = await axios.post(`${profileURL}code_help/get`, leetObj)
        const content = res.data;
        if(query){
            if(opt === 'four'){
                // console.log('auth', content)
                return content
            } else {
                console.log('content returned**', content)
                setCodeHelpState(content)
            }
        } else if(opt === 'one') {
            setGptResp(content)
            setCodeResp(content)
            localStorage.setItem('codeResp', content)
            console.log('respAuth', gptresp)
            setIsLoadingSolution(false)
        } 
        else {
            return content
        }
        if(!query){
            setOpenModal(true)
        }
        return content
    }

    function getResp(answer, newChallengeData=null) {
        localStorage.removeItem('codeResp')
        setIsLoadingSolution(true)
        setGptResp(answer)
        setCodeResp(answer)
        localStorage.setItem('codeResp', answer)
        setIsLoadingSolution(false)
        return { answer, newChallengeData }
    }
    
    function setQuestion (question) {
        console.log('setQuestion triggered')
        let result = question[0].SimplifiedExplanation
        result = JSON.stringify(result)
        console.log('**result', question[0])
        question[0].extra_explain = JSON.parse(result)
        console.log('questionJSON', question[0])
        const challengeData = question[0]
        const { AnswerTemplate, SimplifiedExplanation, ...newChallengeData } = challengeData;
        setChallengeInState(newChallengeData)
        localStorage.setItem('challenge', JSON.stringify(newChallengeData))
        const response = getResp(AnswerTemplate, newChallengeData)
        return response
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
        setLoadingCode: setLoadingCode,
        submitJudge0: submitJudge0,
        roomName: roomName, 
        setRoomName: setRoomName,
        username: username,
        setUserName: setUserName,
        isLoadingSolution: isLoadingSolution, 
        setIsLoadingSolution: setIsLoadingSolution,
        getResp: getResp,
        setQuestion: setQuestion,
        getAnswer: getAnswer,
        optimalAnswer: optimalAnswer,
        submitCodeJudge0: submitCodeJudge0,
        checkAnswers: checkAnswers,
        setCheckAnswers: setCheckAnswers,
        isLoginModalVisible: isLoginModalVisible, 
        setLoginModalVisible: setLoginModalVisible,
        isSignupModalVisible: isSignupModalVisible,
        setIsSignupModalVisible: setIsSignupModalVisible,
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
