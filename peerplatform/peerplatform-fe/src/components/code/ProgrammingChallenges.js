import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import { PageHeader, Tag } from 'antd';
import "../../assets/other_css/programmingChallenges.css";
import "../../assets/other_css/codeeditor.css";

export default function ProgrammingChallenge() {
    const { challengeInState } = useContext(AuthContext);
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
    return (
        <div className='challenge'>
                <PageHeader
                    className="site-page-header"
                    onBack={()=> null}
                    subTitle=  { challengeName }
                />
                <center><Tag color ="cyan">{challengeDifficulty}</Tag></center>
                <div className='problem-container'>{formattedDescription} </div>
                
                {/* <div className='problem-container'>   THIS IS HOW IT SHOULD BE FORMATTED;
                    <p> Given a string s of lower and upper case English letters.<br/>
                    A good string is a string which doesn't have two adjacent characters s[i] and s[i + 1] where: <br/> 
                    <code> 0 &#8804; i &#8805; s.length - 2 </code> <br/> s[i] is a lower-case letter and s[i + 1] is the same letter but in upper-case or vice-versa.<br/>
                    To make the string good, you can choose two adjacent characters that make the string bad and remove them. You can keep doing this until the string becomes good.<br/>
                    Return the string after making it good. The answer is guaranteed to be unique under the given constraints.<br/>
                    Notice that an empty string is also good.    </p>
                </div> */}

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
                    {
                    /* {examples.img && <img src="" alt="example"/>} */
                    // THIS IS TO HANDLE THE IMAGES
                    }

                </div> 
                
                {/* <Collapse accordion>
                    <div>
                        <p>Description</p>
                        {formatCode()}
                    </div>
                    <div>
                        { challengeDescription }
                        <h6 style={{color: 'black'}}>Example(s)</h6>
                        { codeExamplesMatch }
                    </div>
                    <Panel header="Link to Question" key="2">
                        <a href={challengeInState.url} target="_blank">{challengeInState.url}</a>
                    </Panel>

                </Collapse>
                <Button type="primary" ghost onClick={retrieveChallenge}>
                    Skip
                </Button> */}
        </div>
  )
}