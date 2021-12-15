import React from "react";
import "../css/ThreadListNavigationItem.css";

const ThreadListNavigationItem = ({
  show, icon, text, count, labelId,
  changeThreadList, selected
}) => (
  show ? (
    <span
      className={`
        thread-list-nav-item
        ${selected ? `selected-thread` : ``}
      `}
      onClick={() => changeThreadList(labelId)}
    >
      <span className="thread-list-nav-item-cont" title={text}>
        <span className="thread-list-nav-item-icon">
          <i className={icon}></i>
        </span>
        <span className="thread-list-nav-item-text">{text}</span>
        <span
          className={`
            thread-list-nav-item-count
            ${(count && count.length > 0) ? `badge badge-elegant` : ``}
          `}
        >
          {count}
        </span>
      </span>
    </span>)
    : null
);

export default ThreadListNavigationItem;
