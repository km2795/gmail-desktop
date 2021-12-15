import React from "react";
import "../css/MessageView.css";

const MessageView = ({ show, message }) => (
  show
    ? (<section className="message-view">
      <div className="message-view-left"></div>
      <div className="message-view-right">
        <span className="message-view-text">{message}</span>
      </div>
    </section>)
    : null
);

export default MessageView;
