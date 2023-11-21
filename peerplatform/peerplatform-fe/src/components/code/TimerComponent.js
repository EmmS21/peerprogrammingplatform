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
                    // console.log('sending to stream', challenge)
                    streamHelp(challenge)
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
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const formattedHours = hours > 0 ? `${hours} hr` : '';
        const formattedMinutes = minutes > 0 ? `${minutes} min` : '';
        const formattedSeconds = `${remainingSeconds} sec`;

        return [formattedHours, formattedMinutes, formattedSeconds]
        .filter((part) => part !== '') // Filter out empty parts
        .join(' ');
    
    }
      

    return (
        <div className="btn btn-primary single-full-height-button" onClick={() => setGetHelp(true)}>{formatTime(elapsedTime)}</div>
    );
};

export default TimerComponent;
