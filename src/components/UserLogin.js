import emailValidator from "email-validator";
import React from "react";
import Utility from "../Utility";
import Spinner from "./Spinner";
import LoginUserSuggestions from "./LoginUserSuggestions";
import UserLoginActionButton from "./UserLoginActionButton";
import "../css/UserLogin.css";

class UserLogin extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      userSuggestions: [],
      chosenSuggestion: "",
      showLoginButton: true,
      showNewLoginButton: false
    };

    this.checkEmail = this.checkEmail.bind(this);
    this.pasteSuggestion = this.pasteSuggestion.bind(this);
    this.getUserSuggestion = this.getUserSuggestion.bind(this);
  }

  getUserSuggestion (val) {
    const list = this.props.userList.filter(
      (user) => Utility.subsequence(user, val)
    );

    this.setState({
      userSuggestions: (val.length > 0 && list.length > 0)
        ? list
        : []
    });
  }

  pasteSuggestion (text) {
    this.refs._email.value = text;
    this.setState({
      userSuggestions: []
    });
  }

  checkEmail (val, createNew) {
    if (val.length < 1) {
      console.log("Nothing is entered.");
    } else if (!emailValidator.validate(val)) {
      console.log("Email is invalid.");
    } else {
      if (this.props.userList.find((user) => user === val)) {
        this.props.logInUser(val, false);
        this.setState({ showLoginButton: false });
      } else {
        if (createNew) {
          this.props.logInUser(val, true);
        } else {
          this.setState({ showNewLoginButton: true });
        }
      }
    }
  }

  render () {
    return (
      this.props.show
        ? (<div className="user-login-cont">
          <div className="user-login-details">
            <div className="user-login-email-cont">
              <input className="user-login-email"
                onKeyUp={() => this.getUserSuggestion(
                  this.refs._email.value
                )}
                ref="_email"
                type="text"
                placeholder="Email Address" autoFocus />
            </div>

            <LoginUserSuggestions
              userSuggestions={this.state.userSuggestions}
              pasteSuggestion={this.pasteSuggestion} />

            <div className="user-login-submit-btn-cont">
              <UserLoginActionButton
                actionHandler={this.checkEmail}
                color={`elegant`}
                text={`GO`}
                _input={this.refs._email}
                createNew={false} />

              {this.state.showNewLoginButton
                ? (<UserLoginActionButton
                  actionHandler={this.checkEmail}
                  color={`unique`}
                  text={`Create User`}
                  _input={this.refs._email}
                  createNew={true} />)
                : null}
            </div>
          </div>

          <Spinner
            show={false}
            message={`Loading...`}
            color={`#40334e`} />

        </div>)
        : null);
  }
}

export default UserLogin;
