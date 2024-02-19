import React, { useState, useEffect } from "react";
import "../../assets/other_css/startdisplay.css";

const StartDisplay = ({ setShowStartDisplay, showStartDisplay }) => {
  const [timer, setTimer] = useState(5);
    const [displayedMessage, setDisplayedMessage] = useState("");

    const dotElements = Array.from({ length: timer }, (_, index) => (
      <span key={index} style={{ animationDelay: `${index * 0.2}s` }} className="dot">
      </span>
    ));
  
    useEffect(() => {
      if (timer > 0) {
        const interval = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 2500); 
        return () => clearInterval(interval); 
      }
      if(timer === 0) {
        setTimeout(() => {
          setShowStartDisplay(false)
          localStorage.setItem("elapsedTime", "0")
        }, 2000);
      }
    }, [timer]); 

    useEffect(() => {
        const message = messages[timer];
        setDisplayedMessage("");
        let index = 0;
        const interval = setInterval(() => {
          setDisplayedMessage((prev) => prev + message.charAt(index));
          index++;
          if (index === message.length) {
            clearInterval(interval);
          }
        }, 5); 
    
        return () => clearInterval(interval);
      }, [timer]); 
    

    const messages = {
        5: "Here's how it works, you will receive a programming challenge.",
        4: "Each challenge has an 'optimal' solution, AI will break this solution down into questions",
        3: "The questions are designed to help you think through the process of re-creating this answer",
        2: "This will help you think through how to build the optimal solution for the question",
        1: "Since this is a private beta, you will have 30 minutes to test the platform.",
        0: "Please leave your feedback when you are done. Click refresh if you have issues with the answer or question."
    };
  
    return (
        <div className="fullPageBlackBackground">
          <div className="contentCentered">
            <div className="centeredTimer">
              {timer}
              <div className="dots">{dotElements}</div>
            </div>
            <div className="message">{displayedMessage}</div>
          </div>
        </div>
      );
  };
  
  export default StartDisplay;