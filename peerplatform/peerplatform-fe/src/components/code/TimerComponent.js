import React, { useEffect } from 'react';
import { Button } from 'antd'


const TimerComponent = ({ setGetHelp, elapsedTime, showTimer }) => {


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
    
    if(!showTimer){
        return null;
    }

    return (
        <div className="btn btn-primary single-full-height-button">
            {formatTime(elapsedTime)}
        </div>
    );
};

export default TimerComponent;
