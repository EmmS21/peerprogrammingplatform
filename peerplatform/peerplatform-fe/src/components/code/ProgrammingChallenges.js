import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import { PageHeader, Tag } from 'antd';
import "../../assets/other_css/programmingChallenges.css";
import "../../assets/other_css/codeeditor.css";
import axios from 'axios'


export default function ProgrammingChallenge() {
    const { challengeInState, driverInState, user, getSolution } = useContext(AuthContext);
    const challengeName = challengeInState?.current[0].title;
    const challengeDifficulty = challengeInState?.current[0].difficulty;
    const exampleOne = challengeInState?.current[0].Example2;
    const exampleTwo = challengeInState?.current[0].Example3 || challengeInState?.current.Example3; 
    const challengeDescription = challengeInState?.current[0].place || challengeInState?.current.place;
    const formattedDescription = formatCode(challengeDescription) 
    const arrExamples = [exampleOne, exampleTwo]
    const headers = ["Input","Output","Explanation"]

  function formatCode(description) {
      const newDescription= description.split("\n").join(" ")
      return newDescription;
   }

   function formatExamples(example){
    const constraintsIdx = example.indexOf("Constraints")
    const cleanExample = example.slice(0,constraintsIdx)
    const exampleArr = cleanExample.slice(3).split(/\S+(?=: )/g) 
    exampleArr.shift()
    return exampleArr
   }

   function getConstraints(examples){
    const constraintsIdx = examples.indexOf("Constraints")
    return examples.slice(constraintsIdx+12, examples.length)
   }

// probably make an array of the examples so you can map through all of them;


//for the observer remove btn and see the problem challenge when its in state
//for driver have btn to select difficulty, call API, and render challenge when it loads 
    return (
            <div className='challenge'>
            <PageHeader
                className="site-page-header"
                onBack={()=> null}
                subTitle=  { challengeName }
            />
            <center><Tag color ="cyan">{challengeDifficulty}</Tag></center>
            <div className='problem-container'>{formattedDescription} </div>

            <div className="examples">
                <h5> Examples: </h5>
                <ol> 
                    {arrExamples.map((example, idx) => {
                        return(<ul key={idx}> {formatExamples(example).map((elem, ind) =>{
                            return(<div>
                                    <a><strong>{headers[ind]}:</strong></a><li className="ul-list">{elem.slice(1)}</li>
                                </div>)
                        })}
                        </ul>)
                    })}
                </ol>
                <div><strong>Constraints:</strong>
                {getConstraints(arrExamples.join(''))}
                </div>
            </div>
            <button onClick={()=>getSolution(challengeName)}>Get Solution</button>
        </div> )
}