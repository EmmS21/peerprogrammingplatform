import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import { PageHeader, Collapse, Button } from 'antd';
import "../../assets/other_css/programmingChallenges.css";
import "../../assets/other_css/codeeditor.css";


export default function ProgrammingChallenge() {
    const { challengeInState } = useContext(AuthContext);
    const { Panel } = Collapse;
    const challengeName = challengeInState.challenge_name;
    const codeExamplesMatch = challengeInState.description?.match('Example(?=s| |$)(.*)```(.*)```');
    const challengeExamples =codeExamplesMatch?.length ? codeExamplesMatch[1] : null;
    const challengeDescription = challengeInState.description?.replace(challengeExamples, '');
    // const challengeDescription = challengeMatch?.length ? challengeMatch[1] : challengeInState.description

    // console.log('challenge descr', challengeDescription)
    // console.log('examples', challengeExamples)

    //show url text as URL
    function urlLink(challengeDescription, textRegex, urlRegex){
      const urlText = challengeDescription.match(textRegex)
      const urlLink = challengeDescription.match(urlRegex)
      return <a href={urlLink}> { urlText }</a>
    }

    function exampleExtractor(challengeDescription, exampleRegex){
        const example = challengeDescription.match(exampleRegex)
        return <p> { example } </p>
    }

    function codeSubStr (str) {
      const urlTextRegex = /(?<=\[).*?(?=\])/g
      const urlRegex = /(?<=\().*?(?=\))/g
      const exampleRegex = 'Example(?=s| |$)(.*)```(.*)```'
      urlLink(urlTextRegex, urlRegex)
      exampleExtractor(exampleRegex)
        // const strConv = String(str)
        // return strConv.substring(strConv.indexOf("```") + 1, strConv.lastIndexOf("```") )
//        return String(str).substring( String(str).indexOf("```") + 1, String(str).lastIndexOf("```")  )
//        return str.substring( str.indexOf("```") + 1, str.lastIndexOf("```") )
//        return str.lastIndexOf("```")
    }
//    var mySubString = str.substring(
//    str.indexOf(":") + 1,
//    str.lastIndexOf(";")
//);
    // console.log('in state', challengeDescription)
    // console.log('extracted code text', challengeDescription ? challengeDescription.match('```(.*)```') : null)

  function formatCode(description) {
      //     const matched = test.match('Example(?=s| |$)(.*)```(.*)```')
   
   }

//    [
//     {
//         "_id": "636c362e8991d2e4d8da0d2e",
//         "": "1222",
//         "title": "1544. Make The String Great",
//         "difficulty": "Easy",
//         "place": "Given a string s of lower and upper case English letters.\n A good string is a string which doesn't have two adjacent characters s[i] and s[i + 1] where:\n 0 <= i <= s.length - 2\ns[i] is a lower-case letter and s[i + 1] is the same letter but in upper-case or vice-versa.\nTo make the string good, you can choose two adjacent characters that make the string bad and remove them. You can keep doing this until the string becomes good.\nReturn the string after making it good. The answer is guaranteed to be unique under the given constraints.\nNotice that an empty string is also good.\n  ",
//         "Example2": " 1:\nInput: s = \"leEeetcode\"\nOutput: \"leetcode\"\nExplanation: In the first step, either you choose i = 1 or i = 2, both will result \"leEeetcode\" to be reduced to \"leetcode\".\n",
//         "Example3": " 2:\nInput: s = \"abBAcC\"\nOutput: \"\"\nExplanation: We have many possible scenarios, and all lead to the same answer. For example:\n\"abBAcC\" --> \"aAcC\" --> \"cC\" --> \"\"\n\"abBAcC\" --> \"abBA\" --> \"aA\" --> \"\"\n",
//         "Example4": " 3:\nInput: s = \"s\"\nOutput: \"s\"\n  Constraints:\n1 <= s.length <= 100\ns contains only lower and upper case English letters."
//     }
// ]

// probably make an array of the examples so you can map through all of them;

    return (
        <div className='challenge'>
                <PageHeader
                    className="site-page-header"
                    onBack={()=> null}
                    title=  { challengeInState.slug }
                />
                <div className="challenge-top" style={{display:'flex', justifyContent:'space-evenly', alignItems:'center'}}> 
                    <h4> 1544. Make The String Great</h4> 
                    <p>Easy</p> 
                </div>

                <div className='problem-container'> 
                    <p> Given a string s of lower and upper case English letters.<br/>
                    A good string is a string which doesn't have two adjacent characters s[i] and s[i + 1] where: <br/> 
                    <code> 0 &#8804; i &#8805; s.length - 2 </code> <br/> s[i] is a lower-case letter and s[i + 1] is the same letter but in upper-case or vice-versa.<br/>
                    To make the string good, you can choose two adjacent characters that make the string bad and remove them. You can keep doing this until the string becomes good.<br/>
                    Return the string after making it good. The answer is guaranteed to be unique under the given constraints.<br/>
                    Notice that an empty string is also good.  </p>
                </div>

                <div className="examples">
                    <h4> Examples </h4>
                    <ol> 
                        <li> Input: s = <span className="example-output" style={{}}> "leetcode"</span> <br/> Output: <span className="example-output"> "leetcode" </span> <br/> Explanation: In the first step, either you choose i = 1 or i = 2, both will result <span className="example-output">"leetcode" </span> to be reduced to <span className="example-output">"leetcode"</span>.</li>
                        <li>Input: s = <span className="example-output"> "abBAcC\" </span> <br/> Output: <span className="example-output">"\" </span> <br/> Explanation: We have many possible scenarios, and all lead to the same answer. For example: <br/> <span className="example-output">"abBAcC\"</span> --&gt; <span className="example-output">"aAcC\"</span> --&gt; <span className="example-output">"cC\"</span> --&gt; <span>"\" </span> <br/> <span>"abBAcC\"</span> --&gt; <span>"abBA\" </span> --&gt; <span>"aA\" </span>,</li>
                    </ol>

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