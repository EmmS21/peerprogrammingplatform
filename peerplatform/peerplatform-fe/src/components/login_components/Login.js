import React, { Component,useState,useEffect,useContext, useRef } from "react";
import secure_login from "../../assets/images/secure_login.svg"
import "../../assets/scss/core/signup_components/_signup.scss"
import AxiosInstance from "../../AxiosApi.js";

import { connect } from "react-redux";
import { login } from "./LoginActions.js";
import { withRouter } from "react-router-dom";  // new import
import PropTypes from "prop-types";             // new import
import axios from 'axios'
import AuthContext from '../../context/AuthContext'
import loginSchema from './validation/loginSchema';


const Login = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    //if user login details are incorrect
    let {loginUser, loginError } = useContext(AuthContext)

    //temp
    const loginRef =  useRef();

    //temp
    useEffect(() => {
      window.onclick = (event) => {
        console.log("You clicked the login div")
      } 
    })

    const handleSubmit = e => {
        e.preventDefault();
        const newLoginData = {
          username: username,
          password: password,
        }
        loginSchema.isValid({ newLoginData })
          .then(function(){
            loginUser(newLoginData);
          })
        console.log('user login info is working')
        console.log(newLoginData)
    }
    console.log(loginError)


     return (
      <div id="login-loaded" className="base-container">
        <div className="header">Login</div>
        <div className="content">
          <div className="image">
            <img src={secure_login} />
          </div>
          <p id="loginError" data-testid="loginError">{ loginError }</p>
          <form className="form">
            <div className="form-group">
              <label  htmlFor="username">Username</label>
              <input
                id="name-field"
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
                id="password-field"
                type="password"
                name="password"
                placeholder="password"
                value= {password}
                onChange = { e => setPassword(e.target.value)}
                required
              />{' '}
            </div>
          </form>
        </div>
        <div ref={loginRef} className="footer" id="login-div">
          <button type="button"
            id="login-button"
            className="btn"
            onClick={ handleSubmit }>Login</button>
        </div>
      </div>
    );
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

//const ConnectedComponent = connect(mapStateToProps)(login)
export default withRouter(Login)
