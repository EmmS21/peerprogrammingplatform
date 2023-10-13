import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/AuthContext';
import { Button, Select } from 'antd'
import axios from 'axios';

const SelectDifficulty = ({setShowSelect, showSelect, placeholderText, onNewChallengeFetched}) => {
    const { difficultySelected, getSolution, 
        challengeInState, setChallengeInState, 
        profileURL, setShowNextChallengeButton,
        setLoadingCode
     } = useContext(AuthContext)
    const [selectedDifficulty, setSelectedDifficulty] = useState(''); // <-- New state variable



    //  useEffect(() => {
    //     if(challengeInState[0] && challengeInState.length > 0){
    //         const challengeName = challengeInState[0].title
    //         localStorage.setItem('challenge', JSON.stringify(challengeInState));
    //         getSolutionHandler(challengeName)
    //     }
    // }, [challengeInState]);

    const difficultyLevels = [
        { key: 'e', value: 'easy', text: 'Easy' },
        { key: 'm', value: 'medium', text: 'Medium' },
        { key: 'h', value: 'hard', text: 'Hard' },
    ]
    function handleOnChange(){
        let selection = null
        if(selectedDifficulty === 'easy'){
            selection = 'get_easy'
        }
        else if(selectedDifficulty === 'medium'){
            selection = 'get_medium'
        }
        else {
            selection = 'get_hard'
        }
        const base_url = `${profileURL}programming_challenge/${selection}`
        setLoadingCode(true) 
        axios.get(base_url)
        .then(res=>{
            console.log('res', res.data)
            setChallengeInState(res.data)
            if (onNewChallengeFetched){
                onNewChallengeFetched(res.data)
                getSolution(res.data[0].title, null, "one")
            }
            console.log('challengIn', challengeInState)
            setShowSelect(false)
            setShowNextChallengeButton(true)
            setLoadingCode(false)
            setSelectedDifficulty('')
        })
        .catch(err=> {
            setShowSelect(true)
            setLoadingCode(false)
            console.log(err)
        })
    }
    async function getSolutionHandler(challengeName){
        try {
            await getSolution(challengeName)
        } catch(error){
            console.error('Error fetching the solution:', error)
        } 
    }
    return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <Select
            placeholder={'Select'}
            options={difficultyLevels}
            onChange={(e, data) => setSelectedDifficulty(data.value)}
            style={{ width: '50%' }} 
        /> 
        <Button onClick={handleOnChange}>{placeholderText}</Button>
    </div>
  )
}

export default SelectDifficulty