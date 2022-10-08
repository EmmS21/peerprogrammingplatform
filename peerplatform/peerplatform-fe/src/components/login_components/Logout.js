import React, { useState,useEffect,Fragment } from 'react';

const Logout = () => {
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        if(localStorage.getItem('token') == null) {
            window.location.replace('https://codesquad.onrender.com/login');
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogout = e => {
    e.preventDefault();
    }
}