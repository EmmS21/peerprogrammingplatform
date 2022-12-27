import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

function cleanSolution(solution){
    const explIdx = solution.indexOf('Solution');
    const splitSent = solution.slice(explIdx, solution.length)
    return splitSent.split('+')
}
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
