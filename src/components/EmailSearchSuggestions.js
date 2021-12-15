import React from "react";
import EmailSearchSuggestionsItem from "./EmailSearchSuggestionsItem";
import "../css/EmailSearchSuggestions.css";

const EmailSearchSuggestions = ({ suggestions, selectSearchSuggestion }) => {
  const keys = Object.keys(suggestions);
  return (
    keys.length > 0
      ? (<div className="email-search-suggestions">
        {keys.map((item, i) =>
          <EmailSearchSuggestionsItem
            key={i++}
            name={item}
            suggestions={[...suggestions[item]]}
            selectSearchSuggestion={selectSearchSuggestion}
          />
        )}
      </div>)
      : null
  )
}

export default EmailSearchSuggestions;
