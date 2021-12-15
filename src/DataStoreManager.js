import { MongoClient } from "mongodb";
import Config from "./Config";

/* Connection URL. */
const URL = "mongodb://localhost:27017";

/* Database name. */
const DATA_STORE_NAME = "MAILS";

/* Handle for Data store. */
var DATA_STORE_HANDLE = null;

const DataStoreManager = {

  /**
   * To initialize the DataStore.
   *
   * @param {string} userStore - Collection name of the user.
   *
   * @callback { "status": boolean } - Data store handle received or not.
   */
  initializeDataStore (userStore, callback) {
    if (!DATA_STORE_HANDLE) {
      DataStoreManager.connect(userStore, (result) => {
        DATA_STORE_HANDLE = result;
        callback({ "status": !!result });
      });
    } else {
      callback({ "status": true });
    }
  },

  /**
   * To connect to the database.
   *
   * @param {string} userStore - Collection name of the user.
   *
   * @callback
   */
  connect (userStore, callback) {
    MongoClient.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, client) => {
      if (err) {
        Config.Logger.error(err);
        callback(null);
      } else {
        callback(client.db(DATA_STORE_NAME).collection(userStore) || null);
      }
    });
  },

  /**
   * To add a message to the database.
   *
   * @param {string} userStore - Collection name of the user.
   * @param {object} message - Message to be stored.
   *
   * @callback - Returns { "status": boolean }
   */
  addMessage (userStore, message, callback) {
    // To overwrite the default "_id" property that MongoDB will set automatically.
    message._id = message.id;

    DataStoreManager.initializeDataStore(userStore, (result) => {
      if (result.status) {
        DATA_STORE_HANDLE.insertOne(message, (err, result) => {
          if (err) {
            Config.Logger.error(err);
            callback({ "status": false });
          } else {
            callback({ "status": true });
          }
        });
      } else {
        callback({ "status": false });
      }
    });
  },

  /**
   * To retrieve a message from the database.
   *
   * @param {string} userStore - Collection name of the user.
   * @param {string} messageId - ID of the message to be retrieved.
   *
   * @callback - Returns { "status": boolean, ?["data": {}] }
   */
  getMessage (userStore, messageId, callback) {
    DataStoreManager.initializeDataStore(userStore, (result) => {
      if (result.status) {
        DATA_STORE_HANDLE.find({ "id": messageId }).toArray((err, docs) => {
          if (err) {
            Config.Logger.error(err);
            callback({ "status": false });
          } else {
            callback({ "status": true, "data": docs });
          }
        });
      } else {
        callback({ "status": false });
      }
    });
  },

  /**
   * To retrieve all the messages stored in the database.
   *
   * @param {string} userStore - Collection name of the user.
   *
   * @callback - Returns { "status": boolean, ?["data": {}] }
   */
  getAllMessages (userStore, callback) {
    DataStoreManager.initializeDataStore(userStore, (result) => {
      if (result.status) {
        DATA_STORE_HANDLE.find({}).toArray((err, docs) => {
          if (err) {
            Config.Logger.error(err);
            callback({ "status": false });
          } else {
            callback({ "status": true, "data": docs });
          }
        });
      } else {
        callback({ "status": false });
      }
    });
  },

  /**
   * To delete a message from the database.
   *
   * @param {string} userStore - Collection name of the user.
   * @param {string} messageId - ID of the message to be deleted.
   *
   * @callback - Returns { "status": boolean }
   */
  deleteMessage (userStore, messageId, callback) {
    DataStoreManager.initializeDataStore(userStore, (result) => {
      if (result.status) {
        DATA_STORE_HANDLE.deleteMany({ "id": messageId }, (err) => {
          if (err) {
            Config.Logger.error(err);
          }
          callback({ "status": !err });
        });
      }
    });
  },

  /**
   * To delete all the messages with matching @param {string} threadID.
   *
   * @param {string} userStore - Collection name of the user.
   * @param {string} threadId - ID of the thread to be deleted.
   *
   * @callback - Returns { "status": boolean }
   */
  deleteThread (userStore, threadId, callback) {
    DataStoreManager.initializeDataStore(userStore, (result) => {
      if (result.status) {
        DATA_STORE_HANDLE.deleteMany({ "threadId": threadId }, (err) => {
          if (err) {
            Config.Logger.error(err);
          }
          callback({ "status": !err });
        });
      }
    });
  },

  /**
   * To update a message document with a new one.
   * Note: connect() is called twice.
   *
   * @param {string} userStore - Collection name of the user.
   * @param {object} message - New message document to replace with.
   *
   * @callback
   */
  updateMessage (userStore, newMessage, callback) {
    // To overwrite the default "_id" property that MongoDB will set automatically.
    newMessage._id = newMessage.id;
    DataStoreManager.initializeDataStore(userStore, (result) => {
      if (result.status) {
        DATA_STORE_HANDLE.getMessage(userStore, newMessage.id, (result) => {
          if (result.status) {
            // To keep the previous read status.
            newMessage.isRead = result.data[0].isRead;
          }

          // Replace the one old document with new/updated one.
          DATA_STORE_HANDLE.replaceOne(
            { "id": newMessage.id },
            newMessage,
            (err) => {
              if (err) {
                Config.Logger.error(err);
              }
              callback({ "status": !err });
            }
          );
        });
      }
    })
  },

  /**
   *
   * @param {string} userStore userStore - Collection name of the user.
   * @param {string} threadId - ID of the thread.
   * @param {[]} labels - Labels to update.
   *
   * @callback - Return { "status": boolean }
   */
  updateThreadLabels (userStore, threadId, labels, callback) {
    DataStoreManager.initializeDataStore(userStore, (result) => {
      if (result.status) {
        DATA_STORE_HANDLE.updateMany(
          { "threadId": threadId },
          { $set: { "labelIds": labels } },
          (err) => {
            if (err) {
              Config.Logger.error(err);
            }
            callback({ "status": !err });
          }
        );
      }
    });
  },

  /**
   * To update the read status of a message object in the database.
   *
   * @param {string} userStore - Collection name of the user.
   * @param {string} threadId - ID of the thread.
   * @param {boolean} status - read/unread (true/false).
   *
   * @callback - Returns { "status": boolean }
   */
  updateThreadReadStatus (userStore, threadId, status, callback) {
    DataStoreManager.initializeDataStore(userStore, (result) => {
      if (result.status) {
        DATA_STORE_HANDLE.updateMany(
          { "threadId": threadId },
          { $set: { "isRead": status } },
          (err) => {
            if (err) {
              Config.Logger.error(err);
            }
            callback({ "status": !err });
          }
        );
      }
    });
  },

  /**
   * To remove all entries from the user's store.
   *
   * @param {string} userStore - Collection name of the user.
   *
   * @callback - Returns { "status": boolean }
   */
  removeAllEntriesFromUserStore (userStore, callback) {
    DataStoreManager.initializeDataStore(userStore, (result) => {
      if (result.status) {
        DATA_STORE_HANDLE.deleteMany({}, (err) => {
          if (err) {
            Config.Logger.error(err);
          }
          callback({ "status": !err });
        });
      }
    });
  }
};

export default DataStoreManager;
