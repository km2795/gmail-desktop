import React from "react";
import "../css/ThreadUiAttachmentListItem.css";

const ThreadUiAttachmentListItem = ({ filename, openThreadExpansion, threadId }) => (
  <span
    className="thread-ui-attachment-list-item"
    onClick={() => openThreadExpansion(threadId)}
  >
    <span className="thread-ui-attachment-list-item-name">{filename}</span>
  </span>
);

export default ThreadUiAttachmentListItem;
