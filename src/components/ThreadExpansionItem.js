/* eslint-disable no-undef */
import React from "react";
import Utility from "../Utility";
import LineSeparator from "./LineSeparator";
import MessageAttachmentItem from "./MessageAttachmentItem";
import "../css/ThreadExpansionItem.css";

const ThreadExpansionItem = ({ message, userInfo }) => {
  const _content = React.createRef();
  const _frame = React.createRef();

  function toggleExpansionMessage () {
    $(_content.current).slideToggle(10);
    const info = _frame.current.contentWindow;
    _frame.current.style.height =
      info.document.body.offsetHeight + info.screenY + "px";
  }

  return (
    <div className="thread-expansion-item">
      <div
        className="thread-expansion-item-btn"
        onClick={() => toggleExpansionMessage()}
      >
        <span className="thread-expansion-item-btn-from">
          {Utility.modifyEmailField(message.from)}
        </span>
        <span className="thread-expansion-item-btn-date">
          {Utility.modifyDateField(message.date)}
        </span>
      </div>
      <div className="thread-expansion-item-content-cont" ref={_content}>

        <div className="thread-expansion-item-header">
          <div className="thread-expansion-item-header-subject">
            {message.subject}
          </div>
          <LineSeparator />
          <div className="thread-expansion-item-header-date thread-expansion-item-header-info">
            {Utility.modifyDateField(message.date, true)}
          </div>
          <div className="thread-expansion-item-header-from thread-expansion-item-header-info">
            {Utility.modifyEmailField(message.from)}
          </div>
          <div className="thread-expansion-item-header-to thread-expansion-item-header-info">
            <span>To</span>
            {` ${Utility.modifyEmailField(message.to)}`}
          </div>
          <LineSeparator />
        </div>

        <div className="thread-expansion-item-body">
          <iframe
            ref={_frame}
            className="thread-expansion-item-message-body"
            srcDoc={message.textHtml || message.textPlain} />
        </div>

        <LineSeparator />

        <div className="thread-expansion-item-footer">
          <div className="thread-expansion-message-attachments">
            <div className="thread-expansion-message-attachments-list"></div>
            {message.attachments
              ? message.attachments.map((attachment, i) =>
                <MessageAttachmentItem
                  key={i++}
                  info={attachment}
                  messageId={message.id}
                  userInfo={userInfo} />)
              : null
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThreadExpansionItem;
