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
import { useHistory } from 'react-router-dom';
import "../../assets/other_css/sidebar.css";
import TestCases from './TestCases';
import TimerComponent from './TimerComponent';
import * as esprima from 'esprima';
import estraverse from 'estraverse';
import escodegen from 'escodegen';



//change language based on map
const CodeEditor = () => {
    const { TabPane } = Tabs;
    const [isRightSidebarVisible, setRightSidebarVisible] = useState(false);
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    let {  
          getSolution, isLoadingSolution, 
          sendCodeJudge0, spinnerOn, submitJudge0,
          setSpinnerOn, resp,setCodeResp,
          setResp, codeResp, setOpenModal,  
          contextHolder, challengeInState, codeHelpState,
          showNextChallengeButton, setShowNextChallengeButton,
         } = useContext(AuthContext)
    // let photoURL = user.photo.split('"').join('');
    const [query, setQuery] = useState('');

    // checks to see if select or programming challenge should be shown;
    const [showSelect, setShowSelect] = useState(true)
    const [isCodeHelpModalVisible, setIsCodeHelpModalVisible] = useState(false);
    const [typedText, setTypedText] = useState('');
    const [charIndex, setCharIndex] = useState(0); 
    const [localChallengeInState, setLocalChallengeInState] = useState([]);
    const [pseudoCode, setPseudoCode] = useState('');
    const [editorVal, setEditorVal] = useState(() => {
        const savedEditorVal = localStorage.getItem('editorVal');
        return savedEditorVal ? savedEditorVal : ""; 
      });    
    const [isLoading, setIsLoading] = useState(false);
    const [currentColorIndex, setCurrentColorIndex] = useState(0);
    const colors = ['color-red', 'color-blue', 'color-black', 'color-purple'];
    const [testResults, setTestResults] = useState([]);
    const history = useHistory();
    const editorRef = useRef(null);
    const [showTestCases, setShowTestCases] = useState(false);
    const [submitButtonText, setSubmitButtonText] = useState(
        showTestCases ? 'Close Tests' : 'Submit Code'
    );
    const [waitingForChallenge, setWaitingForChallenge] = useState(false);
    const [waitingForAnswer, setWaitingForAnswer] = useState(false);
    const [challengeInStateToUse, setChallengeInStateToUse] = useState(challengeInState)
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showTimer, setShowTimer] = useState(false);
    const [intervalId, setIntervalId] = useState(null); 
    const [getHelp, setGetHelp] = useState(false)



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


    useEffect(() => {
        if (codeHelpState) {
          setIsCodeHelpModalVisible(true);
        }
      }, [codeHelpState]);


      useEffect(() => {
        const savedChallenge = localStorage.getItem('challenge');
        // console.log('savedChallenge*', savedChallenge, '***')
        const savedCodeResp = localStorage.getItem('codeResp');
        console.log('saved in local', savedCodeResp)
        // console.log('Saved Challenge from localStorage:', savedChallenge);
        if (savedChallenge) {
            const parsedChallenge = JSON.parse(savedChallenge);
            // console.log('parsedChallenge', parsedChallenge, '***')
            if (parsedChallenge.length > 0) {
                setLocalChallengeInState(parsedChallenge);
                // console.log('Setting localChallengeInState from localStorage:', parsedChallenge);
                setShowSelect(false);
                setShowNextChallengeButton(true);
            }
        // Check if the current challenge title is different from the one in localStorage
        if (challengeInState.length > 0 && savedChallenge) {
            // console.log('if', challengeInState, '*****')
            const currentChallengeTitle = challengeInState[0].title;
            const parsedSavedChallenge = JSON.parse(savedChallenge);
            const savedChallengeTitle = parsedSavedChallenge[0].title;
            // console.log('Current Challenge Title:', currentChallengeTitle);
            // console.log('curr', currentChallengeTitle, 'saved', savedChallengeTitle)
            if (currentChallengeTitle !== savedChallengeTitle) {
                // console.log('****', challengeInState, '****')
                // Update localStorage with the new challenge
                localStorage.setItem('challenge', JSON.stringify(challengeInState));
                // console.log('Updating localStorage with new challenge:', challengeInState);

                setLocalChallengeInState(challengeInState);
                console.log('Setting localChallengeInState with the new challenge:', challengeInState);

            } else {
                setLocalChallengeInState(challengeInState);
                // console.log('Setting localChallengeInState from challengeInState:', challengeInState);

            }
        }}
        if (savedCodeResp) {
            // codeResp.current = savedCodeResp; // Assuming setCodeResp is available in context
            setCodeResp(savedCodeResp)
            // console.log('Setting codeResp from localStorage:', savedCodeResp);
        }
    }, []);
    
    useEffect(() => {
        setChallengeInStateToUse(localChallengeInState.length > 0 ? localChallengeInState : challengeInState);
    }, [localChallengeInState, challengeInState]);
    
    // let challengeInStateToUse = localChallengeInState.length > 0 ? localChallengeInState : challengeInState;

    useEffect(() => {
        // Save challengeInState to local storage when it changes
        if (localChallengeInState.length > 0) {
            localStorage.setItem('challenge', JSON.stringify(localChallengeInState));
        }
    }, [localChallengeInState]);

    const toggleTestCases = async () => {
        // console.log("function");
        setRightSidebarVisible(false)
        requestBody.source_code = document.getElementsByClassName('ace_content')[0].innerText
        requestBody.language_id = "63"

        setShowTestCases((prevShow) => {
          const newShow = !prevShow;
          localStorage.setItem('showTestCases', newShow);
          return newShow;
        });

        setSubmitButtonText((prevText) =>
        showTestCases ? 'Submit Code' : 'Close Tests'
        );  
  
        // Match and store the comments in an array
        const regex = /\/\/ Test cases([\s\S]*)/g;
        const matches = editorVal.match(regex);

        // Extract the matched text
        if (matches && matches.length > 0) {
          const textAfterTestCases = matches[0].replace("// Test cases", "").trim();
        //   console.log("Text after // Test cases:", textAfterTestCases);
      
          // Save the extracted text in the variable savedStr
          const savedStr = textAfterTestCases;
          const res = await getSolution(challengeInStateToUse[0], savedStr, 'four')
          const resObj = JSON.parse(res)
          const dataType = resObj.dataType
          const testCases = resObj.output;
        //   console.log('res', testCases)
        //   console.log('type', dataType)
          const valuesArray = testCases.map((testCase) => {
            if (dataType === 'string') {
              return String(testCase);
            } else if (dataType === 'number') {
              return Number(testCase);
            } else if (dataType === 'boolean') {
              return Boolean(testCase);
            } else {
              // Handle other data types as needed
              return testCase; // By default, return the value as is
            }
          });
          requestBody.expected_output = valuesArray

          submitJudge0(requestBody).then((response) => {
            setTestResults(response)
          })
        } else {
        //   console.log("No text found after // Test cases.");
        }              
    };
      
    
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
        setShowTestCases(false)
        const code = requestBody.source_code = document.getElementsByClassName('ace_content')[0].innerText
        // const encodedSourceCode = btoa(encodeURIComponent(code))
        requestBody.source_code = code
        requestBody.language_id = "63"
        requestBody.base64_encoded = true
        console.log('body', requestBody.source_code)
        setSpinnerOn(true)
        setResp('')
        toggleRightSidebar()
        sendCodeJudge0(requestBody)
    }

    const toggleRightSidebar = () => {
        // console.log('triggered')
        setRightSidebarVisible(!isRightSidebarVisible);
        if (!isRightSidebarVisible) {
            setTypedText('');
            setCharIndex(0)
        }
    };

    useEffect(() => {
        let timeoutId;
        // console.log('resp', resp)
        if (isRightSidebarVisible && charIndex < resp.length) {
          timeoutId = setTimeout(() => {
            setTypedText((prevTypedText) => prevTypedText + resp[charIndex]);
            setCharIndex((prevCharIndex) => prevCharIndex + 1);
            // console.log("TypedText value: ", typedText);  // Debugging line
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
    

    //save typed in code to localStorage
    useEffect(() => {
        localStorage.setItem('editorVal', editorVal);
    }, [editorVal]);

    //fetch above code from localStorage
    useEffect(() => {
        const savedEditorVal = localStorage.getItem('editorVal');
        if (savedEditorVal) {
            setEditorVal(savedEditorVal);
        } else if (pseudoCode) {
            setEditorVal(pseudoCode)
        }
    }, [pseudoCode]);
    
    useEffect(() => {
        // console.log('code', codeResp)
        setPseudoCode(codeResp);
    }, [codeResp]);


    function handleOnChange(newValue){
        setEditorVal(newValue)
    }

    function streamHelp (challenge) {
        console.log('streaming', challenge)
        // console.log('challengeInState', challenge)
        const code = document.getElementsByClassName('ace_content')[0].innerText;
        // console.log('code', code)
        getSolution(challenge, code, null)
        // let codeSnapShot = ''
        // let debounceTimer;
        // const captureSnapshot = () => {
        //     const code = document.getElementsByClassName('ace_content')[0].innerText;
        //     console.log('Code Snapshot:', code)
        //     console.log('challengeSending', challenge)
        //     console.log('calling get solution')
        //     getSolution(challenge, code, null)
        // };
        // const editor = document.getElementsByClassName('ace_editor')[0];
        // editor.addEventListener('input', () => {
        //     codeSnapShot = document.getElementsByClassName('ace_content')[0].innerText;

        //     //Debouncing the captureSnapshot function
        //     clearTimeout(debounceTimer);
        //     debounceTimer = setTimeout(() => {
        //         captureSnapshot()
        //     }, 2000)
        // });
        // if(challengeInStateToUse && challengeInStateToUse.length > 0){
        //     captureSnapshot()
        // }
    }
    

    function handleBtnUpdate(){
        setIsLoading(true)
        getSolution(localChallengeInState[0].title, pseudoCode)
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
    
    const handleCloseTests = () => {
        setShowTestCases(false)
        setSubmitButtonText('Submit Code')        
    }
    
    function resetHandler () {
        console.log('de', codeResp)
        setEditorVal(pseudoCode)
    }

    function resetTimer () {
        setElapsedTime(0)
        setShowTimer(0)
        setShowTimer(false)
        localStorage.removeItem('elapsedTime')
    }

        return (
        <>
        <Menu class="w-full" pointing widths={ 6 } size={"medium"} style={{ marginTop:0 }}>
            <Menu.Item className="single-menu-item-container">
                <Button className="btn btn-primary single-full-height-button" 
                        onClick={() => {
                            localStorage.removeItem('challenge');
                            localStorage.removeItem('showTestCases');
                            localStorage.removeItem('editorVal'); 
                            localStorage.removeItem('codeResp');
                            resetTimer()
                            history.push('/')
                        }}>
                        Exit Session
                </Button>
            </Menu.Item>
            <Menu.Item className="single-menu-item-container">
                <Button className="btn btn-primary single-full-height-button" onClick={resetHandler}>
                    Refresh
                </Button>
            </Menu.Item>
            <Menu.Item>
                {
                    showNextChallengeButton ? (
                        <SelectDifficulty 
                            showSelect={showSelect} 
                            setShowSelect={setShowSelect}
                            placeholderText="Next Challenge"
                            onNewChallengeFetched={ async (newChallenge) => {
                                localStorage.removeItem('challenge')
                                setWaitingForChallenge(true)
                                await newChallenge
                                setLocalChallengeInState(newChallenge)
                                setWaitingForChallenge(false)
                            }}
                            newAnswerFetched={ async (newAnswer) => {
                                localStorage.removeItem('editorVal')
                                setWaitingForAnswer(true)
                                await newAnswer
                                setEditorVal(newAnswer)
                                setWaitingForAnswer(false)
                            }}
                        />
                    ): null
                }
            </Menu.Item>
            <Menu.Item className="single-menu-item-container">
                {
                    <Button className="btn btn-primary single-full-height-button" onClick={()=> setSidebarVisible(!isSidebarVisible)}>{ isSidebarVisible ? "Hide Sidebar" : "Show Sidebar" }</Button>
                }
            </Menu.Item>
            <Menu.Item className="single-menu-item-container">
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
                        <TimerComponent 
                        elapsedTime={elapsedTime} 
                        setElapsedTime={setElapsedTime}
                        showTimer={showTimer}
                        setShowTimer={setShowTimer}
                        intervalId={intervalId}
                        setIntervalId={setIntervalId}
                        streamHelp={streamHelp}
                        />
                )}
            </Menu.Item>
            <Menu.Item className="menu-item-container">
                <Button className="btn btn-primary full-height-button" onClick={makeSubmission} disabled={isRightSidebarVisible}>
                    Run Code
                </Button>
                <Button className="btn btn-primary full-height-button" onClick={showTestCases ? handleCloseTests : toggleTestCases}>
                    {submitButtonText}
                </Button>
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
                  setGetHelp(false)
                  setCodeHelpBtn("Code Help");
                }}
                className="close-button"
                >
                X
              </Button>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>
                AI Mentor Clue at {Math.floor(elapsedTime/60)} minute mark
                </div>
            </div>
            <pre style={{ color: 'white' }}>{codeHelpState}</pre>
          </div>
          </div>
        <div className={`col-2 whiteCol my-0 ${!isSidebarVisible ? 'hidden' : ''}`}>
            <Tabs type="card">
                    <TabPane tab="Coding Challenge" key="1">
                        { challengeInStateToUse.length > 0 && <ProgrammingChallenge query={query} challengeInState={challengeInStateToUse}/> }
                    </TabPane> 
                    {/* <TabPane tab="Your Clue" key="2">
                        {challengeInStateToUse.length > 0 && <Solutions challengeInState={challengeInStateToUse} query={editorVal}/>}
                    </TabPane> */}
            </Tabs>
        </div>
           <div className="col-4 ace-editor-container" style={{ marginTop: -20, marginLeft: 10 }}>
            <div className="my-0" style={{ width: editorWidth() }}>
                <AceEditor
                    ref={editorRef}
                    style={{ position: 'fixed', top: '3.5rem', left: isSidebarVisible ? '30%' : '0', width: editorWidth(), height: '100%' }}
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
                        useWorker: true, 
                        vScrollBarAlwaysVisible: true,
                        hScrollBarAlwaysVisible: true,
                        autoScrollEditorIntoView: true,
                        highlightActiveLine: true
                    }} 
                    tabSize={3}
                    wrapEnabled={true}
                    value={isLoadingSolution ? "Fetching new answer, please wait...." : editorVal} 
                />
            </div>
           </div>
           {showTestCases && <TestCases testResults={testResults}/>}
           <div className={`col-2 rightCol ${!isRightSidebarVisible ? 'hidden' : ''}`}>
                <CloseOutlined onClick={()=> setRightSidebarVisible(false)}/>
                <Spinner on={spinnerOn} Spin={Spin}/>
                {resp.split('\n').map((line, index) => (
                    <p key={index} className="line1"> { line } </p>
                ))}
           </div>
        </div>
        </>
        )
}

export default CodeEditor;
