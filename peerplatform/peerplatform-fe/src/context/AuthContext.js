import React, { createContext,useState,useEffect } from 'react';
import axios from 'axios';
//decoding token with this function
import jwt_decode from 'jwt-decode';
//we are importing history to have the ability to redirect user to home page
import { useHistory } from 'react-router-dom';

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

    let logOutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        history.push('/login')
    }

    //method to update token - token is refreshed every 5 minutes
    let updateToken = async ()=> {
        const refreshToken = {
            'refresh': authTokens.refresh
        }
        console.log('Update token running')
        try {
            let response = await axios.post('http://127.0.0.1:8000/api/token/refresh/',refreshToken)
            //update state with token
            setAuthTokens({'access': response.data.access,
                            'refresh': refreshToken.refresh})
            console.log(authTokens.access)
            //update user state
            const decoded = jwt_decode(response.data.access)
            setUser(user => ({
                ...decoded
            }))
            //store tokens in localStorage
            //we stringify because we can only store strings in localStorage
            localStorage.setItem('authTokens',JSON.stringify(authTokens))
            }
        catch(err) {
        //if fail, something is wrong with refresh token
//            logOutUser()
            console.log(err.response)
        }
    }

    //going to be passed down to AuthContext
    let contextData = {
        user:user,
        loginUser:loginUser,
        logOutUser:logOutUser,
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