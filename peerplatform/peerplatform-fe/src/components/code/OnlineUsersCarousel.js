import React, { useEffect, useContext, useState, Component } from 'react';
import AuthContext from '../../context/AuthContext';
import { Carousel } from 'antd';
import axios from 'axios';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Rings } from 'react-loader-spinner';

const OnlineUsersCarousel = () =>  {
        const { user } = useContext(AuthContext)
        const [onlineUsers, setOnlineUsers] = useState([])

        const contentStyle = {
              height: '160px',
              width: '25%',
              color: '#fff',
              lineHeight: '60%',
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
            transform: 'translate(37%, 0%)',
        }

        useEffect((() => {
            console.log('use Effect is running')
            axios.get('http://127.0.0.1:8000/users/')
                .then(res =>{
                    setOnlineUsers([ ...res.data])
                })
        }),[])
        console.log(`inside state ${onlineUsers}`)

        return(
        <>
        <center><h6>Who's Online</h6></center>
            <Carousel autoplay style={containerStyle} dotPosition={'left'} effect={'fade'} autoplaySpeed={10}>
                    {
                        [onlineUsers].length === 0 ?
                            <Rings color="#00BFFF" height={80} width={80} />
                            : onlineUsers.map(user => {
                                return (
                                <div className="img-container">
                                    <h3 style={contentStyle}><img style={imageStyle} src={user.profile_pic} /></h3>
                                </div>
                                )
                            })
                    }
          </Carousel>
        </>
        )
};

export default OnlineUsersCarousel;
