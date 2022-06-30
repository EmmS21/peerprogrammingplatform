import React, { useState, useContext } from 'react';
import { fetchToken, onMessageListener } from '../../firebase';
import { Button, Toast } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';

const PushNotifications = () => {
//    const [show, setShow] = useState(false);
    const { onShowNotificationClicked, show, setShow, notification, isTokenFound, setTokenFound } = useContext(AuthContext)
//    const [notification, setNotification] = useState({title: '', body: ''});
//    const [isTokenFound, setTokenFound] = useState(false);
    fetchToken(setTokenFound)

//    onMessageListener().then(payload => {
//        setNotification({ title: payload.notification.title,
//                          body: payload.notification.body })
//        setShow(true);
//        console.log(payload);
//    }).catch(err => console.log('failed: ', err));
//
//    const onShowNotificationClicked = () => {
//        setNotification({ title: "Notification",
//                          body: "This is a test notification" })
//        setShow(true);
//    }

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
                    { isTokenFound && <h1> Notification permission enabled </h1> }
                    { !isTokenFound && <h1> Need notification permission </h1> }
                    <Button onClick={() => onShowNotificationClicked() }> Show Toast </Button>
                </header>
            </>
        );
}

export default PushNotifications;