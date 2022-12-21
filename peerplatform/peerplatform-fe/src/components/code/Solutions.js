import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

function Solutions() {
    let { gptresp, openModal } = useContext(AuthContext);
    return (
        <>
        { openModal ?
            gptresp.current
            :
            "Click get response to see possible answers"
        }
        </>
    )
}

export default Solutions
