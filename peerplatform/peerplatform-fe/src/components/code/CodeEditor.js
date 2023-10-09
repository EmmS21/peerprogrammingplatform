import React, { useState, useContext, useEffect, useRef } from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/python';
import 'brace/mode/javascript';
import 'brace/mode/sql';
//import spinner
import Spinner from './Spinner';
//import themes
import 'brace/theme/monokai';
//import tabs components
import "antd/dist/antd.css";
import { Button, Spin, Tabs  } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import ProgrammingChallenge from './ProgrammingChallenges';
import SelectDifficulty from './SelectDifficulty';
import AuthContext from '../../context/AuthContext';
import 'semantic-ui-css/semantic.min.css'
import { Menu } from 'semantic-ui-react';
import Solutions from './Solutions';
import { useHistory } from 'react-router-dom';
import "../../assets/other_css/sidebar.css";
import { throttle } from 'lodash';



//change language based on map
const CodeEditor = () => {
    const { TabPane } = Tabs;
    const [isRightSidebarVisible, setRightSidebarVisible] = useState(false);
    const selectLang = useRef(0);
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    let {  
          getSolution,
          sendCodeJudge0, spinnerOn, 
          setSpinnerOn, resp,setCodeResp,
          setResp, codeResp, setOpenModal,  
          contextHolder, challengeInState, codeHelpState,
          showNextChallengeButton, setShowNextChallengeButton
         } = useContext(AuthContext)
    // let photoURL = user.photo.split('"').join('');
    const [query, setQuery] = useState('');

    // checks to see if select or programming challenge should be shown;
    const [showSelect, setShowSelect] = useState(true)
    const [showCodeHelp, setShowCodeHelp] = useState(false);
    const [isCodeHelpModalVisible, setIsCodeHelpModalVisible] = useState(false);
    const [typedText, setTypedText] = useState('');
    const [charIndex, setCharIndex] = useState(0); // Index for the current character to type
    const [localChallengeInState, setLocalChallengeInState] = useState([]);
    const [editorValue, setEditorValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentColorIndex, setCurrentColorIndex] = useState(0);

    const colors = ['color-red', 'color-blue', 'color-black', 'color-purple'];


    const history = useHistory();
    const editorRef = useRef(null);

    useEffect(() => {
        // Function to change the current color index randomly
        const changeColor = () => {
          setCurrentColorIndex(Math.floor(Math.random() * colors.length));
        };
    
        // Set an interval to change the color every 2 seconds
        const interval = setInterval(changeColor, 2000);
    
        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
      }, []);


    //change language in select options
    //map language id to language
    const languageMap = {
        70: "python",
        63: "javascript",
        62: "java"
    }

    useEffect(() => {
        if (codeHelpState) {
          setIsCodeHelpModalVisible(true);
        }
      }, [codeHelpState]);

      

      useEffect(() => {
        const savedChallenge = localStorage.getItem('challenge');
        const savedCodeResp = localStorage.getItem('codeResp');
        console.log('Saved Challenge from localStorage:', savedChallenge);
        if (savedChallenge) {
            const parsedChallenge = JSON.parse(savedChallenge);
            if (parsedChallenge.length > 0) {
                setLocalChallengeInState(parsedChallenge);
                console.log('Setting localChallengeInState from localStorage:', parsedChallenge);
                setShowSelect(false);
                setShowNextChallengeButton(true);
            }
        // Check if the current challenge title is different from the one in localStorage
        if (challengeInState.length > 0 && savedChallenge) {
            const currentChallengeTitle = challengeInState[0].title;
            const parsedSavedChallenge = JSON.parse(savedChallenge);
            const savedChallengeTitle = parsedSavedChallenge[0].title;
            console.log('Current Challenge Title:', currentChallengeTitle);
            console.log('Saved Challenge Title from localStorage:', savedChallengeTitle);
    

            if (currentChallengeTitle !== savedChallengeTitle) {
                // Update localStorage with the new challenge
                localStorage.setItem('challenge', JSON.stringify(challengeInState));
                console.log('Updating localStorage with new challenge:', challengeInState);

                setLocalChallengeInState(challengeInState);
                console.log('Setting localChallengeInState with the new challenge:', challengeInState);

            } else {
                setLocalChallengeInState(challengeInState);
                console.log('Setting localChallengeInState from challengeInState:', challengeInState);

            }
        }            // Avoid setting challengeInState here to prevent overwriting it
            // setChallengeInState(parsedChallenge);
            // You can uncomment this line if necessary, but make sure it doesn't
            // overwrite the correct value of challengeInState.
        }
        if (savedCodeResp) {
            // codeResp.current = savedCodeResp; // Assuming setCodeResp is available in context
            setCodeResp(savedCodeResp)
            console.log('Setting codeResp from localStorage:', savedCodeResp);
        }
    }, []);
    
    const challengeInStateToUse = localChallengeInState.length > 0 ? localChallengeInState : challengeInState;

    useEffect(() => {
        // Save challengeInState to local storage when it changes
        if (localChallengeInState.length > 0) {
            localStorage.setItem('challenge', JSON.stringify(localChallengeInState));
        }
    }, [localChallengeInState]);
    
  
    
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
    
    // const changeLanguageHandler = (e) => {
    //     selectLang.current = e.target.value
    //     setCurrentLanguage(languageMap[selectLang.current])
    // }
    //handle submission
    const makeSubmission = (e) => {
        e.preventDefault();
        requestBody.source_code = document.getElementsByClassName('ace_content')[0].innerText
        console.log('resq', requestBody.source_code)
        requestBody.language_id = "63"
        console.log('body', requestBody)
        setSpinnerOn(true)
        setResp('')
        toggleRightSidebar()
        sendCodeJudge0(requestBody)
    }

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const toggleRightSidebar = () => {
        setRightSidebarVisible(!isRightSidebarVisible);
        if (!isRightSidebarVisible) {
            setTypedText('');
            setCharIndex(0)
        }
    };

    useEffect(() => {
        let timeoutId;
        console.log('resp', resp)
        if (isRightSidebarVisible && charIndex < resp.length) {
          timeoutId = setTimeout(() => {
            setTypedText((prevTypedText) => prevTypedText + resp[charIndex]);
            setCharIndex((prevCharIndex) => prevCharIndex + 1);
            console.log("TypedText value: ", typedText);  // Debugging line
          }, 5);
        }
        return () => {
          clearTimeout(timeoutId);
        };
    }, [isRightSidebarVisible, charIndex]);

    const editorWidth = () => {
        let width = '100%';
        if (isSidebarVisible && isRightSidebarVisible) {
          width = 'calc(100% - 60%)'; // 30% for each sidebar
        } else if (isSidebarVisible || isRightSidebarVisible) {
          width = 'calc(100% - 30%)'; // 30% for one sidebar
        }
        return width;
    };

    //handles changing clock timer
    const array = [10,11,12,13];
    const [key, setKey] = useState(1);
    const [index, setIndex] = useState(1);
    const [timer, setTimer] = useState(array[0]);
    const [codeHelpBtn, setCodeHelpBtn] = useState("Code Help")
    

    useEffect(() => {
        setEditorValue(codeResp);
    }, [codeResp]);

    function handleOnChange(newValue){
        setEditorValue(newValue)
    }
    

    function handleBtnUpdate(){
        setIsLoading(true)
        getSolution(localChallengeInState[0].title, editorValue)
            .then(() => {

            })
            .catch((error) => {
                console.error('error', error)
            })
            .finally(() => {
                setIsLoading(false)
            })
        setCodeHelpBtn("Please wait...")
    }

    const onLoad = (editor) => {
        editorRef.current = editor;
        console.log("Editor Ref: ", editorRef.current);  // Log the ref object
        const session = editor.getSession();
        console.log('session', session)
    
        editor.on('click', function(e) {
            const cursor = editor.getCursorPosition();
            const lines = session.getDocument().getAllLines();
    
            let withinPair = false;
            let afterLastPair = false;
    
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('//add code here')) {
                    withinPair = true;
                } else if (lines[i].includes('//**')) {
                    withinPair = false;
                    afterLastPair = true;
                }
    
                if (withinPair && cursor.row === i) {
                    console.log("Clicked between // add code and //**");
                    editor.setReadOnly(false);
                    console.log('***', editor['$readOnly'])
                } else if (!withinPair && cursor.row === i) {
                    console.log("Clicked outside of // add code and //**");
                    editor.setReadOnly(true);
                    console.log('***2', editor['$readOnly'])
                }
                if (afterLastPair && cursor.row >=i) {
                    console.log("End");
                    editor.setReadOnly(false);
                }
            }
        });
    };
        

        return (
        <>
        <Menu class="w-full" pointing widths={ 5 } size={"tiny"} style={{ marginTop:0 }}>
            <Menu.Item>
                <Button onClick={() => history.push(history.location.pathname.replace('/rooms', ''))}>Back</Button>
            </Menu.Item>
            <Menu.Item>
                {
                    <Button onClick={()=> setSidebarVisible(!isSidebarVisible)}>{ isSidebarVisible ? "Hide Sidebar" : "Show Sidebar" }</Button>
                }
            </Menu.Item>
            <Menu.Item>
            {isLoading ? (
                <span>
                Please Wait
                <span className="bouncing-dots">
                    {Array.from({ length: 4 }, (_, index) => (
                    <span
                        key={index}
                        className={`dot ${colors[(currentColorIndex + index) % colors.length]}`}
                        style={{ animationDelay: `${0.5 * index}s` }}
                    >
                        .
                    </span>
                    ))}
                </span>
                </span>
                ) : (
                <Button onClick={handleBtnUpdate}>Help me</Button>
            )}
            </Menu.Item>
            <Menu.Item>
                {
                    showNextChallengeButton ? (
                        <SelectDifficulty 
                            showSelect={showSelect} 
                            setShowSelect={setShowSelect}
                            placeholderText="Next Challenge"
                            onNewChallengeFetched={(newChallenge) => setLocalChallengeInState(newChallenge)}
                        /> 
                    ): null
                }
            </Menu.Item>
            <Menu.Item>
                <Button className="btn btn-primary" onClick={makeSubmission}> Run Code</Button>
            </Menu.Item>
        </Menu>
        <div className="row">
        { contextHolder }
        <div className={`col-4 code-editor-col ${isCodeHelpModalVisible ? 'code-help-visible' : ''}`} style={{ marginTop: -20, marginLeft: 10 }}>
          <div className="my-0 code-help-div">
            <div className="code-help-header">
              <Button
                key="close"
                onClick={() => {
                  setIsCodeHelpModalVisible(false);
                  setOpenModal(false);
                  setCodeHelpBtn("Code Help");
                }}
              >
                Close
              </Button>
            </div>
            <pre style={{ color: 'white' }}>{codeHelpState}</pre>
          </div>
          </div>
        <div className={`col-2 whiteCol my-0 ${!isSidebarVisible ? 'hidden' : ''}`}>
            <Tabs type="card">
                    <TabPane tab="Coding Challenge" key="1">
                        {challengeInStateToUse.length > 0 && <ProgrammingChallenge query={query} challengeInState={challengeInStateToUse}/>}
                        <div style={{ display: showSelect ? 'block' : 'none' }}>
                            <SelectDifficulty 
                                showSelect={showSelect} 
                                setShowSelect={setShowSelect}
                                placeholderText="Select Difficulty"
                            /> 
                        </div>
                    </TabPane> 
                    <TabPane tab="Your Clue" key="2">
                    {challengeInStateToUse.length > 0 && <Solutions challengeInState={challengeInStateToUse} query={editorValue}/>}
                    </TabPane>
            </Tabs>
        </div>
           <div className="col-4" style={{ marginTop: -20, marginLeft: 10 }}>
            <div className="my-0" style={{ marginLeft: !isRightSidebarVisible && !isSidebarVisible ? -50 : isRightSidebarVisible && !isSidebarVisible ? -10 : isSidebarVisible && !isRightSidebarVisible ? 0 : 100 }}>
                <AceEditor
                    ref={editorRef}
                    style={{ position: 'fixed', top: '3.5rem', left: isSidebarVisible ? '30%' : '0', width: editorWidth(), height: 'calc(100% - 3.5rem)' }}
                    mode={'javascript'}
                    onChange={handleOnChange}
                    theme="monokai"
                    name="code_editor"
                    editorProps={{ $blockScrolling: Infinity }}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: false,
                        enableSnippets: true,
                        animatedScroll: false,
                        useWorker: true, // Autocompletion
                    }} 
                    tabSize={3}
                    wrapEnabled={true}
                    value={editorValue}
                    onLoad={editor => onLoad(editor)}
                />
            </div>
           </div>
           <div className={`col-2 rightCol ${!isRightSidebarVisible ? 'hidden' : ''}`}>
                <CloseOutlined onClick={()=> setRightSidebarVisible(false)}/>
                <Spinner on={spinnerOn} Spin={Spin}/>
                <p className="line1"> { resp } </p>
           </div>
        </div>
        </>
        )
}

export default CodeEditor;
