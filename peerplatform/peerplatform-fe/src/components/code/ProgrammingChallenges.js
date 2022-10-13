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

    let firstQuote = String(challengeInState.description).search(/``/)
    let lastQuote = String(challengeInState.description).lastIndexOf(/``/)

    // Function to find the indices of every instance of ``` to mark code snippets
// function getAllQuotes(description, sub) {
//     var quotes = [],
//       i = 0,
//       n = 0;
  
//     do {
//       n = description.indexOf(" ");
//       if (n > -1) {
//         i += n;
//         quotes.push(i);
//         description = description.slice(n + 1);
//         i++;
//       }
//     }
//     while (n > -1);
//     return quotes;
//   }
  
//   let allQuotes = getAllQuotes(str, ' ')

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
                        <code>{String(challengeInState.description).substring(firstQuote, lastQuote)}</code>
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