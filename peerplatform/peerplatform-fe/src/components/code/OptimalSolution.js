import React, { useEffect, useContext } from "react";
import { Button } from "antd";
import AceEditor from "react-ace";
import AuthContext from "../../context/AuthContext";

import "brace/theme/terminal";

const OptimalSolution = ({ challenge }) => {
  let { getAnswer } = useContext(AuthContext);
  // getAnswer
  return (
    <div>
      <AceEditor
        mode={"javascript"}
        theme="terminal"
        name="code_editor"
        showPrintMargin={false}
        highlightActiveLine={true}
        readOnly={true}
        editorProps={{ $blockScrolling: Infinity }}
        style={{ width: "90%" }}
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
        value={challenge}
      />
    </div>
  );
};

export default OptimalSolution;
