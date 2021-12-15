import React from "react";
import ThreadUiAttachmentListItem from "./ThreadUiAttachmentListItem";
import MessageAttachmentItem from "./MessageAttachmentItem";
import "../css/ThreadUiAttachmentList.css";

const ThreadUiAttachmentList = ({
  userInfo, attachments, openThreadExpansion
}) => (

  attachments.length > 0
    ? (<div className="thread-ui-attachment-list">
      {attachments[0]
        ? <MessageAttachmentItem
          key={0}
          info={attachments[0]}
          messageId={attachments[0].messageId}
          userInfo={userInfo}
        />
        : null
      }
      {attachments[1]
        ? <MessageAttachmentItem
          key={1}
          info={attachments[1]}
          messageId={attachments[0].messageId}
          userInfo={userInfo}
        />
        : null
      }
      {attachments[2]
        ? <MessageAttachmentItem
          key={2}
          info={attachments[2]}
          messageId={attachments[0].messageId}
          userInfo={userInfo}
        />
        : null
      }
      {attachments[3]
        ? <ThreadUiAttachmentListItem
          openThreadExpansion={openThreadExpansion}
          threadId={attachments[0].threadId}
          filename={`+ ${attachments.length - 3}`}
        />
        : null
      }
    </div>)
    : null
);

export default ThreadUiAttachmentList;
