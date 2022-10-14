import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { PageHeader, Collapse, Button } from 'antd';
import "../../assets/other_css/programmingChallenges.css";

export default function ProgrammingChallenge() {
    const { challengeInState,retrieveChallenge } = useContext(AuthContext);
    const { Panel } = Collapse;
    const challengeName = challengeInState.challenge_name
    function codeSubStr (str) {
        const strConv = String(str)
        return strConv.substring(strConv.indexOf("```") + 1, strConv.lastIndexOf("```") )
//        return String(str).substring( String(str).indexOf("```") + 1, String(str).lastIndexOf("```")  )
//        return str.substring( str.indexOf("```") + 1, str.lastIndexOf("```") )
//        return str.lastIndexOf("```")
    }
//    var mySubString = str.substring(
//    str.indexOf(":") + 1,
//    str.lastIndexOf(";")
//);
console.log('in state', codeSubStr(challengeInState.description))

  function formatCode() {
    let description = String(challengeInState.description)
    let codeSnip = '```(.*)```'
    console.log('originalDescription', description, 'edited', description.match(codeSnip))
    //find all matches
    //display text between quotes as code snippets
    //display the rest of the description as normal text
    //return the formatted description
   }



  
    return (
        <div>
                <PageHeader
                    className="site-page-header"
                    onBack={()=> null}
                    title=  { challengeInState.slug }
                />
                <Collapse accordion>
                    <div>
                        <p>Description</p>
                        {formatCode()}
                    </div>
                    <Panel header="Link to Question" key="2">
                        <a href={challengeInState.url} target="_blank">{challengeInState.url}</a>
                    </Panel>

                </Collapse>
                <Button type="primary" ghost onClick={retrieveChallenge}>
                    Skip
                </Button>
        </div>
  )
}