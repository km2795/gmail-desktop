import React from "react";
import "../css/AuthenticationTokenBox.css";

const AuthenticationTokenBox = ({ show, auth, hideAuthBox, submitAuthToken }) => {
  let _input;

  return (
    show
      ? (<div className="input-box-cont">
        <div className="input-box-close-btn">
          <i className="fa fa-times" onClick={hideAuthBox} ></i>
        </div>

        <div className="info-input-box">
          <input type="text" ref={(input) => { _input = input }}
            className="token-code-input"
            placeholder="Please enter the code" autoFocus
          />

          <div className="token-code-error-box"></div>
          <button className="btn btn-orange token-code-input-submit-btn"
            onClick={() => submitAuthToken(_input.value, auth)}>{`GO`}
          </button>

        </div>
      </div>)
      : null);
}

export default AuthenticationTokenBox;
