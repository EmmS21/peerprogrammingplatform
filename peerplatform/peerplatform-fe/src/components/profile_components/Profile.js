import React, { Component } from "react";
import "../../assets/scss/core/signup_components/_signup.scss"

export default class Profile extends Component {
    constructor(props) {
        super(props);
    }

    render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Profile</div>
      </div>
    );
  }
}