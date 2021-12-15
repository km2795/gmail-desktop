import React from "react";
import "../css/UserLoginActionButton.css";

const UserLoginActionButton = ({
  color, actionHandler, _input, text, createNew
}) => (
  <button className={`user-login-action-btn btn btn-${color}`}
    onClick={() => actionHandler(_input.value, createNew)}>
    {text}
  </button>
);

export default UserLoginActionButton;
