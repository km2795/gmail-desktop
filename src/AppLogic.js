"use strict";

import _ from "lodash";
import fs from "fs";
import Path from "path";
import { shell } from "electron";
import Winston from "winston";
import Config from "./Config";
import DataStoreManager from "./DataStoreManager";
import GmailApi from "./GmailApi";
import List from "./List";
import Message from "./Message";
import Utility from "./Utility";

const App = {

  /**
   * Check the files and directories.
   */
  checkDirectoryStructure: () => {
    // Check for main storage directory.
    if (!fs.existsSync(Config.STORE_DIR)) {
      fs.mkdirSync(Config.STORE_DIR);
    }

    // Check for log storage directory.
    if (!fs.existsSync(Config.LOG_DIR)) {
      fs.mkdirSync(Config.LOG_DIR);
    }

    // Instantiate the Logger.
    Config.Logger = Winston.createLogger({
      format: Winston.format.json(),
      transports: [
        new Winston.transports.File({
          level: "error",
          filename: `.store/.logs/error.log`
        })
      ]
    })

    // Users' data directory.
    if (!fs.existsSync(Config.USER_STORE_DIR)) {
      fs.mkdirSync(Config.USER_STORE_DIR);
    }

    // Check for user list file.
    if (!fs.existsSync(Config.USER_LIST_FILE)) {
      fs.writeFileSync(Config.USER_LIST_FILE, "{}");
    }
  },

  /**
   * Check for user's credentials.
   *
   * @param {string} userStoreDir - User's storage directory.
   *
   * @callback {}
   */
  checkUserCredentials: (userStoreDir, callback) =>
    GmailApi.checkUserCredentials(
      userStoreDir,
      (status) => callback(status)
    ),

  /**
   * Load the user's configurations from the credentials.
   * If not present (in case of new user), show the authentication
   * box and open the authentication URL in an external browser for
   * performing the authentication.
   *
   * @param {string} userStoreDir - User's storage directory.
   * @param {function} showAuthenticationTokenBox - For opening
   * the authentication box.
   * @param {function} main - For starting the application.
   */
  loadConfig: (userStoreDir, showAuthenticationTokenBox, main) => {
    // Check if the current user's credentials are present or not.
    App.checkUserCredentials(userStoreDir, (status) => {
      if (!status) {
        GmailApi.getNewAuthenticationParameters(
          userStoreDir,
          (param) => {
            /*
             * Open default external browser (not in app)
             * with the auth. URL.
             */
            shell.openExternal(param.url.toString());

            // Show the authentication token input box in the app.
            showAuthenticationTokenBox(param.auth);
          }
        );
      } else {
        main();
      }
    });
  },

  /**
   * Login or sign-up a user.
   *
   * @param {string} email - Email address of the user.
   * @param {boolean} createNew - Whether a new user.
   *
   * @returns {}
   */
  logInUser: (email, createNew, userList, showAuthBox, main) => {
    let user = userList.getUser(email);

    // If 'createNew' is true, only then can we create a new user.
    if (!user && createNew) {
      user = userList.add(email);
      userList.createUserStorage(email);
    }

    // Set the current user and load current user's configuration.
    Config.User = user;
    userList.setCurrentUser(Config.User);
    Config.LABELS_STORE = Path.join(Config.User.store, `labels.json`);
    Config.HISTORY_ID_STORE = Path.join(Config.User.store, `historyId.txt`);

    // Store the configuration.
    userList.store();

    // Load the remaining configs.
    App.loadConfig(Config.User.store, showAuthBox, main);
  },

  /**
   * Check if there are new messages in the Gmail mailbox.
   *
   * @param {object} user - User object (info).
   * @param {[]} storedMessages - List of locally stored messages' ID.
   *
   * @callback {[]} - New messages' ID list or empty list.
   */
  checkForNewMessages: (user, storedMessages, callback) => {
    GmailApi.getMessageList(user, (result) => {
      callback({
        "status": result.status,
        "data": (result.data.messageList.length > 0
          ? Utility.getUnique(result.data.messageList, storedMessages)
          : [])
      });
    });
  },

  /**
   * Fetch a message (using message's ID @param {string} messageId)
   * object using GMAIL API and then store in local
   * cache (database).
   *
   * @param {object} user - User object (info).
   * @param {object} Threads - Threads object.
   * @param {string} messageId - ID of the message to fetch.
   * @param {[]} historyIdList - List of history IDs of the
   * messages fetched.
   *
   * @callback {{ "status" : boolean }} - Fetch status.
   */
  fetchAndStoreMessage: (user, Threads, messageId, historyIdList, callback) => {
    GmailApi.getMessage(user, messageId, (result) => {
      if (result.status) {
        // Store it in the 'this.state.Threads' object.
        Threads.insertMessage(new Message(result.data.message), true);

        // Add the message object in local cache (database).
        DataStoreManager.addMessage(
          Path.basename(user.store),
          result.data.message,
          (res) => {
            historyIdList.push(result.data.message.historyId);
            callback({ "status": res.status });
          }
        );
      } else {
        callback({ "status": result.status });
      }
    });
  },

  /**
   * Fetch a message (using message's ID @param {string} messageId)
   * object using GMAIL API and then update it in local
   * cache (database).
   *
   * @param {object} user - User object (info).
   * @param {object} Threads - Threads object.
   * @param {string} messageId - ID of the message to fetch.
   * @param {string} historyIdList - List of the history IDs of
   * the messages fetched.
   *
   * @callback {{ "status" : boolean }} - Fetch status.
   */
  fetchAndUpdateMessage: (user, Threads, messageId, historyIdList, callback) => {
    GmailApi.getMessage(user, messageId, (result) => {
      if (result.status) {
        // Store it in the 'this.state.Threads' object.
        Threads.insertMessage(new Message(result.data.message), true);

        // Add the message object in local cache (database).
        DataStoreManager.updateMessage(
          Path.basename(user.store),
          result.data.message,
          (res) => {
            historyIdList.push(result.data.message.historyId);
            callback({ "status": res.status });
          }
        );
      } else {
        callback({ "status": result.status });
      }
    });
  },

  /**
   * Fetch the labels using the Gmail API and store
   * them in the local cache. If fetch goes unsuccessful,
   * load labels from the local cache.
   *
   * @param {object} user - User object (info).
   *
   * @callback {{}} - Return fetched or locally stored labels.
   */
  fetchLabels: (user, callback) => {
    const labels = new List();
    GmailApi.getLabels(user, (response) => {
      // No response, use the locally stored labels.
      if (!response.status) {
        // Load labels from local cache.
        App.loadLocalLabels(
          Config.LABELS_STORE,
          (labels) => callback(new List(labels))
        );
      } else {
        // Parse the fetched labels.
        response.labels.map((label) => labels.add(label.id, label));
        // Store the labels in the local cache.
        App.storeLabels(
          Config.LABELS_STORE,
          labels,
          () => callback(labels)
        );
      }
    });
  },

  /**
   * Remove all entries from the local database.
   *
   * @param {}
   *
   * @callback { "status": boolean }
   */
  emptyUserStore: (callback) => {
    DataStoreManager.removeAllEntriesFromUserStore(
      Config.User.dir,
      (result) => callback(result)
    );
  },

  /**
   * Delete the thread from local cache and mailbox.
   *
   * @param {string} threadId - ID of the thread to delete.
   * @param {boolean} fullDelete - Whether to delete in the
   * mailbox or not.
   * @param {object} Threads - ThreadsList object.
   *
   * @callback { "status": boolean }
   */
  deleteThread: (threadId, fullDelete, Threads, callback) => {
    // Remove the thread from the local cache.
    if (fullDelete) {
      GmailApi.trashThread(Config.User, threadId, (result) => {
        if (!result.status) {
          console.log("Internal Error");
        }
        callback(result);
      });
    } else {
      // Delete the thread from the local database.
      DataStoreManager.deleteThread(
        Config.User.dir,
        threadId,
        (result) => {
          // Update the 'Threads' object.
          Threads.deleteThread(threadId);
          callback(result);
        }
      );
    }
  },

  /**
   * Change the read status of a thread.
   *
   * @param {string} id - ID of the thread.
   * @param {object} Threads - Threads object.
   *
   * @callback
   */
  changeThreadReadStatus: (id, Threads, callback) => {
    const thread = Threads.get(id);

    // Update the read status of the thread object.
    const readStatus = !thread.isRead();

    App.modifyThreadLabels(
      id,

      // If the read, send empty 'add label' array and vice-versa.
      (readStatus ? [] : ["UNREAD"]),
      (readStatus ? ["UNREAD"] : []),
      (result) => {
        if (result.status) {
          // Update the status in the local cache.
          DataStoreManager.updateThreadReadStatus(
            Config.User.dir,
            thread.threadId,
            readStatus,
            (result) => callback()
          );
        } else {
          callback();
        }
      }
    );
  },

  /**
   * Wrapper for updateThreadLabels() in DataStoreManager.
   *
   * @param {string} threadId - ID of the thread to update.
   * @param {[]} updatedLabels - New updated labels list.
   * @param {{}} Threads - The main Thread object.
   *
   * @callback {}
   */
  updateThreadLabels: (threadId, updatedLabels, Threads, callback) => {
    const thread = Threads.get(threadId);

    // Update the thread object.
    thread.setLabels(updatedLabels);

    DataStoreManager.updateThreadLabels(
      Config.User.dir,
      threadId,
      updatedLabels,
      () => {
        callback();
      }
    );
  },

  /**
   * Wrapper for the API method.
   *
   * @param {string} id - ID of the thread to modify.
   * @param {[]} labelsToAdd - List of labels to add to the thread.
   * @param {[]} labelsToRemove - List of labels to remove from the thread.
   *
   * @callback {} - { "status": boolean, "data": [] }
   */
  modifyThreadLabels: (id, labelsToAdd, labelsToRemove, callback) => {
    GmailApi.modifyThread(Config.User, id, labelsToAdd, labelsToRemove, (result) => {
      if (result.status) {
        DataStoreManager.updateThreadLabels(
          Config.User.dir,
          id,
          result.data.messages[0].labelIds || [],
          (res) => {
            if (res.status) {
              callback({
                "status": result.status,
                "data": result.data.messages[0].labelIds || []
              });
            }
          }
        );
      }
    });
  },

  /**
   * Search the Message objects against a @param {string} val value.
   *
   * @param {[]} list - Array containing "Message" objects.
   * @param {string} input - Value to search for.
   *
   * @return {object} - Key/Value pair. Thread values matching
   * against a matching 'from/to' field of a Message object.
   */
  searchMessages: (list, input) => {
    // If nothing is inputted, pass empty object (to show nothing).
    if (input.length < 1) {
      return {};
    }

    // Temporary variable to store searched results.
    let searchedList = [];

    // For sent "To" email.
    if (input.toLowerCase().indexOf("to:") === 0) {
      searchedList = [...new Set([...Utility.search(list, input.substring(3), "to")])];

    // For came "From" emails.
    } else if (input.toLowerCase().indexOf("from:") === 0) {
      searchedList = [...new Set([...Utility.search(list, input.substring(5), "from")])];

    // For "subject" emails.
    } else if (input.toLowerCase().indexOf("subject:") === 0) {
      searchedList = [...new Set([...Utility.search(list, input.substring(8), "subject")])];

    // For "body" part of the emails.
    } else if (input.toLowerCase().indexOf("body:") === 0) {
      searchedList = [...new Set([...Utility.search(list, input.substring(5), "textPlain")])];

    // Compiled list of search with specified fields.
    } else {
      searchedList = [...new Set([
        ...Utility.search(list, input, "subject"),
        ...Utility.search(list, input, "to"),
        ...Utility.search(list, input, "from")
      ])];
    }

    // What to return as result.
    const suggestionList = {};

    // To refine the searched results.
    searchedList.map((item) => {
      // Suggestions will show email address only.
      const fromTo =
        Utility.subsequence(item.to || "", Config.User.id || "")
          ? item.from
          : item.to;

      // Add fromTo, if not present in the suggestion list.
      if (!suggestionList[fromTo]) {
        suggestionList[fromTo] = new Set();
      }

      // List of threads that are matching this fromTo.
      suggestionList[fromTo].add(item.threadId);
    });

    return suggestionList;
  },

  /**
   * Read the history ID list from the file.
   *
   * @param {string} historyIdStore - File location of the
   * history Id file.
   *
   * @callback { "status": false, "data": [] }
   */
  loadHistoryId: (historyIdStore, callback) => {
    fs.readFile(historyIdStore, (err, data) => {
      if (err) {
        Config.Logger.error(err);
      }
      callback({
        "status": !err,
        "data": !err ? Number(data.toString()) : 0
      });
    });
  },

  /**
   * Store the history ID in the file.
   *
   * @param {string} historyIdStore - File location of the
   * history Id file.
   * @param {string} historyId - History Id.
   *
   * @callback { "status": boolean }
   */
  storeHistoryId: (historyIdStore, historyId, callback) => {
    fs.writeFile(historyIdStore, historyId, (err, data) => {
      if (err) {
        Config.Logger.error(err);
      }
      callback({ "status": !err });
    });
  },

  /**
   * Retrieves the labels from the local cache.
   *
   * @param {string} - File location for the label store.
   *
   * @callback {}
   */
  loadLocalLabels: (labelStore, callback) => {
    fs.readFile(labelStore, (err, data) => {
      if (err) {
        Config.Logger.error(err);
        callback({ "status": false });
      } else {
        callback(JSON.parse(data));
      }
    });
  },

  /**
   * Stores the labels in the local cache.
   *
   * @param {string} labelStore - File location of the local label store.
   * @param {{}} labels - Label object to store.
   *
   * @callback {}
   */
  storeLabels: (labelStore, labels, callback) => {
    fs.writeFile(labelStore, JSON.stringify(labels), (err) => {
      if (err) {
        Config.Logger.error(err);
      }
      callback({ "status": !err });
    });
  }

};

export default App;
