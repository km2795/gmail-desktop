import _ from "lodash";
import React from "react";
import ThreadExpansionItem from "./ThreadExpansionItem";
import "../css/ThreadExpansion.css";

const ThreadExpansion = ({
  show, messageList, closeThreadExpansion, userInfo,
  expandThreadExpansionState,
  expandThreadExpansion
}) => {
  const expandState = {
    "flex": "none",
    "width": "100%"
  };

  const defaultState = {
    "flex": 1
  };

  // Sort the messages from latest to oldest.
  messageList = _.sortBy(messageList, (message) => message.date).reverse();

  return (
    show
      ? (
        <div
          className="thread-expansion-cont"
          style={expandThreadExpansionState ? expandState : defaultState}
        >
          <div
            className="thread-expansion-expand-cont"
            onClick={() => expandThreadExpansion()}
          >
            <div className={`thread-expansion-expand-button fa fa-chevron-${!expandThreadExpansionState ? "left" : "right"}`}></div>
          </div>
          <div className="thread-expansion-header-cont">
            <span className="thread-expansion-message-count badge badge-indigo">
              {messageList.length}
            </span>
            <span
              className="thread-expansion-close-cont"
              onClick={() => closeThreadExpansion()}
            >
              <i className="fa fa-times"></i>
            </span>
          </div>
          <div className="thread-expansion-items">
            {messageList.map((message, i) =>
              <ThreadExpansionItem
                key={i++}
                message={message}
                userInfo={userInfo} />)}
          </div>
        </div>)
      : null
  );
}

export default ThreadExpansion;
