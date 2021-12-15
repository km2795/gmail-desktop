import React from "react";
import LoginUserSuggestion from "./LoginUserSuggestion";
import "../css/LoginUserSuggestions.css";

const LoginUserSuggestions = ({ userSuggestions, pasteSuggestion }) => (
  userSuggestions.length > 0
    ? (<div className="user-login-emails-suggestion-box">
      {userSuggestions.map((suggestion, i) =>
        <LoginUserSuggestion
          key={i++}
          text={suggestion}
          pasteSuggestion={pasteSuggestion}
        />)
      }
    </div>)
    : null
);

export default LoginUserSuggestions;
