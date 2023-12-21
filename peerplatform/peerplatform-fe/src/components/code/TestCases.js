import React, { useState, useEffect, useContext } from 'react';
import "../../assets/other_css/sidebar.css";
import AuthContext from '../../context/AuthContext';
import { BallTriangle } from 'react-loader-spinner';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

const TestCases = ({ testCases }) => {
    const [displayStatus, setDisplayStatus] = useState(Array(5).fill('loading'));
    const { checkAnswers, resp } = useContext(AuthContext);
    const [toggleStatus, setToggleStatus] = useState(Array(5).fill(false)); // New state to track toggle

    useEffect(() => {
        const timers = displayStatus.map((_, index) => {
            return setTimeout(() => {
                setDisplayStatus(prevStatus => {
                    const newStatus = [...prevStatus];
                    newStatus[index] = checkAnswers[index];
                    return newStatus;
                });
            }, 1000 * (index + 1));
        });

        return () => {
            timers.forEach(clearTimeout); 
        };
    }, [checkAnswers]);

    const handleClick = (index) => {
        setToggleStatus(prevToggleStatus => {
            const newToggleStatus = [...prevToggleStatus];
            newToggleStatus[index] = !newToggleStatus[index];
            return newToggleStatus;
        });
    };

    return (
        <div className="testcases-container">
            {displayStatus.map((status, index) => (
                <div className="child-div" key={index} onClick={() => handleClick(index)}>
                    {status === 'loading' ? (
                        <span className="loader-container">
                            <BallTriangle
                                height={50}
                                width={50}
                                radius={5}
                                color="#4fa94d"
                                ariaLabel="ball-triangle-loading"
                            />
                        </span>
                    ) : status ? (
                        <CheckOutlined style={{ fontSize: '24px', color: 'green' }} />
                    ) : (
                        <CloseOutlined style={{ fontSize: '24px', color: 'red' }} />
                    )}
                    {toggleStatus[index] ? `${testCases[index]} and ${resp[index]}` : `Test Case ${index + 1}`}
                </div>
            ))}
        </div>
    );
};

export default TestCases;
