import React, { useState, useContext, useEffect, useRef } from "react";
import AceEditor from "react-ace";

import "brace/mode/python";
import "brace/mode/javascript";
import "brace/mode/sql";
import Spinner from "./Spinner";
import "brace/theme/monokai";
import "antd/dist/antd.css";
import { Button, Spin, Tabs, Radio } from "antd";
import {
  CloseOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import ProgrammingChallenge from "./ProgrammingChallenges";
import AuthContext from "../../context/AuthContext";
import "semantic-ui-css/semantic.min.css";
import { Menu } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import "../../assets/other_css/sidebar.css";
import TestCases from "./TestCases";
import TimerComponent from "./TimerComponent";
import OptimalSolution from "./OptimalSolution";
import axios from "axios";

const CodeEditor = () => {
  const { TabPane } = Tabs;
  const [isRightSidebarVisible, setRightSidebarVisible] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  let {
    getSolution,
    isLoadingSolution,
    setLoadingCode,
    sendCodeJudge0,
    spinnerOn,
    setSpinnerOn,
    resp,
    setCodeResp,
    setResp,
    codeResp,
    setOpenModal,
    challengeInState,
    setShowNextChallengeButton,
    profileURL,
    setQuestion,
    getAnswer,
    optimalAnswer,
    submitCodeJudge0,
    codeHelpState,
  } = useContext(AuthContext);
  // let photoURL = user.photo.split('"').join('');
  const [query, setQuery] = useState("");
  const [testCases, setTestCases] = useState([]);

  // checks to see if select or programming challenge should be shown;
  const [showSelect, setShowSelect] = useState(true);
  const [isCodeHelpModalVisible, setIsCodeHelpModalVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [localChallengeInState, setLocalChallengeInState] = useState(() => {
    const storedChallenge = localStorage.getItem("challenge");
    return storedChallenge ? JSON.parse(storedChallenge) : challengeInState;
  });
  const [pseudoCode, setPseudoCode] = useState("");
  const [editorVal, setEditorVal] = useState(() => {
    const savedEditorVal = localStorage.getItem("editorVal");
    return savedEditorVal ? savedEditorVal : "";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const colors = ["color-red", "color-blue", "color-black", "color-purple"];
  const [testResults, setTestResults] = useState([]);
  const history = useHistory();
  const editorRef = useRef(null);
  const [showTestCases, setShowTestCases] = useState(false);
  const [submitButtonText, setSubmitButtonText] = useState(
    showTestCases ? "Close Tests" : "Submit Code",
  );
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [getHelp, setGetHelp] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [showRadio, setShowRadio] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

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
    let query = codeResp?.replace(/\/\/ Test Cases[\s\S]*/, "");
    getAnswer(localChallengeInState, query);
  }, [localChallengeInState]);

  useEffect(() => {
    if (codeHelpState) {
      setIsCodeHelpModalVisible(true);
    }
  }, [codeHelpState]);

  useEffect(() => {
    const storedTime = localStorage.getItem("elapsedTime");
    const initialTime = Number.isNaN(parseInt(storedTime, 10))
      ? 0
      : parseInt(storedTime, 10);
    setElapsedTime(initialTime);

    const interval = setInterval(() => {
      setElapsedTime((prevTime) => {
        const newTime = prevTime + 1;
        localStorage.setItem("elapsedTime", newTime.toString());

        if (newTime % (4 * 60) === 0) {
          streamHelp(localChallengeInState);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedChallenge = localStorage.getItem("challenge");
    const savedCodeResp = localStorage.getItem("codeResp");
    if (savedChallenge) {
      const parsedChallenge = JSON.parse(savedChallenge);
      if (Object.keys(parsedChallenge).length > 0) {
        setLocalChallengeInState(parsedChallenge);
        setShowSelect(false);
        setShowNextChallengeButton(true);
      }
      // Check if the current challenge title is different from the one in localStorage
      if (challengeInState.length > 0 && savedChallenge) {
        const currentChallengeTitle = challengeInState[0].title;
        const parsedSavedChallenge = JSON.parse(savedChallenge);
        const savedChallengeTitle = parsedSavedChallenge[0].title;
        if (currentChallengeTitle !== savedChallengeTitle) {
          localStorage.setItem("challenge", JSON.stringify(challengeInState));
          setLocalChallengeInState(challengeInState);
        } else {
          setLocalChallengeInState(challengeInState);
        }
      }
    }
    if (savedCodeResp) {
      setCodeResp(savedCodeResp);
    }
  }, []);

  useEffect(() => {
    if (localChallengeInState) {
      localStorage.setItem("challenge", JSON.stringify(localChallengeInState));
    }
  }, [localChallengeInState]);

  const toggleTestCases = async () => {
    setRightSidebarVisible(false);
    requestBody.source_code =
      document.getElementsByClassName("ace_content")[0].innerText;
    requestBody.language_id = "63";
    requestBody.base64_encoded = true;

    setShowTestCases((prevShow) => {
      const newShow = !prevShow;
      localStorage.setItem("showTestCases", newShow);
      return newShow;
    });

    setSubmitButtonText((prevText) =>
      showTestCases ? "Submit Code" : "Close Tests",
    );
    // Match and store the comments in an array
    const parts = editorVal.split("// Test Cases");
    if (parts.length < 2) {
      return "No test cases found.";
    }

    const consoleLogLines = parts[1].split("\n");
    const cleanedLines = consoleLogLines.map((line) =>
      line.replace(/console\.log\(/, "").replace(/\);/, ""),
    );
    cleanedLines.shift();

    const funcCallRegex = /\w+\([^)]*\)/;

    // Extracting function calls from cleanedLines
    const functionCalls = cleanedLines
      .map((line) => {
        const match = line.match(funcCallRegex);
        return match ? match[0] : null;
      })
      .filter(Boolean);

    setTestCases(functionCalls);

    const regex = /console\.log\(([\s\S]*?)\);(\s*\/\/.*)?/g;
    const testCases = parts[1].match(regex);
    const answers = [];

    if (testCases) {
      testCases.forEach((tc) => {
        const match = /\/\/\s*(\d+)/.exec(tc);
        if (match) {
          answers.push(parseInt(match[1], 10));
        }
      });
    }
    submitCodeJudge0(requestBody, answers);
  };

  let requestBody = {
    source_code: "",
    language_id: "70",
    number_of_runs: null,
    stdin: "Judge0",
    expected_output: null,
    cpu_time_limit: null,
    cpu_extra_time: null,
    wall_time_limit: null,
    memory_limit: null,
    stack_limit: null,
    max_processes_and_or_threads: null,
    enable_per_process_and_thread_time_limit: null,
    enable_per_process_and_thread_memory_limit: null,
    max_file_size: null,
    enable_network: null,
    base64_encoded: true,
  };

  //handle submission
  const makeSubmission = (e) => {
    e.preventDefault();
    setShowTestCases(false);
    let code = (requestBody.source_code =
      document.getElementsByClassName("ace_content")[0].innerText);
    console.log("code", code);
    // let undecode = atob(code)
    // console.log('after decode', undecode)
    requestBody.source_code = code;
    console.log("**", requestBody.source_code);
    requestBody.language_id = "63";
    setSpinnerOn(true);
    setResp("");
    toggleRightSidebar();
    sendCodeJudge0(requestBody);
  };

  const toggleRightSidebar = () => {
    setRightSidebarVisible(!isRightSidebarVisible);
    if (!isRightSidebarVisible) {
      setTypedText("");
      setCharIndex(0);
    }
  };

  useEffect(() => {
    let timeoutId;
    if (isRightSidebarVisible && charIndex < resp.length) {
      timeoutId = setTimeout(() => {
        setTypedText((prevTypedText) => prevTypedText + resp[charIndex]);
        setCharIndex((prevCharIndex) => prevCharIndex + 1);
      }, 5);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isRightSidebarVisible, charIndex]);

  const editorWidth = () => {
    let width = "95%";
    if (isSidebarVisible && isRightSidebarVisible) {
      width = "calc(100% - 60%)"; // 30% for each sidebar
    } else if (isSidebarVisible || isRightSidebarVisible) {
      width = "calc(100% - 30%)"; // 30% for one sidebar
    }
    return width;
  };

  //handles changing clock timer
  const [codeHelpBtn, setCodeHelpBtn] = useState("Code Help");

  //save typed in code to localStorage
  useEffect(() => {
    localStorage.setItem("editorVal", editorVal);
  }, [editorVal]);

  //fetch above code from localStorage
  useEffect(() => {
    const savedEditorVal = localStorage.getItem("editorVal");
    if (savedEditorVal) {
      setEditorVal(savedEditorVal);
    } else if (pseudoCode) {
      setEditorVal(pseudoCode);
    }
  }, [pseudoCode]);

  useEffect(() => {
    setPseudoCode(codeResp);
  }, [codeResp]);

  function handleOnChange(newValue) {
    setEditorVal(newValue);
  }

  function streamHelp(challenge) {
    console.log("challengeInState", challenge);
    const code = document.getElementsByClassName("ace_content")[0].innerText;
    getSolution(challenge, code, null);
  }

  function handleBtnUpdate() {
    setIsLoading(true);
    getSolution(localChallengeInState[0].title, pseudoCode)
      .then(() => {})
      .catch((error) => {
        console.error("error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    setCodeHelpBtn("Please wait...");
  }

  const handleCloseTests = () => {
    setShowTestCases(false);
    setSubmitButtonText("Submit Code");
  };

  function resetHandler() {
    console.log("de", codeResp);
    setEditorVal(pseudoCode);
    clearInterval(0);
    setElapsedTime(0);
  }

  const handleRadioChange = (e) => {
    setLoadingCode(true);
    let level = "";
    if (e.target.value === "easy") {
      level = "get_easy";
    } else if (e.target.value === "medium") {
      level = "get_medium";
    } else {
      level = "get_hard";
    }
    console.log("level", level);
    const baseUrl = `${profileURL}programming_challenge/${level}`;
    axios.get(baseUrl).then((res) => {
      const response = setQuestion(res.data);
      setLocalChallengeInState(response.newChallengeData);
      setEditorVal(response.answer);
      setPseudoCode(response.answer);
    });
    setLoadingCode(false);
    setShowRadio(false);
  };

  function changeChallenge() {
    setShowRadio(true);
    // setLoadingCode(true)
    // const base_url = `${profileURL}programming_challenge/get_easy`
    // axios.get(base_url)
    //     .then((res) => {
    //         localStorage.removeItem('challenge')
    //         localStorage.setItem('challenge', JSON.stringify(challengeInState));

    //     })
    // setLoadingCode(false)
  }

  function resetTimer() {
    setElapsedTime(0);
    setShowTimer(0);
    setShowTimer(false);
    localStorage.removeItem("elapsedTime");
  }

  function toggleMaximize() {
    setIsMaximized(!isMaximized);
  }

  return (
    <>
      <Menu
        class="w-full"
        pointing
        widths={5}
        size={"small"}
        style={{ marginTop: 0 }}
        data-testid="top-menu"
      >
        <Menu.Item className="single-menu-item-container">
          <Button
            className="btn btn-primary single-full-height-button"
            onClick={() => {
              localStorage.removeItem("challenge");
              localStorage.removeItem("showTestCases");
              localStorage.removeItem("editorVal");
              localStorage.removeItem("codeResp");
              resetTimer();
              history.push("/");
            }}
          >
            Exit Session
          </Button>
        </Menu.Item>
        <Menu.Item className="single-menu-item-container">
          <Button
            className="btn btn-primary single-full-height-button"
            onClick={resetHandler}
            data-testid="reset-button"
          >
            Refresh
          </Button>
        </Menu.Item>
        <Menu.Item className="single-menu-item-container">
          {showRadio ? (
            <Radio.Group onChange={handleRadioChange} value={difficulty}>
              <Radio.Button value="easy">Easy</Radio.Button>
              {/* <Radio.Button value="medium">Medium</Radio.Button>
                    <Radio.Button value="hard">Hard</Radio.Button> */}
            </Radio.Group>
          ) : (
            <Button
              className="btn btn-primary single-full-height-button"
              onClick={changeChallenge}
            >
              Next Challenge
            </Button>
          )}
        </Menu.Item>
        <Menu.Item className="single-menu-item-container">
          {
            <Button
              className="btn btn-primary single-full-height-button"
              onClick={() => setSidebarVisible(!isSidebarVisible)}
              data-testid="toggle-sidebar-btn"
            >
              {isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
            </Button>
          }
        </Menu.Item>
        <Menu.Item className="menu-item-container">
          <Button
            className="btn btn-primary full-height-button"
            onClick={makeSubmission}
            disabled={isRightSidebarVisible}
          >
            Run Code
          </Button>
          <Button
            className="btn btn-primary full-height-button"
            onClick={showTestCases ? handleCloseTests : toggleTestCases}
          >
            {submitButtonText}
          </Button>
        </Menu.Item>
      </Menu>
      <div className="row">
        <div
          className={`col-4 code-editor-col ${isCodeHelpModalVisible ? "code-help-visible" : ""}`}
          style={{
            marginTop: isMaximized ? "-0px" : "-20px",
            marginLeft: 10,
            height: "100%",
          }}
        >
          <div
            className={`my-0 code-help-div ${isMaximized ? "maximized" : ""}`}
          >
            <div className="code-help-header">
              <CloseCircleOutlined
                onClick={() => {
                  setIsCodeHelpModalVisible(false);
                  setOpenModal(false);
                  setGetHelp(false);
                  setCodeHelpBtn("Code Help");
                }}
                className="close-icon"
              />
              {isMaximized ? (
                <MinusCircleOutlined
                  onClick={toggleMaximize}
                  className="minimize-maximize-icon"
                  style={{ fontSize: "150%" }}
                />
              ) : (
                <PlusCircleOutlined
                  onClick={toggleMaximize}
                  className="minimize-maximize-icon"
                  style={{ fontSize: "150%" }}
                />
              )}
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                AI Mentor Clue
              </div>
            </div>
            <pre style={{ color: "white" }}>{codeHelpState}</pre>
          </div>
        </div>
        <div
          className={`col-2 whiteCol my-0 ${!isSidebarVisible ? "hidden" : ""}`}
          data-testid="sidebar"
        >
          <Tabs type="card">
            <TabPane tab="Coding Challenge" key="1">
              {
                <ProgrammingChallenge
                  query={query}
                  challengeInState={localChallengeInState}
                />
              }
            </TabPane>
            <TabPane tab="Optimal Solution" key="2">
              {optimalAnswer ? (
                <OptimalSolution challenge={localStorage.getItem("answer")} />
              ) : (
                "Please wait for the optimal answer to be generated..."
              )}
            </TabPane>
          </Tabs>
        </div>
        <div
          className="col-4 ace-editor-container"
          style={{
            marginTop: -20,
            marginLeft: 10,
            height: "100%",
            overflow: "hidden",
          }}
          data-testid="editor-container"
        >
          <div className="my-0" style={{ width: editorWidth() }}>
            <AceEditor
              data-testid="ace-editor"
              ref={editorRef}
              style={{
                position: "fixed",
                top: "3.5rem",
                left: isSidebarVisible ? "30%" : "0",
                width: editorWidth(),
                height: "90%",
              }}
              mode={"javascript"}
              onChange={handleOnChange}
              theme="monokai"
              name="code_editor"
              showPrintMargin={false}
              highlightActiveLine={true}
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
                highlightActiveLine: true,
                wrapBehavioursEnabled: true,
                overflow: true,
                wrap: true,
              }}
              tabSize={3}
              wrapEnabled={true}
              value={
                isLoadingSolution
                  ? "Fetching new answer, please wait...."
                  : editorVal
              }
            />
          </div>
        </div>
        {showTestCases && (
          <TestCases testResults={testResults} testCases={testCases} />
        )}
        <div
          className={`col-2 rightCol ${!isRightSidebarVisible ? "hidden" : ""}`}
        >
          <CloseOutlined onClick={() => setRightSidebarVisible(false)} />
          <Spinner on={spinnerOn} Spin={Spin} />
          {resp.split("\n").map((line, index) => (
            <p key={index} className="line1">
              {" "}
              {line}{" "}
            </p>
          ))}
        </div>
        <TimerComponent
          elapsedTime={elapsedTime}
          setElapsedTime={setElapsedTime}
          showTimer={showTimer}
          setShowTimer={setShowTimer}
          intervalId={intervalId}
          setIntervalId={setIntervalId}
          streamHelp={streamHelp}
        />
      </div>
    </>
  );
};

export default CodeEditor;
