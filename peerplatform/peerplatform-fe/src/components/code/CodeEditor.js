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
import { Steps, Result, 
         Button, Spin, 
         Tabs } from 'antd'
import { AudioOutlined, MessageOutlined, 
        CloseOutlined, CodeOutlined,
        SolutionOutlined } from '@ant-design/icons';
import ClockCounter from '../profile_tabs/ClockCounter';
import ProgrammingChallenge from './ProgrammingChallenges';
import AuthContext from '../../context/AuthContext';
import 'semantic-ui-css/semantic.min.css'
import { Icon, Header, 
         Menu, Button as button,
         Modal, Label} from 'semantic-ui-react';
import { useGlobalState } from '../../context/RoomContextProvider';
import WebSocketInstance from '../../websocket/Connect';



//change language based on map
const CodeEditor = () => {
    const [currentLanguage, setCurrentLanguage] = useState("");
    const [token, setToken] = useState("");
    const output = null;
    const { Step } = Steps;
    const { TabPane } = Tabs;
    const [visible, setVisible] = useState(false);
    const selectLang = useRef(0);
    const [sidebar, setSidebar] = useState(true)
    let { user, logOutUser, 
          matchedUserState, driverInState,
          sendWebSocketData, sortUsersAlphabetically,
          sendCodeJudge0, spinnerOn, 
          setSpinnerOn, resp, 
          setResp,mediaURL
         } = useContext(AuthContext)
    let photoURL = user.photo.split('"').join('');
    const [open, setOpen] = useState(true)
    const [state] = useGlobalState();
    const [query, setQuery] = useState('');
    const [displayCode, setDisplayCode] = useState('');
    const received = useRef([]);
    const [rerender, setRerender] = useState(false)

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

    useEffect((() => {
        WebSocketInstance.response().then((res) => {
            console.log('we are inside response method')
            console.log(`!!! response received: ${JSON.stringify(res)} !!!`)
            var temp = res ? JSON.parse(res.text) : ''
            console.log('temp is', temp)
            received.current = temp ? temp.data : ''
            console.log(`!!in state: ${received.current}!!`)
            setRerender(!rerender);
        })
    }))

    useEffect((() => {
        const codeOutput = setTimeout(() => onChange(query), 1500);
        return () => clearTimeout(codeOutput)
    }), [query])


    function onChange(code){
        const dataToBeSent = matchedUserState.current+','+code
        console.log('matched', matchedUserState.current)
        console.log('sending code', dataToBeSent)
        sendWebSocketData(dataToBeSent)
        // .then( (res) =>{
        //     console.log(`!!! received: ${res} !!!`)
        // })
    }

        return (
        <>
        <Menu class="w-full" pointing widths={ sidebar ? 5 : 6 } size={"tiny"} style={{ marginTop:0 }}>
            <Menu.Item>
                {
                    driverInState.current ?
                        <Label image>
                            Driver: {driverInState.current}
                        </Label>
                        : null
                }
            </Menu.Item>
            <Menu.Item>
                {
                    index < 4 ?
                        <div>Connected
                            <Icon name="microphone"/>
                        </div> :
                        <div>Terminated
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
            <div className={ visible ? "col-2 whiteCol my-0" : "col-3 whiteCol my-0" } style={{ overflow:'scroll', height:400, marginLeft: !visible ? -60 : -20}}>
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
            {
                driverInState.current === user.username ?
            <div className="my-0" style={{ marginLeft: !visible && !sidebar ? -200 : visible && !sidebar ? -100 : sidebar && !visible ? -200 : -100 }}>
                <AceEditor
                    mode={currentLanguage}
                    theme="monokai"
                    name="code_editor"
                    onChange={setQuery}
                    readOnly={driverInState.current === user.username ? false : true}
                    editorProps={{ $blockScrolling: true }}
                    enableLiveAutocompletion={true}
                    width={!visible && !sidebar ? 1200 : visible && !sidebar ? 700 : sidebar && !visible ? 900 : 600}
                />
            </div>
            :
            <div className="my-0" style={{ marginLeft: !visible && !sidebar ? -200 : visible && !sidebar ? -100 : sidebar && !visible ? -200 : -100 }}>
                <AceEditor
                    mode={currentLanguage}
                    theme="monokai"
                    name="code_editor"
                    value={received.current.length ? received.current : ''}
                    onChange={setQuery}
                    readOnly={driverInState.current === user.username ? false : true}
                    editorProps={{ $blockScrolling: true }}
                    enableLiveAutocompletion={true}
                    width={!visible && !sidebar ? 1200 : visible && !sidebar ? 700 : sidebar && !visible ? 900 : 600}
                />
            </div>

            }
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

