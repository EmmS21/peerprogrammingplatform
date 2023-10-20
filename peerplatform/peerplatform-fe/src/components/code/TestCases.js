import React, { useState, useEffect, useRef, useContext } from 'react';
import "../../assets/other_css/sidebar.css";
import AuthContext from '../../context/AuthContext';
import { BallTriangle } from 'react-loader-spinner';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';



const TestCases = ({ testResults }) => {
    const [displayedResults, setDisplayedResults] = useState(Array(5).fill(null));
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
          if (currentIndex < testResults.length) {
            const updatedResults = [...displayedResults];
            updatedResults[currentIndex] = testResults[currentIndex];
            setDisplayedResults(updatedResults);
            setCurrentIndex(currentIndex + 1);
          } else {
            clearInterval(timer); // Stop the timer when all test cases are displayed
          }
        }, 1000); // Adjust the delay as needed
    
        return () => clearInterval(timer); // Cleanup when the component unmounts
      }, [testResults, displayedResults, currentIndex]);

      return (
        <div className="testcases-container">
          {[1, 2, 3, 4, 5].map((testCaseIndex) => (
            <div className="child-div" key={testCaseIndex}>
              {displayedResults[testCaseIndex - 1] === null ? (
                <span className="loader-container">
                  <BallTriangle
                    height={50}
                    width={50}
                    radius={5}
                    color="#4fa94d"
                    ariaLabel="ball-triangle-loading"
                  />
                </span>
              ) : displayedResults[testCaseIndex - 1] ? (
                <CheckOutlined style={{ fontSize: '24px', color: 'green' }} />
              ) : (
                <CloseOutlined style={{ fontSize: '24px', color: 'red' }} />
              )}
              Test Case {testCaseIndex}
            </div>
          ))}
        </div>
      );
    };
    
    export default TestCases;
