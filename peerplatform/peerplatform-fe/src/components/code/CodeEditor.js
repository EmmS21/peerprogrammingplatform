import React, { useState, useContext, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import Split from 'react-split';
//import { split as SplitEditor } from 'react-ace';
import AceEditor from 'react-ace';
import axios from 'axios'
//import scss styling
import "../../assets/other_css/codeeditor.css";
//import languages
import 'brace/mode/python';
import 'brace/mode/javascript';
import 'brace/mode/sql';
//import spinner
import Spinner from  './Spinner';
//import themes
import 'brace/theme/monokai';
//import tabs components
import ProfileTabs from '../profile_tabs/ProfileTab';
import "antd/dist/antd.css";
import { Steps, Result, Button, Spin } from 'antd'
import { AudioOutlined, MessageOutlined, CloseOutlined, MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import ClockCounter from '../profile_tabs/ClockCounter';
import { Tabs } from 'antd';
import ProgrammingChallenge from './ProgrammingChallenges';
import AuthContext from '../../context/AuthContext';

//change language based on map
const CodeEditor = () => {
    const [currentLanguage, setCurrentLanguage] = useState("");
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const output = null;
    const { Step } = Steps;
    const { TabPane } = Tabs;
    const { retrieveChallenge, challengeInState, sendCodeJudge0, spinnerOn, setSpinnerOn, resp, setResp } = useContext(AuthContext)
    const [visible, setVisible] = useState(false);
    const selectLang = useRef(0);
    const [sidebar, setSidebar] = useState(true)

 
    //change language in select options
    //map language id to language
    const languageMap = {
        70: "python",
        63: "javascript",
        62: "java"
    }
    
    let requestBody = {
        "source_code": "",
        "language_id": "70",
        "number_of_runs": null,
        "stdin": "Judge0",
        "expected_output": null,
        "cpu_time_limit": null,
        "cpu_extra_time": null,
        "wall_time_limit": null,
        "memory_limit": null,
        "stack_limit": null,
        "max_processes_and_or_threads": null,
        "enable_per_process_and_thread_time_limit": null,
        "enable_per_process_and_thread_memory_limit": null,
        "max_file_size": null,
        "enable_network": null
    }
    
    const changeLanguageHandler = (e) => {
        selectLang.current = e.target.value
        setCurrentLanguage(languageMap[selectLang.current])
        
    }
    //handle submission
    const makeSubmission = (e) => {
        e.preventDefault();
        requestBody.source_code = document.getElementsByClassName('ace_content')[0].innerText
        requestBody.language_id = selectLang.current
        console.log(`what is being sent, language:${requestBody.language_id}, everything: ${requestBody}`)
        setSpinnerOn(true)
        setResp('')
        setVisible(true)
        sendCodeJudge0(requestBody)
    }

    //handles changing clock timer
    const array = [10,11,12,13];
    const [key, setKey] = useState(1);
    const [index, setIndex] = useState(1);
    const [timer, setTimer] = useState(array[0]);

    //event handler to change clock timer based on index
    const handleComplete = () => {
        setIndex(index + 1);
        setTimer(array[index]);
        setKey(key+1)
    }

        return (
        <>
        <div className='h-1/5 '>
            <ClockCounter timer={timer} key={key} handleComplete={handleComplete} index={index} Result={Result} Button={Button} />
        </div>
        <div className="fixed top-0 left-10 right-20"  onClick={()=> setSidebar(!sidebar)}>{ sidebar ? <MinusSquareOutlined/> : <PlusSquareOutlined/> }</div>
        <div className="row">
        { sidebar ? (
            <div className="col-4 whiteCol">
                <Tabs type="card">
                    <TabPane tab="Stages" key="1">
                        <ProfileTabs index={index}/>
                    </TabPane>
                    <TabPane tab="Coding Challenge" key="2">
                        <ProgrammingChallenge/>
                    </TabPane>
                </Tabs>
            </div>
            ): null
        }
           <div className="col-4">
            <div className="select-dropdown">
                <select
                    aria-label="Default select example"
                    onChange={changeLanguageHandler}
                 >
                    <option selected>Select your language</option>
                    <option value="70">Python</option>
                    <option value="63">Javascript</option>
                    <option value="62">Java</option>
                </select>
            </div>
                <AceEditor
                    mode={currentLanguage}
                    theme="monokai"
                    name="code_editor"
                    editorProps={{ $blockScrolling: true }}
                    enableLiveAutocompletion={true}
                    width={!visible && !sidebar ? 1000 : visible && !sidebar ? 700 : sidebar && !visible ? 700 : 500}
                />
                <button className="btn btn-primary" onClick={makeSubmission}> Run</button>
           </div>
           {
            visible ? (
           <div className="col-2">
                <CloseOutlined onClick={()=> setVisible(false)}/>
                <h4>Output</h4>
                <Spinner on={spinnerOn} Spin={Spin}/>
                <p className="line1"> { resp } </p>
           </div>
            ) : null
           }
        </div>
        </>
        )
}

export default CodeEditor;

