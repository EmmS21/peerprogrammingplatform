import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import { PageHeader, Tag, Spin, Tooltip } from 'antd';
import "../../assets/other_css/programmingChallenges.css";
import "../../assets/other_css/codeeditor.css";
import Spinner from './Spinner';

export default function ProgrammingChallenge({ query }) {
  const {
    challengeInState,
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

  const challengeName = challengeInState[0].title;
  const challengeDifficulty = challengeInState[0].difficulty;
  const exampleOne = challengeInState[0].Example2;
  const exampleTwo = challengeInState[0].Example3 || challengeInState[0].Example3; 
  const challengeDescription = challengeInState[0].place || challengeInState[0].place;
  const formattedDescription = formatCode(challengeDescription) 
  const arrExamples = [exampleOne, exampleTwo]
  const headers = ["Input","Output","Explanation"]

  function formatCode(description) {
    const newDescription= description.split("\n").join(" ")
    return newDescription;
  }

  useEffect(() => {    
    // Create an array to hold the input values
    const inputArr = [];
    const outputArr = []

    // Iterate through arrExamples to extract "Input" values and add them to inputArr
    arrExamples.forEach((example) => {
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

  }, [challengeName, currentLanguage, setInputArr, setOutputArr]);

  useEffect(() => {
    if(challengeInState[0].length > 0){
      console.log('hit', challengeInState[0])
      // getSolutionHandler(challengeInState[0].title)
    }
  }, [challengeInState])

  function getConstraints(examples){
    const constraintsIdx = examples.indexOf("Constraints")
    return examples.slice(constraintsIdx+12, examples.length)
  }

  // async function getSolutionHandler(challengeName){
  //   if(currentLanguage){
  //       const codeFromEditor = query
  //       setGettingSolution(true)
  //       try {
  //           await getSolution(challengeName, currentLanguage, codeFromEditor)
  //       } catch(error){
  //           console.error('Error fetching the solution:', error)
  //       } finally {
  //           setGettingSolution(false)
  //       }
  //   } else {
  //       openNotification()
  //   }
  // }

  return (
    <div className='challenge'>
      <PageHeader
        className="site-page-header"
        onBack={()=> null}
        subTitle={challengeName}
      />
      <center><Tag color="cyan">{challengeDifficulty}</Tag></center>
      <div className='problem-container'>{formattedDescription} </div>

      <div className="examples">
        <h5> Examples: </h5>
        <ol> 
          {arrExamples.map((example, idx) => {
            // Process the example directly here
            const constraintsIdx = example?.indexOf("Constraints");
            const cleanExample = example?.slice(0, constraintsIdx);
            const tempArr = cleanExample?.slice(3).split(/\S+(?=: )/g);
            tempArr?.shift();

            return (
              <ul key={idx}>
                {tempArr.map((elem, ind) => {
                  return (
                    <div>
                      <a><strong>{headers[ind]}:</strong></a><li className="ul-list">{elem.slice(1)}</li>
                    </div>
                  );
                })}
              </ul>
            );
          })}
        </ol>
        <div><strong>Constraints:</strong>
          {getConstraints(arrExamples.join(''))}
        </div>
      </div>
    </div>
  );
}
