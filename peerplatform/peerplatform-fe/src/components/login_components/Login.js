import React, { Component,useState,useEffect,useContext } from "react";
import secure_login from "../../assets/images/secure_login.svg"
import "../../assets/scss/core/signup_components/_signup.scss"
import AxiosInstance from "../../AxiosApi.js";

import { connect } from "react-redux";
import { login } from "./LoginActions.js";
import { withRouter } from "react-router-dom";  // new import
import PropTypes from "prop-types";             // new import
import axios from 'axios'
import AuthContext from '../../context/AuthContext'

const Login = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    //if user login details are incorrect
    const [loginError, setLoginError] = useState('');
    let {loginUser} = useContext(AuthContext)

    const handleSubmit = e => {
        e.preventDefault();
        const newLoginData = {
            username: username,
            password: password,
        }
        console.log('user login info is working')
        console.log(newLoginData)
        loginUser(newLoginData);
    }

     return (
      <div className="base-container">
        <div className="header">Login</div>
        <div className="content">
          <div className="image">
            <img src={secure_login} />
          </div>
          <form className="form">
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
                onChange = { e => setPassword(e.target.value)}
                required
              />{' '}
            </div>
            <p>{loginError}</p>
          </form>
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

Login.propTypes = {
    login: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

//const ConnectedComponent = connect(mapStateToProps)(login)
export default withRouter(Login)
