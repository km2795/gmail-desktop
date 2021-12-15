import _ from "lodash";
import React from "react";
import EmailSearchSuggestions from "./EmailSearchSuggestions";
import "../css/EmailSearch.css";

class EmailSearch extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      suggestions: [],
      searchMessages: _.debounce(this.props.searchMessages, 250)
    }

    this.searchMessageWrapper =
      this.searchMessageWrapper.bind(this);

    this.selectSearchSuggestion =
      this.selectSearchSuggestion.bind(this);
  }

  searchMessageWrapper (val) {
    this.setState({
      suggestions:
        this.props.searchMessages(this.props.threads.getMessageValues(), val)
    });
  }

  selectSearchSuggestion (val, suggestions) {
    this.refs._email.value = val;
    this.setState({ suggestions: [] });
    this.props.selectMessageSearchSuggestion(suggestions);
  }

  render () {
    return (
      <div className="email-search-cont">
        <input
          className="email-search-input"
          ref="_email"
          type="text"
          placeholder="Search Messages..."
          onKeyUp={() => this.searchMessageWrapper(this.refs._email.value)}
        />

        <EmailSearchSuggestions
          suggestions={this.state.suggestions}
          selectSearchSuggestion={this.selectSearchSuggestion}
        />
      </div>
    );
  }
}

export default EmailSearch;
