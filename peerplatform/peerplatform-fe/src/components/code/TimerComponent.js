import React, { useEffect, useState } from 'react';

const TimerComponent = ({ onTimeUpdate }) => {
    const [elapsedTime, setElapsedTime] = useState(0)

    useEffect(() => {
        // Initialize elapsed time from localStorage or set it to 0 if not found
        const storedTime = localStorage.getItem('elapsedTime');
        const initialTime = storedTime ? parseInt(storedTime, 10) : 0;
        setElapsedTime(initialTime);

        const interval = setInterval(() => {
            setElapsedTime(prevTime => {
                const newTime = prevTime + 1;
                localStorage.setItem('elapsedTime', newTime.toString());
                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        if (elapsedTime > 0 && elapsedTime % 300 === 0) {
            alert(`You have spent ${elapsedTime/60} minutes on this page.`)
        }
        if (elapsedTime === 1800) {
            alert('You have reached 30 minutes!')
        }
    }, [elapsedTime])

    useEffect(() => {
        if (onTimeUpdate) {
            onTimeUpdate(elapsedTime)
        }
    }, [elapsedTime, onTimeUpdate])

    return (
        <div>
            Time Elapsed {elapsedTime} seconds
        </div>
    )
};

export default TimerComponent;