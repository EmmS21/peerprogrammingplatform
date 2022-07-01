import React, { useState, useContext } from 'react';
import { fetchToken, onMessageListener } from '../../firebase';
import { Button, Toast } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';

const PushNotifications = () => {
    const { onShowNotificationClicked, show, setShow, notification, isTokenFound, setTokenFound } = useContext(AuthContext)
    fetchToken(setTokenFound)

        return (
            <>
                <Toast
                    onClose={() => setShow(false) }
                    show={ show }
                    delay={ 1000 * 30 }
                    autohide
                    onClick={()=> console.log('you clicked this')}
                    animation style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        minWidth: 200
                    }}>
                        <Toast.Header>
                            <strong className="mr-auto">{ notification.title }</strong>
                            <small>just now</small>
                        </Toast.Header>
                        <Toast.Body>{ notification.body }</Toast.Body>
                </Toast>
                <header className="App-header">
                    { isTokenFound && <h3> Notification permission enabled </h3> }
                    { !isTokenFound && <h3> Need notification permission </h3> }
                    <Button onClick={() => onShowNotificationClicked() }> Show Toast </Button>
                </header>
            </>
        );
}

export default PushNotifications;