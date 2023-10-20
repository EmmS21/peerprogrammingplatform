import React, { useContext, useState, useEffect, useMemo } from 'react';
import AuthContext from '../../context/AuthContext';
import { PageHeader, Tag, Spin, Tooltip, Table } from 'antd';
import "../../assets/other_css/programmingChallenges.css";
import "../../assets/other_css/codeeditor.css";
import Spinner from './Spinner';

export default function ProgrammingChallenge({ query, challengeInState }) {
  const {
    getSolution,
    currentLanguage,
    openNotification,
    setSpinnerOn,
    setOpenModal,
    spinnerOn,
    formattedChallengeName,
    setFormattedChallengeName,
    setInputArr,
    setOutputArr
  } = useContext(AuthContext);
  const [challengeData, setChallengeData] = useState({
    name: '',
    difficulty: '',
    description: '',
    examples: [],
  });
  // console.log('challege', challengeData, '########')

  const headers = ["Input","Output","Explanation"]

  function formatCode(description) {
    if (!description) return "";
    const newDescription= description.split("\n").join(" ")
    return newDescription;
  }

  function formatTextForJSX(text) {
    return text.split('\n').map((str, index, array) => 
        index === array.length - 1 ? str : <>
            {str}
            <br />
        </>
    );
  }



  useEffect(() => {
    console.log('programmingchallenge')
    if (challengeInState && challengeInState.length > 0) {
      // console.log('challenge', challengeInState)
      const challenge = challengeInState[0];
      const { explanation, exampleData } = parseExplanationAndExamples(challenge.extra_explain);
      setChallengeData({
        name: challenge.title,
        difficulty: challenge.difficulty,
        description: challenge.place || challenge.place,
        examples: [challenge.Example2, challenge.Example3 || challenge.Example3].filter(Boolean),
        explanation,
        exampleData,
      });
    }
  }, [challengeInState]);


  useEffect(() => {    
    // Create an array to hold the input values
    const inputArr = [];
    const outputArr = []

    // Iterate through arrExamples to extract "Input" values and add them to inputArr
    challengeData.examples.forEach((example) => {
      const constraintsIdx = example?.indexOf("Constraints");
      const cleanExample = example?.slice(0, constraintsIdx);
      const tempArr = cleanExample?.slice(3).split(/\S+(?=: )/g);
      tempArr?.shift(); // Remove the first empty element

      // Add the "Input" values to inputArr
      if (tempArr.length > 0) {
        inputArr.push(tempArr[0].slice(1));
        outputArr.push(tempArr[1])
      }
    });

    // Update the setInputArr state with the input array
    setInputArr(inputArr);
    setOutputArr(outputArr)

  }, [challengeData, setInputArr, setOutputArr]);

  useEffect(() => {
    if(challengeInState[0].length > 0){
      console.log('hit', challengeInState[0])
      // getSolutionHandler(challengeInState[0].title)
    }
  }, [challengeInState])

  
  function getConstraints(examples){
    if (examples.length === 0) return '';
    const lastExample = examples[examples.length - 1];

    const constraintsIdx = lastExample.indexOf("Constraints");
    if (constraintsIdx === -1) return '';
    return lastExample.slice(constraintsIdx + 12);
  }

  function parseTableData(data) {
    if (!data) return null;
    // console.log("Input data:", data);  // Check the input data


    const lines = data.split("\n");
    const separatorPattern = /^\+(-+\+)+$/;  // Updated regex pattern
    
    let headersStart = -1;
    let rowsStart = -1;
    let tableEnd = -1;

    // Find the start of headers, start of rows, and end of the table
    for (let i = 0; i < lines.length; i++) {
        if (separatorPattern.test(lines[i])) {
            if (headersStart === -1) {
                headersStart = i + 1;
            } else if (rowsStart === -1) {
                rowsStart = i + 1;
            } else {
                tableEnd = i;
                break;
            }
        }
    }
    // console.log("Header start, rows start, table end:", headersStart, rowsStart, tableEnd);  // Log the start/end indices
    if (headersStart === -1 || rowsStart === -1 || tableEnd === -1) return null;
    // Extract headers
    const headers = lines[headersStart].trim().split('|').map(header => header.trim());
    const textDataAfterTablePosition = lines.slice(0, tableEnd + 1).join('\n').length;
    const textDataAfterTable = data.slice(textDataAfterTablePosition).trim();
    // console.log('textData***', textDataAfterTable, '***')
    
    // Extract rows data
    const rows = [];
    for (let i = rowsStart; i < tableEnd; i++) {
        const row = lines[i].trim().split('|').map(cell => cell.trim());
        if (row.length === headers.length) {
            rows.push(row);
        }
    }
    const tableLabels = lines.slice(0, headersStart - 1);

    const result = {headers, rows, tableLabels, textDataAfterTable}
    // console.log("Parsed data:", result);  // Log the parsed data
    return result;
  }

  function RenderTableOrText({ data }) {
    const tableData = useMemo(() => parseTableData(data), [data]);
    // console.log('**', tableData?.textDataAfterTable, '!!!')
    
    if (tableData) {
        return (
            <>
                {tableData.tableLabels.map((label, idx) => 
                    label.trim() !== "" ? <Tag color="cyan" key={idx}>{label}</Tag> : null
                )}
                {renderTable(tableData)}
                {/* {tableData && tableData?.textDataAfterTable && <p>{formatTextForJSX(tableData?.textDataAfterTable)}</p>} */}
            </>
        );
    }
    return <div>{formatCode(data)}</div>;
  }

  function parseExamplesData(data) {
    const splitData = {};
    headers.forEach(header => {
      const startPos = data.indexOf(header + ':');
      const nextHeader = headers.find(h => data.indexOf(h + ':', startPos + header.length + 1) !== -1);
      const endPos = nextHeader ? data.indexOf(nextHeader + ':') : data.length;
    if (startPos !== -1 && endPos !== -1) {
        splitData[header] = data.slice(startPos + header.length + 1, endPos).trim();
      }
    });
    return splitData;
  }


  function renderTable(parsedData) {
    if (!parsedData) return null;
  
    const columns = parsedData.headers.map(header => ({
      title: header,
      dataIndex: header,
      key: header,
    }));
  
    const dataSource = parsedData.rows.map((row, index) => {
      const obj = {};
      parsedData.headers.forEach((header, idx) => {
        obj[header] = row[idx];
      });
      obj.key = index;
      return obj;
    });
  
    return <Table className="custom-table" dataSource={dataSource} columns={columns} pagination={false} />;
  }

  function parseExplanationAndExamples(data) {
    // console.log('dataParseExplanation', data)
    const explanationStart = data.indexOf("Simplified Explanation:");
    const exampleStart = data.indexOf("An Example:");

    const explanation = data.substring(explanationStart, exampleStart).replace("Simplified Explanation:", "").trim();
    const exampleData = data.substring(exampleStart + "An Example:".length).trim();
  
    return { explanation, exampleData };
    }

  const tableData = useMemo(() => parseTableData(challengeData.description), [challengeData.description]);


  return (
    <div className='challenge' style={{ color: 'white' }}>
      <PageHeader
        className="site-page-header"
        onBack={()=> null}
        subTitle={challengeData.name}
      />
      <center><Tag color="cyan">{challengeData.difficulty}</Tag></center>
      <div className='problem-container'>
        <RenderTableOrText data={challengeData.description} />
      </div>
      <div>
        {tableData?.textDataAfterTable ? formatTextForJSX(tableData.textDataAfterTable) : ""}
      </div>

      <div className="examples">
        <h5> Examples: </h5>
        <ol>
          {challengeData.examples && challengeData.examples.map((example, idx) => {
            const splitExamplesData = parseExamplesData(example);
            return (
              <li key={idx}>
                {headers.map((header, ind) => {
                  return (
                    <div key={ind}>
                      <strong>{header}:</strong>
                      <RenderTableOrText data={splitExamplesData[header]} />
                    </div>
                  );
                })}
              </li>
            );
          })}
        </ol>
        <h5>Simplified Explanation</h5>
        <div>{challengeData.explanation}</div>
        <h6>Additional Examples</h6>
        <div>{challengeData.exampleData}</div>
        <div><strong>Constraints:</strong>
          {getConstraints(challengeData.examples.join(''))}
        </div>
      </div>
    </div>
  );
}
