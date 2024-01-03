import React, { useState,  useContext } from "react";
import AuthContext from '../../context/AuthContext';
import loginSchema from "../login_components/validation/loginSchema";
import "../../assets/dashboard_scss/login-modal.scss"

const LoginModal = ({ closeModal }) => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  let { loginUser, loginError, 
        setLoginModalVisible, successSignup } = useContext(AuthContext);

  const handleSubmit = e => {
    e.preventDefault();
    const newLoginData = {
      username: username,
      password: password,
    };
    loginSchema.isValid({ newLoginData })
      .then(function () {
        loginUser(newLoginData);
        closeModal(); 
      });
  };

  return (
    <div className="login-modal">
      <div className="base-container">
        <button className="close-button" onClick={() => setLoginModalVisible(false)}>X</button>
        <div>Login</div>
        <div className="content">
          <p id="loginError" data-testid="loginError">{loginError}</p>
          {successSignup && (
            <div>User created successfully. Please login.</div>
          )}
          <form className="form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="name-field"
                type="text"
                name="username"
                placeholder="username"
                value={username}
                onChange={e => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password-field"
                type="password"
                name="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </form>
        </div>
          <button type="button" id="login-button" className="btn" onClick={handleSubmit}>Login</button>
      </div>
    </div>
  );
};

export default LoginModal;
