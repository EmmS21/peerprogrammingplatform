import React, { useContext } from 'react'
import AuthContext from '../../context/AuthContext';
import { Select } from 'semantic-ui-react';
import axios from 'axios';
import WebSocketInstance from '../../websocket/Connect';

const SelectDifficulty = ({setShowSelect, showSelect}) => {
    const { user,
        matchedUserState, driverInState, 
        sortUsersAlphabetically,room_name, 
        participants, difficultySelected,
        challengeInState, profileURL
     } = useContext(AuthContext)
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
        console.log('selection value is', data.value)
        console.log('selection is', selection)
        const base_url = `${profileURL}programming_challenge/${selection}` 
        axios.get(base_url)
        .then(res=>{
            challengeInState.current = res.data
            if(driverInState.current === user.username){
                const dataToSend = {}
                dataToSend["type"] = "send.challenge"
                dataToSend["user"] = matchedUserState.current
                dataToSend["data"] = challengeInState.current
                WebSocketInstance.sendData(JSON.stringify(dataToSend))
                // SecondSocketInstance.sendData(dataToBeSent)
            }
            setShowSelect(false)
        })
        .catch(err=> {
            setShowSelect(true)
            console.log(err)
        })
    }

    return (
    <div>

        {driverInState.current === user.username && <Select 
            placeholder='Select Level of Difficulty' 
            options={difficultyLevels}
            onChange={handleOnChange}
            /> }
        
    </div>
  )
}

export default SelectDifficulty