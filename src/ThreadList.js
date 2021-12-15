/* eslint-disable no-empty-pattern */
"use strict";

import _ from "lodash";
import DataStoreManager from "./DataStoreManager";
import List from "./List";
import Thread from "./Thread";

class ThreadList extends List {
  constructor () {
    super();

    let {} = new List();
  }

  /**
   * Get the ID of a thread from the ID of a message (Message) object.
   *
   * @param {string} id - ID of the message.
   *
   * @returns {string} - ID of the thread of the message.
   */
  getThreadIdFromMessageId (id) {
    const self = this;
    return self.getKeys().find(
      (thread) => self.get(thread).getMessageKeys().indexOf(id) !== -1);
  }

  /**
   * Delete a thread from the 'ThreadList'.
   *
   * @param {string} id - ID of the thread to be deleted.
   *
   * @return {}
   */
  deleteThread (id) {
    this.remove(id);
  }

  /**
   * Get all the Message objects' keys of a thread.
   *
   * @param {string} id - ID of the thread whose Message objects'
   * keys are to be returned.
   *
   * @returns {[]} - List of Message objects' keys of the thread.
   */
  getMessageKeys (id) {
    const self = this;

    if (id) {
      return self.get(id).getMessageKeys();
    }

    return self.getKeys().reduce((temp, thread) =>
      [...temp, ...self.get(thread).getMessageKeys()], []);
  }

  /**
   * Get all the Message objects of a thread.
   *
   * @param {string} id - ID of the thread whose Message objects
   * are to be returned.
   *
   * @returns {[]} - List of Message objects of the thread.
   */
  getMessageValues (id) {
    const self = this;

    if (id) {
      return self.get(id).getMessageValues();
    }

    return self.getKeys().reduce((temp, thread) =>
      [...temp, ...self.get(thread).getMessageValues()], []);
  }

  /**
   * Get the threads with a specific label.
   *
   * @param {string} label - Label to look for in the thread.
   *
   * @returns {[]} - List of thread with the matching @param {string} label.
   */
  getLabelSpecificThreadList (label) {
    // "ALL" is application specific label.
    label = (label === "__ALL__") ? "" : label.toLowerCase();

    let list = this.getValues();

    // If a thread has any other label besides "trash" and/or "spam",
    // the thread would still be shown inside the "trash" or "spam" label.
    if (label !== "spam" && label !== "trash") {
      list = list.filter(
        (thread) => thread.labelIds.indexOf("SPAM") < 0 && thread.labelIds.indexOf("TRASH") < 0);
    }

    return (label.length > 0)
      ? list.filter(
        (thread) => thread.labelIds.find(
          (labelItem) => labelItem.toLowerCase() === label))
      : list;
  }

  /**
   * Retrieve Message object using ID.
   *
   * @param {string} id - ID of the Message object which is to be retrieved.
   *
   * @returns {object} - Message object.
   */
  getMessageObject (id) {
    return this.getValues().find((thread) => thread.getMessage(id));
  }

  /**
   * Insert the message object in the "MessageList", if not already added.
   *
   * @param {object} message - Message object to insert in the ThreadList.
   *
   * @returns {}
   */
  insertMessage (message) {
    /*
     * Initialize the array for the specific thread
     * to store the messages of that the conversation.
     */
    if (!this.get(message.threadId)) {
      this.add(message.threadId, new Thread(message));
    }

    const thread = this.get(message.threadId);
    // Update the date of the thread.
    thread.date = thread.date < message.date ? message.date : thread.date;
    // Add the Message object in the Thread object.
    thread.addMessage(message);
  }

  /**
   * Load the ThreadList.
   *
   * @param {string} userStoreDir - User's cache storage ID.
   *
   * @callback
   */
  load (userStoreDir, callback) {
    const self = this;

    DataStoreManager.getAllMessages(userStoreDir, (result) => {
      result.data.map((message) => self.insertMessage(message));
      typeof callback === "function" ? callback() : {};
    });
  }

  /**
   * Reload the ThreadList.
   *
   * @param {string} userStoreDir - User's cache storage ID.
   *
   * @callback
   */
  reload (userStoreDir, callback) {
    this.load(userStoreDir, () => callback());
  }
}

export default ThreadList;
