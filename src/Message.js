"use strict";

import Utility from "./Utility";

/**
 * Thread's Message object.
 */
class Message {
  constructor (message) {
    this.id = message.id;
    this.threadId = message.threadId;
    this.from = Utility.parseEmailField(message.from || "");
    this.to = Utility.parseEmailField(message.to || "");
    this.subject = message.subject;
    this.date = message.date;
    this.snippet = message.snippet;
    this.textHtml = message.textHtml;
    this.textPlain = message.textPlain;
    this.attachments = message.attachments;
    this.labelIds = message.labelIds;
    this.historyId = message.historyId;
  }
}

export default Message;
