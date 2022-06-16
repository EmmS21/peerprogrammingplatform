import React, { Component,useState,useEffect } from 'react';
import secure_signup from '../../assets/images/secure_signup.svg';
import CountrySelector from './CountryList'
import ProcessImage from 'react-imgpro';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router-dom';
import { Alert } from 'antd';

const Signup = () => {

    const [email, setEmail] =  useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] =  useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] =  useState(true);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const history = useHistory();
    const [visible, setVisible] = useState(false);
    const [errorText, setErrorText] = useState('');


    useEffect(() => {
        if(localStorage.getItem('token') !== null) {
            window.location.replace('http://localhost:3000/profile');
        } else {
            setLoading(false);
//            setErrors({ ...errors, usernameError: 'we have something' })
        }
    }, []);

    //check if email is valid
    const isValidEmail = email =>
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
    );

    const formSchema = Yup.object().shape({
        password: Yup.string()
            .required('Please enter a password')
            .min(4, 'Password length should be atleast 4 characters')
            .max(12, 'Password length cannot exceed 12 characters')
    });

//    const onSubmit = (data) => console.log('submitted with', data);
    const handleEmailValidation = email => {
        const isValid = isValidEmail(email)
        const validityChanged =
            (errors.email && isValid) || (!errors.email && !isValid);
        if(validityChanged) {
            console.log('Fire tracker with', isValid ? 'Valid': 'Invalid');
        }
        return isValid;
    }
    const onSubmit = (data) => {
//        e.preventDefault();
        const user = {
            username: data.username,
            email: data.email,
            password: data.password,
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
//                   console.log(text)
                    setErrorText(text)
                    setVisible(true)
                   })
                }
                else {
                    return res.json()
                            .then(data=> {
                            if(data.token) {
                                const tokensAuth = {
                                    'authTokens': {
                                        'refresh': data.token.refresh_token,
                                        'access': data.token.access_token,
                                    }
                                }
                                localStorage.clear();
                                localStorage.setItem('token',tokensAuth);
                                history.push('/profile')
                            }});
                    }
            })
        };
    return (
            <div className="base-container">
                <div className="content">
                    <div className="image">
                        <ProcessImage
                            image={secure_signup}
                            resize={{ width:400, height: 400 }}
                            processedImage={(src,err) => this.setState({ src,err})}
                            />
                        {loading === false && <h1>Signup</h1>}
                    </div>
                    { visible ? (
                        <Alert
                            message="Warning"
                            description= { errorText }
                            type="warning"
                            showIcon
                            closable
                    /> ): null }
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                placeholder="username"
                                name="username"
                                {...register('username', { required: true, minLength: 2 })} />
                            { errors.username && errors.username.type === 'required' && <span>Please enter a username</span> }
                            { errors.username && errors.username.type === 'minLength' && <span>Please enter a username longer than 2 characters</span> }
                        </div>
                        <div className="form-group">
                            <label type="email">Email</label>
                            <input {...register('email', { required: true, validate: handleEmailValidation})} />
                            { errors.email && errors.email.type === 'required' && <span>Please enter an email address</span> }
                            { errors.email && errors.email.type === 'validate' && <span>Please enter a valid email</span> }
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input {...register('city', {required: true})} />
                            { errors.city && errors.city.type === 'required' && <span>Please enter a city</span> }
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <input {...register('country', {required: true})} />
                            { errors.country && errors.country.type === 'required' && <span>Please enter a country </span> }
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type='password'
                                {...register('password', {required: true})}/>
                            { errors.password && errors.password.type === 'required'&& <span>Please enter a password email</span> }
                        </div>
                    </div>
                </div>
            <div className="footer">
                <button type="button" className="btn" onClick={ handleSubmit(onSubmit)}>
                    Register
                </button>
            </div>
        </div>
      );
 }
export default Signup;
