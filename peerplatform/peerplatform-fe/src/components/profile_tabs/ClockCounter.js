import React, { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import '../../assets/other_css/clocktimer.css';
import ProfileTab from './ProfileTab'
import Ratings from './Ratings';

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
        return <div className="timer">Step Completed...</div>;
    }


  return (
    <div className="timer">
      <div className="value">{remainingTime}</div>
      { /* <div className="text">seconds</div> */}
    </div>
  );
};

const ClockCounter = ({ index, timer, handleComplete }) => {
  return (
    <div className="App">
      <div className="timer-wrapper">
        {  index < 4 ?
        <CountdownCircleTimer
          isPlaying
          key={index}
          duration={ timer }
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[10, 6, 3, 0]}
          onComplete={handleComplete}
          size={70}
        >
          {renderTime}
        </CountdownCircleTimer>
        :
        <Ratings/>
        }
      </div>
    </div>
  );
};

export default ClockCounter;