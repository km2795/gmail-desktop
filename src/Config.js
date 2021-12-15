"use strict";

require("dotenv").config();

const Config = {

  /* Root storage directory. */
  STORE_DIR: process.env.STORE_DIR,

  /* Logs storage directory. */
  LOG_DIR: process.env.LOG_DIR,

  /* File for storing UserList JSON. */
  USER_LIST_FILE: process.env.USER_LIST_FILE,

  /* Storage directory of the user. */
  USER_STORE_DIR: process.env.USER_STORE_DIR,

  /* User's email address. */
  USER_ID: "",

  /* Current user. */
  User: "",

  /* Client's secret credentials. */
  CLIENT_SECRET: process.env.CLIENT_SECRET,

  /* Label's file location. */
  LABELS_STORE: "",

  /* History ID file location. */
  HISTORY_ID_STORE: "",

  /* Message fetching interval time. */
  FETCH_INTERVAL: process.env.FETCH_INTERVAL,

  /*
   * To avoid multiple instances of fetchMessages() to
   * run concurrently.
   * true - Another instance is running.
   * false - No other instance is running.
   */
  FetchingMessages: false,

  /* Current User's Mailbox labels. */
  Labels: {},

  /* Logger object. */
  Logger: null,

  /* Color for individual Mailbox label's badge. */
  LABEL_COLORS: {
    "inbox": "red",
    "trash": "black",
    "important": "cyan",
    "chat": "lime",
    "sent": "black",
    "draft": "maroon",
    "spam": "yellow",
    "starred": "lime",
    "unread": "teal",
    "label_1": "salmon",
    "label_5": "indianred",
    "label_6": "lightcoral",
    "label_2": "beige",
    "category_updates": "orange",
    "category_social": "blue",
    "category_forums": "purple",
    "category_promotions": "green",
    "category_personal": "light-green"
  }
};

export default Config;
