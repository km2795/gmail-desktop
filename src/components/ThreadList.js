import _ from "lodash";
import React from "react";
import LoadMoreButton from "./LoadMoreButton";
import ThreadListEmptyBanner from "./ThreadListEmptyBanner";
import ThreadUi from "./ThreadUi";
import "../css/ThreadList.css";

const ThreadList = ({
  threadList, currentUserId, changeThreadReadStatus,
  deleteThread, openThreadExpansion, collapseThreadList,
  displayCount, showMoreMessages, LABEL_COLORS, LABELS,
  userInfo
}) => {
  // Sort the threads. Latest first, oldest last.
  const list = _.sortBy(threadList, (thread) => thread.date)
    .reverse()
    .slice(0, displayCount);

  return (
    <div className={`thread-list-cont article-cont-2 ${collapseThreadList ? "side" : ""}`}>
      <div className="thread-list">
        {(list.length < 1)
          ? <ThreadListEmptyBanner />
          : list.map((thread, i) =>
            <ThreadUi
              key={i++}
              messageInfo={
                _.sortBy(thread.getMessageValues(), (message) => message.date)
                  .reverse()[0]
              }
              threadInfo={thread}
              threadReadStatus={thread.isRead()}
              messageListLength={thread.MessageList.size()}
              currentUserId={currentUserId}
              changeThreadReadStatus={changeThreadReadStatus}
              deleteThread={deleteThread}
              openThreadExpansion={openThreadExpansion}
              userInfo={userInfo}
              attachments={thread.getAttachmentList()}
              LABEL_COLORS={LABEL_COLORS}
              LABELS={LABELS} />)
        }
        <LoadMoreButton
          show={
            !!((threadList.length > 20 && list.length < threadList.length))
          }
          loadMore={() => showMoreMessages()} />
      </div>
    </div>
  );
}

export default ThreadList;
