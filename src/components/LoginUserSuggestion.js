import React from "react";
import "../css/LoginUserSuggestion.css";

const LoginUserSuggestion = ({ text, pasteSuggestion }) => (
  <p className="login-user-suggestion-item"
    onClick={() => pasteSuggestion(text)}>{text}
  </p>
)

export default LoginUserSuggestion;
