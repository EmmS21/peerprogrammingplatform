import React, { useContext, useEffect, useState } from 'react';
import JSON5, { parse } from 'json5';
import AuthContext from '../../context/AuthContext';
import "../../assets/other_css/response.css";


function Solutions({ challengeInState, query }) {
  let { gptresp, openModal, 
        getSolution 
      } = useContext(AuthContext);
  const [solution, setSolution] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchSolution = async () => {
      console.log('fetchedSolution', challengeInState[0].title)
      const fetchedSolution = await getSolution(challengeInState[0].title, null, 'two');
      let cleanedString = fetchedSolution.replace(/\\n/g, '').replace(/0\\\\2/g, '0.2');
      cleanedString = cleanedString.trim();
      if (cleanedString[0] !== '{') {
          cleanedString = cleanedString.substring(cleanedString.indexOf('{'));
      }            

      let parsedSolution;
      if (typeof fetchedSolution === 'string') {
        try {
          parsedSolution = JSON5.parse(cleanedString);
          console.log('data', parsedSolution)
        } catch (e) {
          console.error("Failed to parse JSON:", e);
        }
      } else {
        parsedSolution = fetchedSolution;
      }
      // console.log('Fetched Solution:', JSON.parse(parsedSolution)["Leetcode Question"]);
      setSolution(parsedSolution); 
      setLoading(false);
    };
    fetchSolution();
  }, []);
  
  return (
    <div style={{ zIndex: 2, position: 'relative', color: 'white' }}>
      {loading ? (
        "Loading..."
      ) : (
        openModal && solution && Object.keys(solution).length ? (
          <div>
            <h4>Leetcode Question: </h4>{solution["Leetcode Question"]}
            <h4>Algorithm</h4>
            <h5>Technical Explanation: </h5>
              {solution["Algorithm"]["Technical Explanation"]}
            <h5>Simplified Explanation</h5>
              {solution["Algorithm"]["Simplified Explanation"]}
            <h4>Example</h4>
              {solution["Simplified Question"]}
            <strong>Explanation:</strong>
            <code className='code-block'>{solution["Pseudo-code Solution"]}</code>
            {/* <h5>Step By Step Breakdown</h5>
            <ul>
              {solution["Step By Step"] && Object.entries(solution["Step By Step"]).map(([key, value], index) => (
                <li key={index}>
                  {key}
                  <ul>
                    <li><strong>Clue: </strong>{value["Clue"]}</li>
                    <li><strong>Alternative: </strong>{value["Alternative"]}</li>
                    <li><strong>Link to Article:</strong>{value["Article Link"]}</li>
                  </ul>
                </li>
              ))}
            </ul> */}
          </div>
        ) : (
          "Please wait for your clue to be updated"
        )
      )}
    </div>
  );
}

export default Solutions;

