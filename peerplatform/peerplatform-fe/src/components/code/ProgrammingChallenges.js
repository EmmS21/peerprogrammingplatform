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
                    title=  { challengeInState.slug }
                />
                <Collapse accordion>
                    <Panel header="Description" key="1">
                        <a>{challengeInState.description}</a>
                    </Panel>
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