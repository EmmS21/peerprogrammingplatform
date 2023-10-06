import React, { useContext, useEffect } from 'react'
import AuthContext from '../../context/AuthContext';
import { Select, Label } from 'semantic-ui-react';
import axios from 'axios';

const SelectDifficulty = ({setShowSelect, showSelect, placeholderText}) => {
    const { difficultySelected, getSolution, 
        challengeInState, setChallengeInState, profileURL, setShowNextChallengeButton
     } = useContext(AuthContext)


     useEffect(() => {
        if(challengeInState[0] && challengeInState.length > 0){
            const challengeName = challengeInState[0].title
            localStorage.setItem('challenge', JSON.stringify(challengeInState));
            getSolutionHandler(challengeName)
        }
    }, [challengeInState]);

    const difficultyLevels = [
        { key: 'e', value: 'easy', text: 'Easy' },
        { key: 'm', value: 'medium', text: 'Medium' },
        { key: 'h', value: 'hard', text: 'Hard' },
    ]
    function handleOnChange(e, data){
        difficultySelected.current = data.value
        let selection = null
        if(data.value === 'easy'){
            selection = 'get_easy'
        }
        else if(data.value === 'medium'){
            selection = 'get_medium'
        }
        else {
            selection = 'get_hard'
        }
        const base_url = `${profileURL}programming_challenge/${selection}` 
        axios.get(base_url)
        .then(res=>{
            setChallengeInState(res.data)
            setShowSelect(false)
            setShowNextChallengeButton(true)
        })
        .catch(err=> {
            setShowSelect(true)
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
    <div>
        <Label color='blue' horizontal>
            {placeholderText}:
        </Label>
        <Select
            placeholder={placeholderText}
            options={difficultyLevels}
            onChange={handleOnChange}
            /> 
    </div>
  )
}

export default SelectDifficulty