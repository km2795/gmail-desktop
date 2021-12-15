import _ from "lodash";
import React from "react";
import LineSeparator from "./LineSeparator";
import ThreadListNavigationItem from "./ThreadListNavigationItem";
import "../css/ThreadListNavigation.css";

const ThreadListNavigation = ({
  threadNavList, threadListCount,
  changeThreadList, currentThreadListLabelId,
  threadListNavigationExpandState,
  threadListNavigationExpand
}) => {
  const LABEL_ICONS = {
    all: "fa fa-envelope",
    chat: "fa fa-comments",
    draft: "fa fa-pen-square",
    forums: "fa fa-comment",
    inbox: "fa fa-inbox",
    important: "fa fa-exclamation",
    personal: "fa fa-user",
    promotions: "fa fa-ad",
    sent: "fa fa-paper-plane",
    social: "fa fa-users",
    spam: "fa fa-exclamation-triangle",
    starred: "fa fa-star",
    trash: "fa fa-trash",
    unread: "fa fa-envelope",
    updates: "fa fa-exclamation-circle"
  };

  let labelUser = [];
  let labelSystem = [];

  threadNavList.map((thread) => {
    (thread.type !== "user")
      ? labelSystem.push(thread)
      : labelUser.unshift(thread)
  });

  /* Sort the two list of labels based on name. */
  labelSystem = (_.sortBy(labelSystem, (label) => label.name));
  labelUser = (_.sortBy(labelUser, (label) => label.name));

  /*
   * The 'extra' labels are by default hidden. They are
   * for internal working.
   * {"id": "__ALL__", ...} is for All messages.
   * {"id": "__SEARCH__", ...} is for message searching.
   * They are not  GMAIL created labels.
   */
  labelSystem = [
    ...([{ "id": "__ALL__", "name": "ALL", "type": "system" }]),
    ...([{ "id": "__SEARCH__", "name": "SEARCH", "type": "extra" }]),
    ...labelSystem
  ];

  // CSS style for expanded configuration.
  const expandState = {
    "maxWidth": "none",
    "flex": "none"
  };

  // CSS style for default configuration.
  const defaultState = { "maxWidth": "210px" };

  return (
    <div
      className="thread-list-nav-cont article-cont-1"
      style={
        threadListNavigationExpandState
          ? expandState
          : defaultState
      }
    >
      <div
        className="thread-list-expand-cont"
        onClick={() => threadListNavigationExpand()}
      >
        <div className={`thread-list-expand-button fa fa-chevron-${
          !threadListNavigationExpandState ? "right" : "left"}`}
        ></div>
      </div>

      <div className="thread-list-nav-label-system">
        {
          labelSystem.map((threadNav, i) =>
            <ThreadListNavigationItem
              key={i++}
              icon={LABEL_ICONS[
                threadNav.name.replace("CATEGORY_", "").toLowerCase()
              ]}
              text={threadNav.name.replace("CATEGORY_", "")}
              count={
                currentThreadListLabelId === threadNav.id
                  ? threadListCount.toString()
                  : ""
              }
              show={threadNav.type !== "extra"}
              labelId={threadNav.id}
              changeThreadList={changeThreadList}
              selected={currentThreadListLabelId === threadNav.id}
            />
          )
        }
      </div>

      <div className="thread-list-nav-separator">
        <LineSeparator />
      </div>

      <div className="thread-list-nav-label-user">
        {
          labelUser.map((threadNav, i) =>
            <ThreadListNavigationItem
              key={i++}
              icon={`fa fa-tag`}
              text={threadNav.name.replace("CATEGORY_", "")}
              count={
                currentThreadListLabelId === threadNav.id
                  ? threadListCount.toString()
                  : ""
              }
              show={true}
              labelId={threadNav.id}
              changeThreadList={changeThreadList}
              selected={currentThreadListLabelId === threadNav.id}
            />
          )
        }
      </div>
    </div>
  );
}

export default ThreadListNavigation;
