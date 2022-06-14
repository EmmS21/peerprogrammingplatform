import React, { Component,useState,useEffect } from "react";
import secure_signup from "../../assets/images/secure_signup.svg"
import CountrySelector from './CountryList'
import ProcessImage from 'react-imgpro';
import axios from 'axios';


const Signup = () => {
    const [email, setEmail] =  useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] =  useState('');
    const [errors, setErrors] =  useState(false);
    const [loading, setLoading] =  useState(true);

    useEffect(() => {
        if(localStorage.getItem('token') !== null) {
            window.location.replace('http://localhost:3000/profile');
        } else {
            setLoading(false);
        }
    }, []);

    const onSubmit = e => {
        e.preventDefault();

        const user = {
            username: username,
            email: email,
            password: password,
        };
        console.log(`username: ${user.username}, email is: ${user.email} and password is: ${user.password}`);
        fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => console.log(res.json()))
//            .then(data => {
//                if (data.key) {
//                    localStorage.clear();
//                    localStorage.setItem('token',data.key);
//                    window.location.href('http://localhost:3000/profile/');
//                } else {
//                    setEmail('');
//                    setUserName('');
//                    setPassword('');
//                    localStorage.clear();
//                    setErrors(true);
//                }
//            });
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
                        {errors === true && <h2>Cannot signup with provided credentials</h2>}
                    </div>
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="name"
                                value= { username }
                                onChange= {e => setUserName(e.target.value)}
                                required
                            />{' '}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="email"
                                value= {email}
                                onChange= {e => setEmail(e.target.value)}
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
                                onChange= {e => setPassword(e.target.value)}
                                required
                            />{' '}
                        </div>
                    </div>
                </div>
            <div className="footer">
                <button type="button" className="btn" onClick={onSubmit}>
                    Register
                </button>
            </div>
        </div>
      );
 }
export default Signup;
//}
//export default class Signup extends Component {
//    constructor(props) {
//        super(props);
//    }
//      render() {
////        return (
////            <div className="base-container" ref={this.props.containerRef}>
////                <div className="content">
////                    <div className="image">
////                        <ProcessImage
////                            image={secure_signup}
////                            resize={{ width:400, height: 400 }}
////                            processedImage={(src,err) => this.setState({ src,err})}
////                            />
////                    </div>
////                    <div className="form">
////                        <div className="form-group">
////                            <label htmlFor="username">Username</label>
////                            <input
////                                type="text"
////                                name="name"
////                                placeholder="name"
////                            />
////                        </div>
////                        <div className="form-group">
////                            <label htmlFor="email">Email</label>
////                            <input
////                                type="text"
////                                name="email"
////                                placeholder="email"
////                            />
////                        </div>
////                        <div className="form-group">
////                            <label htmlFor="location">Location</label>
////                            <CountrySelector />
////                        </div>
////                        <div className="form-group">
////                            <label htmlFor="password">Password</label>
////                            <input
////                                type="text"
////                                name="password"
////                                placeholder="password"
////                            />
////                        </div>
////                    </div>
////                </div>
////            <div className="footer">
////                <button type="button" className="btn">
////                    Register
////                </button>
////            </div>
////        </div>
////      );
////    }
////}


//                        <div className="form-group">
//                            <label htmlFor="location">Location</label>
//                            <CountrySelector />
//                        </div>
