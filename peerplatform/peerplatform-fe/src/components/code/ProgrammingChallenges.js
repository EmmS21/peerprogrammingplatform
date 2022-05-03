import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { PageHeader, Collapse, Button } from 'antd';
import "../../assets/other_css/programmingChallenges.css";

export default function ProgrammingChallenge() {
    const { challengeInState,retrieveChallenge } = useContext(AuthContext);
    const { Panel } = Collapse;
    const challengeName = challengeInState.challenge_name
    return (
        <div>
                <PageHeader
                    className="site-page-header"
                    onBack={()=> null}
                    title=  { challengeInState.challenge_name }
                />
                <Collapse accordion>
                    <Panel header="Description" key="1">
                        <a>{challengeInState.challenge_description}</a>
                    </Panel>
                    <Panel header="Example 1" key="2">
                        <code>{challengeInState.challenge_example_one}</code>
                    </Panel>
                    <Panel header="Example 2" key="3">
                        <code>{challengeInState.challenge_example_two}</code>
                    </Panel>
                    <Panel header="Example 3" key="4">
                        <code>{challengeInState.challenge_example_three}</code>
                    </Panel>
                </Collapse>
                <Button type="primary" ghost onClick={retrieveChallenge}>
                    Skip
                </Button>
        </div>
  )
}