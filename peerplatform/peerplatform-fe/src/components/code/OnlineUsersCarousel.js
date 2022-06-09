import React, { useEffect, useContext, useState, Component } from 'react';
import AuthContext from '../../context/AuthContext';
import { Carousel } from 'antd';
import axios from 'axios';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Rings } from 'react-loader-spinner';

const OnlineUsersCarousel = () =>  {
        const { user, onlineUsers, getAllUsers } = useContext(AuthContext);
//        const [onlineUsers, setOnlineUsers] = useState([]);

        const contentStyle = {
              height: '160px',
              width: '20%',
              color: '#fff',
              lineHeight: '50%',
              textAlign: 'center',
              background: '#364d79',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
        };

        const imageStyle = {
            flex: 1,
            width: '100%',
            height: '100%',
            resizeMode: 'center',
        }

        const containerStyle = {
            transform: 'translate(39%, 0%)',
        }

        useEffect((() => {
            console.log('use Effect is running')
            getAllUsers()
        }),[])

        return(
        <>
            <center><h8>Who's Online</h8></center>
            <Carousel autoplay style={containerStyle} dotPosition={'left'} effect={'fade'} autoplaySpeed={10}>
                    {
                        [onlineUsers].length === 0 ?
                            <Rings color="#00BFFF" height={80} width={80} />
                            : onlineUsers.map(user => {
                                return (
                                <div className="img-container">
                                    <h3 style={contentStyle}>
                                        <img style={imageStyle} src={user.profile_pic} />
                                    </h3>
                                </div>
                                )
                            })
                    }
            </Carousel>
        </>
        )
};

export default OnlineUsersCarousel;
