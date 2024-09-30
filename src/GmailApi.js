"use strict";

import _ from "lodash";
import async from "async";
import fs from "fs";
import Google from "googleapis";
import GoogleAuth from "google-auth-library";
import mailParser from "gmail-api-parse-message";
import Path from "path";
import Config from "./Config";

const GMAIL_API = Google.gmail("v1");

/* Complete scope. Full access to the account. */
var SCOPES = ["https://mail.google.com/"];
var TOKEN_PATH_DIR = "/.credentials/";
var TOKEN_PATH = "gmail_credentials.json";
var tokenExpiryTime = 0;
var defaultAuth;

const GmailApi = {

  checkUserCredentials (userStoreDir, callback) {
    const file = Path.join(userStoreDir, `.credentials`, `gmail_credentials.json`);
    fs.readFile(file, (err, data) => callback(!err));
  },

  getNewAuthenticationParameters (userStoreDir, callback) {
    GmailApi.getClientSecrets((clientSecret) => {
      const clientAuth = GmailApi.getOAuth2Client(clientSecret);
      const url = GmailApi.getAuthenticationUrl(clientAuth);
      callback({
        auth: clientAuth,
        url: url
      });
    });
  },

  storeNewToken (userStoreDir, oauth2Client, code, callback) {
    const file = Path.join(userStoreDir, `.credentials`, `gmail_credentials.json`);
    GmailApi.getNewToken(oauth2Client, code, (status) => {
      if (!status) {
        callback(null);
      } else {
        GmailApi.storeToken(status.token, file);
        callback(status);
      }
    });
  },

  getAuthCredentials (userStoreDir, callback) {
    TOKEN_PATH_DIR = Path.join(userStoreDir, `.credentials`);
    TOKEN_PATH = Path.join(TOKEN_PATH_DIR, `gmail_credentials.json`);

    GmailApi.getClientSecrets((clientSecret) => {
      if (!clientSecret) {
        callback(null);
      } else {
        // Authorize a client with the loaded credentials, then call the Gmail API.
        GmailApi.authorize(clientSecret, callback);
      }
    });
  },

  getClientSecrets (callback) {
    fs.readFile(Config.CLIENT_SECRET, (err, data) => {
      if (err) {
        Config.Logger.error(err);
        callback(null);
      } else {
        callback(JSON.parse(data));
      }
    })
  },

  authorize (credentials, callback) {
    const oauth2Client = GmailApi.getOAuth2Client(credentials);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) {
        GmailApi.getNewToken(oauth2Client, callback);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        callback(oauth2Client);
      }
    });
  },

  getOAuth2Client (credentials) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new GoogleAuth();
    return new auth.OAuth2(clientId, clientSecret, redirectUrl);
  },

  getAuthenticationUrl (oauth2Client) {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });

    return url;
  },

  getNewToken (oauth2Client, code, callback) {
    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        Config.Logger.error(`Error creating new token: ${err}`);
        callback(null);
      } else {
        oauth2Client.credentials = token;
        callback({
          "token": token,
          "auth": oauth2Client
        });
      }
    });
  },

  /**
   * Store the authentication credentials of a user.
   *
   * @param {object} token - Authentication credentials of the user.
   * @param {string} path - Path to the user's authentication credentials storage directory.
   *
   * @returns
   */
  storeToken (token, path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(Path.dirname(path));
    }
    fs.writeFileSync(path, JSON.stringify(token));
  },

  /**
   * Load the auth credentials.
   *
   * @param {string} userStoreDir - User's storage directory.
   *
   * @callback
   */
  loadAuthCredentials (userStoreDir, callback) {
    GmailApi.getAuthCredentials(userStoreDir, (auth) => {
      defaultAuth = auth;
      tokenExpiryTime = defaultAuth.credentials.expiry_date;
      callback();
    });
  },

  /**
   * Update the auth token if it has expired.
   *
   * @param {string} userStoreDir - User's storage directory.
   *
   * @callback
   */
  updateAuthCredentials (userStoreDir, callback) {
    if (tokenExpiryTime < new Date().getTime()) {
      GmailApi.loadAuthCredentials(userStoreDir, () => {
        callback();
      });
    } else {
      callback();
    }
  },

  /**
   * Remove the credentials file.
   *
   * @callback {object} - { "status": boolean }.
   */
  invalidateCredentials (callback) {
    if (!fs.existsSync(TOKEN_PATH_DIR)) {
      callback({ "status": true });
    }

    fs.unlink(TOKEN_PATH, (result) => {
      if (result === null) {
        fs.rmdirSync(TOKEN_PATH_DIR);
        callback({ "status": true });
      } else {
        callback({ "status": false });
      }
    });
  },

  /**
   *
   * Get the list of all the messages (IDs only) along with the threads (IDs only).
   *
   * @param {object} user - User object (info).
   *
   * @callback {object} { "status": boolean, "messageList": [], "threadList": [] }.
   */
  getMessageList (user, callback) {
    GmailApi.updateAuthCredentials(user.store, () => {
      // Lists to be returned.
      const messageList = [];
      const threadList = new Set();

      GMAIL_API.users.messages.list({
        "auth": defaultAuth,
        "userId": user.id,
        "includeSpamTrash": true
      }, function (err, response) {
        if (err) {
          Config.Logger.error("" + err);
          callback({
            "status": false,
            "data": { "messageList": [], "threadList": [] }
          });
        } else {
          // In case, result size estimate is 0.
          if (response.messages) {
            response.messages.map((item) => {
              messageList.push(item.id);
              threadList.add(item.threadId);
            });
          }

          if (response.nextPageToken) {
            getPage(response.nextPageToken, messageList, threadList, callback);
          } else {
            callback({
              "status": true,
              "data": {
                "messageList": messageList,
                "threadList": [...threadList]
              }
            });
          }
        }
      });
    });

    const getPage = function (pageToken, messageList, threadList, callback) {
      GMAIL_API.users.messages.list({
        "auth": defaultAuth,
        "userId": user.id,
        "includeSpamTrash": true,
        "pageToken": pageToken
      }, function (err, response) {
        if (err) {
          callback({
            "status": false,
            "data": {
              "messageList": messageList,
              "threadList": [...threadList]
            }
          });
        } else {
          if (response.messages) {
            response.messages.map((item) => {
              messageList.push(item.id);
              threadList.add(item.threadId);
            });
          }

          if (response.nextPageToken) {
            getPage(response.nextPageToken, messageList, threadList, callback);
          } else {
            callback({
              "status": true,
              "data": {
                "messageList": messageList,
                "threadList": [...threadList]
              }
            });
          }
        }
      });
    }
  },

  /**
   * Fetch the message's info.
   *
   * @param {object} user - User object (info).
   * @param {string} messageId - ID of the message whose info is to be fetched.
   *
   * @callback {object} { "status": boolean, "data": { "message": {} }}
   */
  getMessage (user, messageId, callback) {
    GmailApi.updateAuthCredentials(user.store, () => {
      GMAIL_API.users.messages.get({
        auth: defaultAuth,
        id: messageId,
        userId: user.id,
        format: "full"
      }, function (err, response) {
        callback({
          "status": (!err),
          "data": {
            "message": (
              !err
                ? GmailApi.parseEmailResponse(response)
                : {}
            )
          }
        });
      });
    });
  },

  /**
   * Fetch the attachments.
   *
   * @param {object} user - User object (info).
   * @param {string} attachmentId - ID of the attachment whose info is to be fetched.
   * @param {string} messageId - ID of the message to which the attachment belongs.
   *
   * @callback {object} { "status": boolean }.
   */
  getAttachments (user, attachmentId, messageId, callback) {
    GmailApi.updateAuthCredentials(user.store, () => {
      GMAIL_API.users.messages.attachments.get({
        auth: defaultAuth,
        id: attachmentId,
        messageId: messageId,
        userId: user.id
      }, function (err, response) {
        if (err) {
          Config.Logger.error(err)
          callback({ "status": false });
        } else {
          callback({
            "status": true,
            "attachment": {
              "attachmentId": response.attachmentId,
              "size": response.size,
              "data": response.data
            }
          });
        }
      });
    });
  },

  /**
   * Fetch the list of history IDs.
   *
   * @param {object} user - User object (info).
   * @param {string} historyIdList - history IDs to start with.
   *
   * @callback {object} { "status": boolean, "data": {} }
   */
  getHistoryList (user, startHistoryId, callback) {
    const historyList = [];

    GmailApi.updateAuthCredentials(user.store, () => {
      GMAIL_API.users.history.list({
        "auth": defaultAuth,
        "userId": user.id,
        "startHistoryId": startHistoryId
      }, function (err, response) {
        if (err) {
          Config.Logger.error(err);
          callback({
            "status": false,
            "data": null
          });
        } else {
          // Fetch the history IDs from the next page.
          if (response.nextPageToken) {
            // Concatenate the two lists.
            [...historyList, ...response.history];
            getPage(response.nextPageToken, response.historyId, callback);
          } else {
            callback({
              "status": true,
              "data": {
                "history": response.history,
                "historyId": response.historyId
              }
            });
          }
        }
      });
    });

    const getPage = function (pageToken, startHistoryId, callback) {
      GMAIL_API.users.history.list({
        "auth": defaultAuth,
        "userId": user.id,
        "startHistoryId": startHistoryId,
        "pageToken": pageToken
      }, function (err, response) {
        if (err) {
          callback({
            "status": false,
            "data": null
          });
        } else {
          // Concatenate the two lists.
          [...historyList, ...response.history];

          // Fetch the next page of history IDs.
          if (response.nextPageToken) {
            getPage(response.nextPageToken, response.historyId, callback);
          } else {
            callback({
              "status": true,
              "data": {
                "history": historyList,
                "historyId": response.historyId
              }
            });
          }
        }
      });
    };
  },

  /**
   * Parses the history object to get the changes.
   *
   * @param {object} historyDetails - History details
   *
   * @callback {object} -
   * {
   *  "status": boolean,
   *  "data": {
   *    "change": boolean,
   *    "messagesAdded": [],
   *    "messagesDeleted": []
   *  }
   */
  parseHistoryList (historyDetails) {
    const messagesAddedList = [];
    const messagesDeletedList = [];
    const labelsChanged = [];

    if (historyDetails) {
      // Push to add list.
      if (historyDetails.messagesAdded) {
        historyDetails.messagesAdded.map((item) => {
          messagesAddedList.push(item.message.id);
        });
      }

      // Push to delete list.
      if (historyDetails.messagesDeleted) {
        historyDetails.messagesDeleted.map((item) => {
          messagesDeletedList.push(item.message.id);
        });
      }

      // Push to add labels list.
      if (historyDetails.labelsAdded) {
        historyDetails.labelsAdded.map((item) => {
          labelsChanged.push({
            "threadId": item.message.threadId,
            "labels": item.message.labelIds
          });
        });
      }

      // Push to remove labels list.
      if (historyDetails.labelsRemoved) {
        historyDetails.labelsRemoved.map((item) => {
          labelsChanged.push({
            "threadId": item.message.threadId,
            "labels": item.message.labelIds
          });
        });
      }

      return {
        "change": true,
        "messagesAdded": messagesAddedList,
        "messagesDeleted": messagesDeletedList,
        "labelsChanged": labelsChanged
      };
    } else {
      return { "change": false };
    }
  },

  /**
   *
   * @param {object} user - User object (info).
   *
   * @callback {object} { "status": boolean }.
   */
  getLabels (user, callback) {
    GmailApi.updateAuthCredentials(user.store, () => {
      GMAIL_API.users.labels.list({
        auth: defaultAuth,
        userId: user.id
      }, function (err, response) {
        if (err) {
          Config.Logger.error(err)
          callback({ "status": false });
        } else {
          callback({
            "status": true,
            "labels": response.labels
          });
        }
      });
    });
  },

  /**
   * Used for sending messages.
   *
   * @param {object} user - User object (info).
   * @param {string} email - String containing the email prepended with headers.
   *
   * @callback {object} { "status": boolean }
   */
  sendMessage (user, email, callback) {
    GmailApi.updateAuthCredentials(user.store, () => {
      GMAIL_API.users.messages.send({
        auth: defaultAuth,
        userId: user.id,
        resource: {
          raw: window.btoa(email).replace(/\+/g, "-").replace(/\//g, "_")
        }
      }, function (err, response) {
        if (err) {
          Config.Logger.error(err)
          callback({ "status": false });
        } else {
          callback({ "status": true });
        }
      });
    });
  },

  /**
   * Used for replying to messages.
   *
   * @param {object} user - User object (info).
   * @param {string} email - String containing the email prepended with headers.
   * @param {string} threadId - Thread to which the reply message belong.
   *
   * @callback {object} { "status": boolean }
   */
  replyMessage (user, email, threadId, callback) {
    GmailApi.updateAuthCredentials(user.store, () => {
      GMAIL_API.users.messages.send({
        auth: defaultAuth,
        userId: user.id,
        resource: {
          raw: window.btoa(email).replace(/\+/g, "-").replace(/\//g, "_"),
          threadId: threadId
        }
      }, function (err, response) {
        if (err) {
          Config.Logger.error(err)
          callback({ "status": false });
        } else {
          callback({ "status": true });
        }
      });
    });
  },

  /**
   * Used to parse the response of the email fetch.
   * Will send a desktop notification as well.
   *
   * @param {object} emailBody
   *
   * @returns {object} emailDetails
   */
  parseEmailResponse (emailBody) {
    if (!emailBody) { return {}; }

    const emailDetails = {};
    const parsedMessage = mailParser(emailBody);

    emailDetails.id = parsedMessage.id || null;
    emailDetails.threadId = parsedMessage.threadId || null;
    emailDetails.from = parsedMessage.headers.from || null;
    emailDetails.to = parsedMessage.headers.to || null;
    emailDetails.subject = parsedMessage.headers.subject || null;
    emailDetails.date = new Date(parsedMessage.headers.date).getTime() || null;
    emailDetails.textHtml = parsedMessage.textHtml || null;
    emailDetails.textPlain = parsedMessage.textPlain || null;
    emailDetails.snippet = parsedMessage.snippet || null;
    emailDetails.attachments = parsedMessage.attachments || [];
    emailDetails.labelIds = parsedMessage.labelIds || [];
    emailDetails.historyId = parsedMessage.historyId || 0;

    return emailDetails;
  },

  /**
   * Modify the thread by adding/removing labels.
   *
   * @param {object} user - User object (info).
   * @param {string} threadId - ID of the thread to modify.
   * @param {[]} labelsToAdd - Labels to add to the thread.
   * @param {[]} labelsToRemove - Labels to remove from the thread.
   *
   * @callback {object} { "status": boolean }
   */
  modifyThread (user, threadId, labelsToAdd, labelsToRemove, callback) {
    GmailApi.updateAuthCredentials(user.store, () => {
      GMAIL_API.users.threads.modify({
        auth: defaultAuth,
        userId: user.id,
        id: threadId,
        addLabelIds: labelsToAdd,
        removeLabelIds: labelsToRemove
      }, function (err, thread) {
        if (err) {
          Config.Logger.error(err);
          callback({ "status": false });
        } else {
          callback({
            "status": true,
            "data": thread
          });
        }
      });
    });
  },

  /**
   *
   * @param {object} user - User object (info).
   * @param {string} messageId - Message to put in trash.
   *
   * @callback {object} { "status": boolean }
   */
  trashMessage (user, messageId, callback) {
    GmailApi.updateAuthCredentials(user.store, () => {
      GMAIL_API.users.messages.trash({
        auth: defaultAuth,
        userId: user.id,
        id: messageId
      }, function (err, message) {
        if (err) {
          if (err.code !== 404) {
            Config.Logger.error(err);
            callback({ "status": false });
          }
        } else {
          callback({ "status": true });
        }
      });
    });
  },

  /**
   *
   * @param {object} user - User object (info).
   * @param {string} threadId - Thread to put in trash.
   *
   * @callback {object} { "status": boolean }
   */
  trashThread (user, threadId, callback) {
    GmailApi.updateAuthCredentials(user.store, () => {
      GMAIL_API.users.threads.trash({
        auth: defaultAuth,
        userId: user.id,
        id: threadId
      }, (err, message) => {
        if (err) {
          if (err.code !== 404) {
            Config.Logger.error(err);
            callback({ "status": false });
          }
        } else {
          callback({ "status": true });
        }
      });
    });
  }

};

export default GmailApi;
