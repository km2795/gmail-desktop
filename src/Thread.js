"use strict";

import List from "./List";
import Utility from "./Utility";

/* Thread object. */
class Thread {
  constructor (thread) {
    this.threadId = thread.threadId;
    this.from = Utility.parseEmailField(thread.from || "");
    this.to = Utility.parseEmailField(thread.to || "");
    this.date = thread.date;
    this.subject = thread.subject;
    this.labelIds = thread.labelIds;
    this.MessageList = new List();
    this.historyId = thread.historyId;
  }

  /**
   * Add the Message object in the Thread object.
   *
   * @param {object} message - Object to be inserted in the
   * MessageList property.
   *
   * @returns {}
   */
  addMessage (message) {
    if (!this.MessageList.get(message.id)) {
      this.MessageList.add(message.id, message);
    }
  }

  /**
   * Get the message object from the ID.
   *
   * @param {string} id - ID of the Message object to be retrieved.
   *
   * @returns {object} - Message object.
   */
  getMessage (id) {
    return this.MessageList.get(id);
  }

  /**
   * Get all the keys of a Thread object.
   *
   * @param {}
   *
   * @returns {[]} - List of keys of all the Messages
   * of a Thread object.
   */
  getMessageKeys () {
    return this.MessageList.getKeys();
  }

  /**
   * Get all the Message objects of a Thread object.
   *
   * @param {}
   *
   * @returns {[]} - List containing all Message objects of
   * a Thread object.
   */
  getMessageValues () {
    return this.MessageList.getValues();
  }

  /**
   * Get the attachments of the Thread object.
   *
   * @param {}
   *
   * @returns {[]} - List containing all the attachments.
   */
  getAttachmentList () {
    const attachmentList = [];

    this.getMessageValues().map((message) => {
      message.attachments && message.attachments.map((attachment) => {
        attachment.messageId = message.id;
        attachment.threadId = message.threadId;
        attachmentList.push(attachment);
      });
    });

    return attachmentList;
  }

  /**
   * Returns the labels of the Thread.
   *
   * @param {}
   *
   * @return {[]} - Thread's labels.
   */
  getLabels () {
    return this.labelIds;
  }

  /**
   * Update the labels of the Thread.
   *
   * @param {[]} labelIds - Labels to set.
   *
   * @returns {}
   */
  setLabels (labelIds) {
    this.labelIds = labelIds;
  }

  /**
   * Returns the read status of the Thread.
   *
   * @param {}
   *
   * @returns {boolean}
   */
  isRead () {
    return (!(this.getLabels().indexOf("UNREAD") >= 0));
  }
}

export default Thread;
