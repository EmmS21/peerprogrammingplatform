import React, { Component,useState,useEffect } from "react";
import secure_login from "../../assets/images/secure_login.svg"
import "../../assets/scss/core/signup_components/_signup.scss"
import AxiosInstance from "../../AxiosApi.js";

const Login = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = e => {
        e.preventDefault()
        try {
            const response = AxiosInstance.post('http://127.0.0.1:8000/api/token/',{
                username: username,
                password: password
                });
                console.log('from api/token we get this:')
                console.log(response)
                AxiosInstance.defaults.headers['Authorization'] = "JWT " + response.access;
                localStorage.setItem('access_token', response.access);
                localStorage.setItem('refresh_token', response.refresh);
                console.log('JWT response.access to refresh: ')
                return response;
        } catch (error) {
            throw error;
        }
    }
     return (
      <div className="base-container">
        <div className="header">Login</div>
        <div className="content">
          <div className="image">
            <img src={secure_login} />
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                placeholder="username"
                value= {username}
                onChange = {e => setUserName(e.target.value)}
                required
              />{' '}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="password"
                value= {password}
                onChange = { e=> setPassword(e.target.value)}
                required
              />{' '}
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="button"
            className="btn"
            onClick={ handleSubmit}>
            Login
          </button>
        </div>
      </div>
    );
}
export default Login;
