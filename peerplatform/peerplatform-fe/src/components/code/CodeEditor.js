import React, { useState, useContext, useEffect, useRef } from 'react';
//import { split as SplitEditor } from 'react-ace';
import AceEditor from 'react-ace';
//import scss styling
import "../../assets/other_css/codeeditor.css";
//import languages
import 'brace/mode/python';
import 'brace/mode/javascript';
import 'brace/mode/sql';
//import spinner
import Spinner from './Spinner';
//import themes
import 'brace/theme/monokai';
//import tabs components
import ProfileTabs from '../profile_tabs/ProfileTab';
import "antd/dist/antd.css";
import { Steps, Result, 
         Button, Spin, 
         Tabs, Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import ClockCounter from '../profile_tabs/ClockCounter';
import ProgrammingChallenge from './ProgrammingChallenges';
import SelectDifficulty from './SelectDifficulty';
import AuthContext from '../../context/AuthContext';
import 'semantic-ui-css/semantic.min.css'
import { Menu } from 'semantic-ui-react';
import Solutions from './Solutions';
import { useHistory } from 'react-router-dom';


//change language based on map
const CodeEditor = () => {
    const { TabPane } = Tabs;
    const [visible, setVisible] = useState(false);
    const selectLang = useRef(0);
    const [sidebar, setSidebar] = useState(true)
    let {  
          matchedUserState, getSolution,
          sendCodeJudge0, spinnerOn, 
          setSpinnerOn, resp, 
          setResp, setChallengeInState,
          setOpenModal, setCurrentLanguage, currentLanguage, 
          contextHolder, challengeInState, codeHelpState,
          formattedChallengeName, inputArr,
          outputArr, showNextChallengeButton, setShowNextChallengeButton
         } = useContext(AuthContext)
    // let photoURL = user.photo.split('"').join('');
    const [query, setQuery] = useState('');
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    // checks to see if select or programming challenge should be shown;
    const [showSelect, setShowSelect] = useState(true)
    const [showCodeHelp, setShowCodeHelp] = useState(false);
    const [isCodeHelpModalVisible, setIsCodeHelpModalVisible] = useState(false);
    const history = useHistory();


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
        if (savedChallenge) {
        setShowSelect(false);  
        setChallengeInState(JSON.parse(savedChallenge))
        setShowNextChallengeButton(true)
        getSolution(JSON.parse(savedChallenge)[0].title)
        // console.log('ch', JSON.parse(savedChallenge),'434')
        // console.log(challengeInState)
        }
    }, []);
  
    
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

    // const runTest = () => {
    //     const challengeName = formattedChallengeName;
    //     let codeFromEditor = document.getElementsByClassName('ace_content')[0].innerText;
    //     const examples = inputArr.map((example) => example.replace(/\n/g, ''))
    //                             .map((example) => example.split(/,\s(?![^[\]{}()]*\))/))
    //                             .map((argsArray) => {
    //                                 const argNames = [];
    //                                 const argValues = [];
    //                                 argsArray.forEach((arg) => {
    //                                     const [name, value] = arg.split('=');
    //                                     argNames.push(name.trim());
    //                                     argValues.push(parseValue(value.trim())); // Trim whitespace around the argument value
    //                                 });
    //                                 return { argNames, argValues };
    //                             });
    //     const outputExamples = outputArr.map((output) => {
    //                                 // Remove newline characters and extra single quotes
    //                                 const cleanedOutput = output.replace(/\n|'|"|:| /g, '');
    //                                 // Remove the colon and space after it before splitting
    //                                 const cleanedOutputWithoutColon = cleanedOutput.replace(/:\s/g, '');
    //                                 return cleanedOutputWithoutColon.split(/,\s(?![^[\]{}()]*\))/);
    //                             }).map((argsArray) => {
    //                                 const outputVals = argsArray.map((arg) => parseValue(arg.trim())); // Trim whitespace and parse values
    //                                 return { outputVals };
    //                             });
    //     examples.forEach((example, index) => {
    //                                 const testArguments = example.argNames.map((argName, argIndex) => `${argName}=${JSON.stringify(example.argValues[argIndex])}`).join(', ');
    //                                 const testFunctionCall = `console.log(${challengeName}(${testArguments}))`;
    //                                 codeFromEditor += '\n' + testFunctionCall;
    //                             });      
    //     console.log('code****', codeFromEditor)                        
    
    //     // console.log('examples inside Code Editor', examples, 'type', typeof examples);
    //     //  console.log('outputExamples inside Code Editor', outputExamples, 'type', typeof outputExamples);
                                
    //     // // Iterate through examples and log argNames and argValues separately
    //     // examples.forEach((example, index) => {
    //     //     console.log(`Example ${index + 1}:`);
    //     //     console.log('argNames:', example.argNames);
    //     //     console.log('argValues:', example.argValues);
    //     // });
    //     // outputExamples.forEach((outputExample, index) => {
    //     //     console.log(`Output Example ${index + 1}:`);
    //     //     console.log('outputVals:', outputExample.outputVals);
    //     // });
    // }
    
    // function parseValue(value) {
    //     if (typeof value === 'undefined') {
    //         return undefined; // Handle the case where value is undefined
    //     }
    //     value = value.replace(/"/g, '');

    //     if (value.startsWith('[') && value.endsWith(']')) {
    //         // Value is wrapped in square brackets, possibly an array
    //         try {
    //             const parsedValue = JSON.parse(value);
    //             if (Array.isArray(parsedValue)) {
    //                 return parsedValue.map(parseValue); // Recursively parse values within the array
    //             } else {
    //                 return parsedValue;
    //             }
    //         } catch (error) {
    //             // Handle parsing error (e.g., if the input is not valid JSON)
    //             return value; // Return the original value as a string
    //         }
    //     } else if (value.startsWith('{') && value.endsWith('}')) {
    //         // Value is wrapped in curly braces, possibly an object
    //         try {
    //             const parsedValue = JSON.parse(value);
    //             if (typeof parsedValue === 'object') {
    //                 // Recursively parse values within the object
    //                 const result = {};
    //                 for (const key in parsedValue) {
    //                     result[key] = parseValue(parsedValue[key]);
    //                 }
    //                 return result;
    //             } else {
    //                 return parsedValue;
    //             }
    //         } catch (error) {
    //             // Handle parsing error (e.g., if the input is not valid JSON)
    //             return value; // Return the original value as a string
    //         }
    //     } else if (!isNaN(value)) {
    //         // Value is a number
    //         return parseFloat(value);
    //     } else {
    //         // Value is not wrapped in [], {}, or a number, treat it as a string
    //         return value;
    //     }
    // }
    
    //handles changing clock timer
    const array = [10,11,12,13];
    const [key, setKey] = useState(1);
    const [index, setIndex] = useState(1);
    const [timer, setTimer] = useState(array[0]);
    const [codeHelpBtn, setCodeHelpBtn] = useState("Code Help")
    
    //event handler to change clock timer based on index
    const handleComplete = () => {
        setIndex(index + 1);
        setTimer(array[index]);
        setKey(key+1)
    }

    useEffect((() => {
        const codeOutput = setTimeout(() => onChange(query), 1500);
        return () => clearTimeout(codeOutput)
    }), [query])

    useEffect(() => {
        // Function to handle updates to resize event
        function handleResize() {
          setWindowHeight(window.innerHeight);
        }
        // Attach the event listener
        window.addEventListener('resize', handleResize);
        // Detach the event listener on cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []); 

    function onChange(code){
        const dataToBeSent = {}
        dataToBeSent['type'] = "send.message"
        dataToBeSent['user'] = matchedUserState.current
        dataToBeSent['data'] = code        
    }

    function handleBtnUpdate(title, query){
        getSolution(challengeInState[0].title,query)
        setCodeHelpBtn("Please wait...")
    }

        return (
        <>
        <Menu class="w-full" pointing widths={ 5 } size={"tiny"} style={{ marginTop:0 }}>
            <Menu.Item>
                <Button onClick={() => history.push(history.location.pathname.replace('/rooms', ''))}>Back</Button>
            </Menu.Item>
            <Menu.Item>
                {
                    <Button onClick={()=> setSidebar(!sidebar)}>{ sidebar ? "Hide Sidebar" : "Show Sidebar" }</Button>
                }
            </Menu.Item>
            <Menu.Item> 
                <div className="select-dropdown">
                    <select
                        aria-label="Default select example"
                        onChange={changeLanguageHandler}
                    >
                        <option selected value="">Select language</option>
                        <option value="70">Python</option>
                        <option value="63">Javascript</option>
                        <option value="62">Java</option>
                    </select>
                    {showCodeHelp && <Button className="Code-Help-Button" onClick={() => handleBtnUpdate(challengeInState[0].title, query)}>{codeHelpBtn}</Button>}
                </div>
            </Menu.Item>
            <Menu.Item>
                <Button className="btn btn-primary" onClick={makeSubmission}> Run Code</Button>
            </Menu.Item>
            {
                showNextChallengeButton ? (
                    <SelectDifficulty 
                        showSelect={showSelect} 
                        setShowSelect={setShowSelect}
                        placeholderText="Next Challenge"
                    /> 
                ): null
            }
        </Menu>
        <div className="row">
        { contextHolder }
        { sidebar ? (
            <div className={ visible ? "col-2 whiteCol my-0" : "col-3 whiteCol my-0" } style={{ overflow:'scroll', height:400, marginLeft: !visible ? 10 : 20}}>
                <Tabs type="card">
                    <TabPane tab="Stages" key="1">
                        <ProfileTabs index={index}/>
                    </TabPane>
                    <TabPane tab="Coding Challenge" key="2">
                        <ProgrammingChallenge query={query}/>
                        <div style={{ display: showSelect ? 'block' : 'none' }}>
                            <SelectDifficulty 
                                showSelect={showSelect} 
                                setShowSelect={setShowSelect}
                                placeholderText="Select Difficulty"
                            /> 
                        </div>
                    </TabPane> 
                    <TabPane tab="Your Clue" key="3">
                        <Solutions/>
                    </TabPane>
                </Tabs>
            </div>
            ): null
        }
           <div className="col-4" style={{ marginTop: -20, marginLeft: 10 }}>
            <div className="my-0" style={{ marginLeft: !visible && !sidebar ? -50 : visible && !sidebar ? -10 : sidebar && !visible ? 0 : 100 }}>
                <Modal
                    title="Code Help"
                    visible={isCodeHelpModalVisible}
                    onCancel={() => {
                        setIsCodeHelpModalVisible(false);
                        setOpenModal(false); 
                        setCodeHelpBtn("Code Help")
                    }}
                    footer={[
                        <Button
                        key="close"
                        onClick={() => {
                            setIsCodeHelpModalVisible(false);
                            setOpenModal(false); 
                            setCodeHelpBtn("Code Help")
                        }}
                        >
                        Close
                        </Button>,
                    ]}
                    width="100%"  
                    style={{ maxWidth: '100vw' }} 
                    >
                    <pre style={{ color: 'white' }}>{codeHelpState}</pre>
                </Modal>
                <AceEditor
                    mode={currentLanguage}
                    theme="monokai"
                    name="code_editor"
                    onChange={(newCode) => {
                        setQuery(newCode)
                        if(newCode.trim() !== ''){
                            setShowCodeHelp(true)
                        } else {
                            setShowCodeHelp(false)
                        }
                    }}
                    editorProps={{ $blockScrolling: true }}
                    enableLiveAutocompletion={true}
                    width={!visible && !sidebar ? 1200 : visible && !sidebar ? 700 : sidebar && !visible ? 900 : 600}
                    height={windowHeight}
                    tabSize={3}
                />
            </div>
           </div>
           {
            visible ? (
           <div className ="col-2" style={{ marginLeft: visible ? 300 : null }}>
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
