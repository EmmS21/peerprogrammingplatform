import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import { PageHeader, Collapse, Button } from 'antd';
import "../../assets/other_css/programmingChallenges.css";
import "../../assets/other_css/codeeditor.css";


export default function ProgrammingChallenge() {
    const { challengeInState,retrieveChallenge } = useContext(AuthContext);
    const { Panel } = Collapse;
    const challengeName = challengeInState.challenge_name;
    const codeExamplesMatch = challengeInState.description?.match('Example(?=s| |$)(.*)```(.*)```');
    const challengeExamples =codeExamplesMatch?.length ? codeExamplesMatch[1] : null;
    const challengeDescription = challengeInState.description?.replace(challengeExamples, '');
    // const challengeDescription = challengeMatch?.length ? challengeMatch[1] : challengeInState.description
    
    useEffect(() => {
      retrieveChallenge()
    }, [])

    console.log('challenge descr', challengeDescription)
    console.log('examples', challengeExamples)

    //show url text as URL
    function urlLink(str){
      const textRegex = /(?<=\[).*?(?=\])/g
      const urlText = str.match(textRegex)
      const urlRegex = /(?<=\().*?(?=\))/g 
      const urlLink = str.match(urlRegex)
      return <a href={urlLink}>urlText</a>
    }

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
    console.log('in state', challengeDescription)
    // console.log('extracted code text', challengeDescription ? challengeDescription.match('```(.*)```') : null)

  function formatCode(description) {
      //     const matched = test.match('Example(?=s| |$)(.*)```(.*)```')
   
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
                </Button>
        </div>
  )
}