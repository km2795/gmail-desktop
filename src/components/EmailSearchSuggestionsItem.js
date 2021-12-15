import React from "react";
import "../css/EmailSearchSuggestionsItem.css";

const EmailSearchSuggestionsItem = ({
  name, suggestions, selectSearchSuggestion
}) => (
  <div
    className="email-search-suggestions-item"
    onClick={() => selectSearchSuggestion(name, suggestions)}
  >
    {name}
  </div>
);

export default EmailSearchSuggestionsItem;
