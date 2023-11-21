import React, { useContext, useState } from 'react'
import AuthContext from '../../context/AuthContext';
import { Button, Select } from 'antd'
import axios from 'axios';
import "../../assets/other_css/sidebar.css";


const SelectDifficulty = ({setShowSelect, newAnswerFetched, placeholderText, onNewChallengeFetched}) => {
    const { getSolution, 
        profileURL, setShowNextChallengeButton,
        setLoadingCode
     } = useContext(AuthContext)
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const selectWidth = selectedDifficulty ? '50%' : '100%';


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
        .then( async (res)=>{
            console.log('res', res.data)
            if (onNewChallengeFetched){
                console.log('resData SelectDiff', res.data)
                const challenge = { 'title': res.data[0].title,
                                    'place': res.data[0].place
                                }
                let explanationRes = await getSolution(challenge, null, "three")
                explanationRes = explanationRes.replace(/\n/g, ' ');
                explanationRes = JSON.stringify(explanationRes)
                console.log('explanationRes***', explanationRes)
                res.data[0].extra_explain = JSON.parse(explanationRes);
                let answerRes = await getSolution(res.data[0], null, "one")   
                console.log('resData', res.data)
                console.log('answerRes', answerRes)    
                onNewChallengeFetched(res.data)
                newAnswerFetched(answerRes)
            }
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

    return (
        <Button className="btn btn-primary single-full-height-button" onClick={handleOnChange}>{placeholderText}</Button>
    // <div style={{ display: 'flex', alignItems: 'center', height: '100%' }} className="full-height-container">
    //     {/* <Select
    //         placeholder={'Select'}
    //         options={difficultyLevels}
    //         onChange={(e, data) => setSelectedDifficulty(data.value)}
    //         style={{ width: selectWidth}} 
    //     />  */}
    // </div>
  )
}

export default SelectDifficulty