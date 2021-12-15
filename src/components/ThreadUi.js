import HtmlUtil from "he";
import React from "react";
import Utility from "../Utility";
import Labels from "./Labels";
import "../css/ThreadUi.css";
import ThreadUiAttachmentList from "./ThreadUiAttachmentList";

const ThreadUi = ({
  threadInfo, messageInfo, threadReadStatus, messageListLength, currentUserId,
  changeThreadReadStatus, deleteThread, openThreadExpansion,
  attachments, userInfo, LABEL_COLORS, LABELS
}) => {
  const _messageBody = React.createRef();

  function expandThread () {
    const threadId = _messageBody.current.id;
    openThreadExpansion(threadId);
  }

  return (
    <div id={messageInfo.threadId} className="message-body"
      ref={_messageBody}
      message-time={new Date(messageInfo.date).getTime().toString()}>

      <div className="message-body-top">
        <div className="message-body-top-left" onClick={() => expandThread()}>
          <span
            className={`
              message-from message-expand-section
              ${!threadReadStatus ? "bold-black" : ""}
            `}
            title={Utility.modifyEmailField(messageInfo.from)}>
            {
              (Utility.getEmailPart(messageInfo.from) === currentUserId)
                ? `To: ${Utility.modifyEmailField(messageInfo.to)}`
                : Utility.modifyEmailField(messageInfo.from)
            }
          </span>
          <span className="thread-message-count badge badge-indigo">
            {messageListLength}
          </span>
        </div>

        <div className="message-body-top-right">
          <span className="message-date">
            {Utility.modifyDateField(messageInfo.date) || ""}
          </span>
          <span className="message-status-icon-cont">
            <i
              className={`
                fa fa-envelope${!threadReadStatus ? "-open" : ""}
                message-status-icon
              `}
              onClick={() => changeThreadReadStatus(messageInfo.threadId)}
              title={
                !threadReadStatus
                  ? "Mark as read"
                  : "Mark as unread"
              }
            ></i>
            <i className="fa fa-trash message-status-icon"
              onClick={() => deleteThread(messageInfo.threadId)}
              title="Delete"></i>
          </span>
        </div>
      </div>

      <div className="message-body-middle">
        <div className="message-body-middle-top">
          <p className="message-subject">{HtmlUtil.unescape(messageInfo.subject || "")}</p>
        </div>
        <div className="message-body-middle-bottom">
          <p className="message-snippet">{HtmlUtil.unescape(messageInfo.snippet || "")}</p>
        </div>
      </div>

      <div className="message-body-bottom">
        <div className="message-body-bottom-top">
          <Labels
            threadLabels={threadInfo.labelIds}
            LABEL_COLORS={LABEL_COLORS}
            LABELS={LABELS}
          />
        </div>
        <div className="message-body-bottom-bottom">
          <ThreadUiAttachmentList
            attachments={attachments}
            userInfo={userInfo}
            openThreadExpansion={openThreadExpansion}
          />
        </div>
      </div>

    </div>);
}

export default ThreadUi;
