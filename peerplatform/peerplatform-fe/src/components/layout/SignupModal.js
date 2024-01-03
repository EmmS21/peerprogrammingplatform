import React, { useState, useEffect, useContext } from 'react';
import secure_signup from '../../assets/images/secure_signup.svg';
import ProcessImage from 'react-imgpro';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router-dom';
import { Alert, Button, Space } from 'antd';
import AuthContext from '../../context/AuthContext';
import "../../assets/other_css/signupform.css";


const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
      .min(4, 'Password must be at least 4 characters')
      .required('Confirm Password is required'),
  confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password must match')
      .required('Confirm Password is required'),
})

const SignupModal = ({ closeModal }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(SignupSchema)
    });
    const history = useHistory();
    let { onSubmit, setIsSignupModalVisible } = useContext(AuthContext);

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      window.location.replace('https://peerprogrammingplatform.vercel.app/profile');
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="login-modal">
      <div className="base-container">
        <button className="close-button" onClick={() => setIsSignupModalVisible(false)}>X</button>
        <div>Sign Up</div>
        <div className="content">
          <div className="form">
            <form>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input {...register("email")} type="email" required/>
                    {errors.email && <div className="error-message">{errors.email.message}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input {...register('password')} type="password" required />
                    {errors.password && <div className="error-message">{errors.password.message}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input {...register("confirmPassword")} type="password" required />
                    {errors.confirmPassword && <div className="error-message">{errors.confirmPassword.message}</div>}
                </div>
            </form>
          </div>
        </div>
          <button type="button" className="btn" onClick={handleSubmit(onSubmit)}>
            Submit
          </button>
      </div>
    </div>
  );
};

export default SignupModal;
