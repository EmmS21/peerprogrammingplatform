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
import { AudioOutlined, MessageOutlined, 
        CloseOutlined, CodeOutlined,
        SolutionOutlined } from '@ant-design/icons';
import ClockCounter from '../profile_tabs/ClockCounter';
import { Tabs } from 'antd';
import ProgrammingChallenge from './ProgrammingChallenges';
import AuthContext from '../../context/AuthContext';
import 'semantic-ui-css/semantic.min.css'
import { Card, Icon, Image, Header, Menu } from 'semantic-ui-react';



//change language based on map
const CodeEditor = () => {
    const [currentLanguage, setCurrentLanguage] = useState("");
    const [token, setToken] = useState("");
    const output = null;
    const { Step } = Steps;
    const { TabPane } = Tabs;
    const { retrieveChallenge, challengeInState, sendCodeJudge0, spinnerOn, setSpinnerOn, resp, setResp } = useContext(AuthContext)
    const [visible, setVisible] = useState(false);
    const selectLang = useRef(0);
    const [sidebar, setSidebar] = useState(true)
    let { user, logOutUser } = useContext(AuthContext)
    let photoURL = user.photo.split('"').join('');
    let baseURL = "https://codesquad.onrender.com/media/";

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
        <Menu pointing widths={ 10 } size={"tiny"} style={{ marginTop:0 }}>
            <Menu.Item>
                {
                    index < 4 ?
                        <div>Call connected
                            <Icon name="microphone"/>
                        </div> :
                        <div>Call Terminated
                            <Icon name="microphone slash"/>
                        </div>
                }
            </Menu.Item>
            <Menu.Item>
                {
                    <Button onClick={()=> setSidebar(!sidebar)}>{ sidebar ? "Hide Sidebar" : "Show Sidebar" }</Button>
                }
            </Menu.Item>
            {
                !sidebar ?
                <Menu.Item>
                    <div>{
                        index === 1 ? <Header as='h2' color='blue' style={{ fontSize: '15px' }} icon={<AudioOutlined/>} content='Time for introductions' />
                        : index === 2 ? <Header as='h2' color='orange' style={{ fontSize: '15px' }} icon={<MessageOutlined/>} content='Time to pseudocode potential solutions' />
                        : index === 3 ? <Header as='h2' color='blue' style={{ fontSize: '15px' }} icon={<CodeOutlined/>} content='Time to Code' />
                        : index === 4 ? <Header as='h2' color='green' style={{ fontSize: '15px' }} icon={<SolutionOutlined/>} content="If you don't already have a working solution, time to find one and rebuild it" />:
                        null    
                    } 
                    </div>
                </Menu.Item> : null
            } 
            <Menu.Item> 
                <div className='clockItem'>
                    <ClockCounter timer={timer} key={key} handleComplete={handleComplete} index={index} Result={Result} Button={Button} />
                </div>
            </Menu.Item>
            <Menu.Item>
                <Button className="btn btn-primary" onClick={makeSubmission}> Run Code</Button>
            </Menu.Item>
        </Menu>
        <div className="row">
        { sidebar ? (
            <div className={ visible ? "col-2 whiteCol my-0" : "col-3 whiteCol my-0" } style={{  marginLeft: !visible ? -60 : -20}}>
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
           <div className="col-4" style={{ marginTop: -20 }}>
            <div className="select-dropdown">
                <select
                    aria-label="Default select example"
                    onChange={changeLanguageHandler}
                 >
                    <option selected>Select language</option>
                    <option value="70">Python</option>
                    <option value="63">Javascript</option>
                    <option value="62">Java</option>
                </select>
            </div>
            <div className="my-0" style={{ marginLeft: !visible && !sidebar ? -200 : visible && !sidebar ? -100 : sidebar && !visible ? -200 : -100 }}>
                <AceEditor
                    mode={currentLanguage}
                    theme="monokai"
                    name="code_editor"
                    editorProps={{ $blockScrolling: true }}
                    enableLiveAutocompletion={true}
                    width={!visible && !sidebar ? 1200 : visible && !sidebar ? 700 : sidebar && !visible ? 900 : 600}
                />
            </div>
           </div>
           {
            visible ? (
           <div className ="col-2">
                <CloseOutlined onClick={()=> setVisible(false)}/>
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

