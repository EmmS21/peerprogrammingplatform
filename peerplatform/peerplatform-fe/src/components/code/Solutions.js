import React, { useContext, useEffect, useState } from 'react';
import JSON5 from 'json5';
import AuthContext from '../../context/AuthContext';
import "../../assets/other_css/response.css";


function Solutions() {
  let { gptresp, openModal, 
        getSolution, challengeInState 
      } = useContext(AuthContext);
  const [solution, setSolution] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchSolution = async () => {
      const fetchedSolution = await getSolution(challengeInState[0].title);
      const cleanedString = JSON.stringify(fetchedSolution).replace(/\\n/g, '');
      let parsedSolution;
      if (typeof fetchedSolution === 'string') {
        try {
          parsedSolution = JSON5.parse(JSON5.parse(cleanedString));
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
  }, [solution, challengeInState]);
  
  // useEffect(() => {
  //   if(solution && Object.keys(solution).length){
  //     console.log('sol', solution["Leetcode Question"], '*****')
  //     console.log('sol', solution["Algorithm"]["Technical Explanation"], '&&&')

  //   }
  // },[solution])


  return (
    <div style={{ zIndex: 2, position: 'relative' }}>
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
              {solution["Example"]["Example Text"]}
            <code>{solution["Example"]["Pseudo-code"]}</code>
            <h5>Logic + Comments:</h5>
            <code className="code-block">{solution["Example"]["Pseudo-code/logic + line by line comments"]}</code>
            <h5>Step By Step Breakdown</h5>
            <ul>
              {solution["Step By Step Breakdown"] && solution["Step By Step Breakdown"].map((item, index) => (
                <li key={index}>
                  {item.Question}
                  <ul>
                    <li><strong>Clue: </strong>{item.Clue}</li>
                    <li><strong>Alternative: </strong>{item.Alternative}</li>
                    <li><strong>Link to Article:</strong>{item["Link to Article"]}</li>
                  </ul>
                </li>
              ))}
            </ul>
            <h5>Summary</h5>
            {solution.Summary}
          </div>
        ) : (
          "Please wait for your clue to be updated"
        )
      )}
    </div>
  );
}

export default Solutions;

