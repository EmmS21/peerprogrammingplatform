import React, { useState, useEffect, useRef, useContext } from "react";
import { Tabs, Button } from "antd";
import "../../assets/other_css/sidebar.css";
import { Menu } from "semantic-ui-react";
import AceEditor from "react-ace";

import "brace/mode/javascript";
import "brace/theme/monokai";
import "brace/ext/language_tools";
import AuthContext from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import ProgrammingChallenge from "./ProgrammingChallenges";

//change language based on map
const TestComponent = () => {
  const { TabPane } = Tabs;
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isRightSidebarVisible, setRightSidebarVisible] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0); // Index for the current character to type
  const editorRef = useRef(null);
  let isUndoOperation = false; // Flag to prevent event loop
  let { codeResp, checkAnswers, setCheckAnswers } = useContext(AuthContext);
  const history = useHistory();
  const [query, setQuery] = useState("");

  console.log("code", codeResp.current);

  const vart = "butts what is going on with the world is it three"; // Replace this with your dynamic text

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
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
    if (isRightSidebarVisible && charIndex < vart.length) {
      timeoutId = setTimeout(() => {
        setTypedText((prevTypedText) => prevTypedText + vart[charIndex]);
        setCharIndex((prevCharIndex) => prevCharIndex + 1);
      }, 100);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isRightSidebarVisible, charIndex]);

  const editorWidth = () => {
    let width = "100%";
    if (isSidebarVisible && isRightSidebarVisible) {
      width = "calc(100% - 60%)"; // 30% for each sidebar
    } else if (isSidebarVisible || isRightSidebarVisible) {
      width = "calc(100% - 30%)"; // 30% for one sidebar
    }
    return width;
  };

  const onLoad = (editor) => {
    editorRef.current = editor;
    console.log("Editor Ref: ", editorRef.current); // Log the ref object
    const session = editor.getSession();

    editor.on("click", function (e) {
      const cursor = editor.getCursorPosition();

      const lines = session.getDocument().getAllLines();
      const startIndex = lines.findIndex((line) =>
        line.includes("// add code"),
      );
      const endIndex = lines.findIndex((line) => line.includes("//**"));
      const endCommentIndex = lines.findIndex((line) => line.includes("//end"));

      if (cursor.row === startIndex || cursor.row < startIndex) {
        console.log("Clicked on or before // add code");
        editor.setReadOnly(true);
      } else if (cursor.row > startIndex && cursor.row < endIndex) {
        console.log("Clicked between // add code and //**");
        editor.setReadOnly(false);
      } else if (
        cursor.row === endIndex ||
        (cursor.row > endIndex && cursor.row < endCommentIndex)
      ) {
        console.log("Clicked on or after //** but before //end");
        editor.setReadOnly(true);
      } else if (cursor.row >= endCommentIndex) {
        console.log("Clicked on or after //end");
        editor.setReadOnly(false);
      }
    });
  };

  return (
    <>
      <Menu
        class="w-full"
        pointing
        widths={5}
        size={"tiny"}
        style={{ marginTop: 0 }}
      >
        <Menu.Item>
          <Button
            onClick={() =>
              history.push(history.location.pathname.reaplce("/tester", ""))
            }
          >
            Back
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button onClick={toggleSidebar}>Toggle Sidebar</Button>
        </Menu.Item>
        <Menu.Item>
          <Button>Two</Button>
        </Menu.Item>
        <Menu.Item>
          <Button onClick={toggleRightSidebar}>Three</Button>
        </Menu.Item>
      </Menu>
      <div
        className={`col-2 whiteCol my-0 ${!isSidebarVisible ? "hidden" : ""}`}
      >
        <Tabs type="card">
          <TabPane tab="Coding Challenge" key="1">
            <ProgrammingChallenge query={query} />
          </TabPane>
          <TabPane tab="Your Clue" key="2">
            C
          </TabPane>
        </Tabs>
      </div>
      <AceEditor
        ref={editorRef}
        mode="javascript"
        style={{
          position: "fixed",
          top: "3.5rem",
          left: isSidebarVisible ? "30%" : "0",
          width: editorWidth(),
          height: "calc(100% - 3.5rem)",
        }}
        theme="monokai"
        name="code_editor"
        editorProps={{ $blockScrolling: Infinity }}
        setOptions={{
          enableLiveAutocompletion: true, // Autocompletion
        }}
        tabSize={3}
        wrapEnabled={true}
        onLoad={(editor) => onLoad(editor)}
        value={codeResp.current}
      />
      <div
        className={`col-2 rightCol ${!isRightSidebarVisible ? "hidden" : ""}`}
      >
        <p className="line1">{typedText}</p>
      </div>
    </>
  );
};

export default TestComponent;
