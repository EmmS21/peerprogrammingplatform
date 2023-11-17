import React, { useEffect } from 'react';
import { Button } from 'antd'


const TimerComponent = ({ onTimeUpdate, streamHelp, elapsedTime, 
                        setElapsedTime, setGetHelp
                         }) => {



    useEffect(() => {
        const challenge = JSON.parse(localStorage.getItem('challenge'));
        const storedTime = localStorage.getItem('elapsedTime');
        const initialTime = Number.isNaN(parseInt(storedTime, 10)) ? 0 : parseInt(storedTime, 10);
        setElapsedTime(initialTime);

        const interval = setInterval(() => {
            setElapsedTime(prevTime => {
                const newTime = prevTime + 1;
                localStorage.setItem('elapsedTime', newTime.toString());

                if( newTime % (4 * 60) === 0) {
                    console.log(`Hello ${newTime}*** startStream`)
                    console.log('sending to stream', challenge)
                    streamHelp(challenge[0])
                }

                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        if (onTimeUpdate) {
            onTimeUpdate(elapsedTime);
        }
    }, [elapsedTime, onTimeUpdate]);

    function formatTime (seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="btn btn-primary single-full-height-button" onClick={() => setGetHelp(true)}>{formatTime(elapsedTime)}</div>
    );
};

export default TimerComponent;
