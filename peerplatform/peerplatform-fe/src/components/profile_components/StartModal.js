import React from "react";
import "../../assets/scss/modal.scss"
import ReactDOM from 'react-dom';

const StartModal = ({ isShowing, hide }) => isShowing ? ReactDOM.createPortal(
    <>
        <div className="md-modal md-effect-12">
                <div className="md-content">
                    <h3>Ready to start pair programming? Here is how it works</h3>
                    <div>
                        <p>The session will be split into 5 phases:</p>
                        <ul>
                            <li><strong>Introductions:</strong> You will be given 5 minutes for introductions. Get to know who you are coding with.</li>
                            <li><strong>Pseudo-Code</strong> You will receive your problem statement and be given 10 minutes to pseudo code potential solutions. If your solution is a recipe, what steps will you need to make your meal. Use basic english, do not worry about coding concepts yet.</li>
                            <li><strong>Time to Code</strong> You will be given 40 minutes to collaboratively find a solution to the problem or get as close to a solution as possible.</li>
                            <li><strong>Solution</strong> Could not solve the problem? Don't fret, you will be given a solution and 20 minutes to break down the solution and try and rebuild it yourselves.</li>
                            <li><strong>Rating</strong> To close things off you will rate each other on; i.) ability to effectively communicate logic, ii.) ability to collaborate/how well did you work together and iii.) general coding skills. Leave your peer some notes on what to work on.</li>
                        </ul>
                        <button
                            className="md-close"
                            onClick={hide}
                        >Close</button>
                    </div>
                </div>
        </div>
        <div className="md-overlay"></div>
    </>, document.body
) : null;

export default StartModal;