"use strict";

import _ from "lodash";
import fs from "fs-extra";
import Config from "./Config";
import User from "./User";

class UserList {
  constructor () {
    this.currentUser = null;
    this.userList = {};
  }

  /**
   * Add new user to the list.
   *
   * @param {string} id - ID of the User to add.
   *
   * @returns {object} - Returns the newly created User object.
   */
  add (id) {
    const user = new User(id);
    this.userList[id] = user;
    return user;
  }

  /**
   * Create the storage directory for the User.
   *
   * @param {string} id - ID of the User, whose directory is to be created.
   *
   * @returns
   */
  createUserStorage (id) {
    const user = this.getUser(id);
    fs.mkdirSync(user.store);
  }

  /**
   * Remove the storage directory of the User.
   *
   * @param {string} id - ID of the User.
   *
   * @returns
   */
  removeUserStorage (id) {
    const user = this.getUser(id);
    fs.emptyDirSync(user.store);
  }

  /**
   * Remove the User from the UserList.
   *
   * @param {string} id - ID of the User.
   *
   * @returns
   */
  remove (id) {
    delete this.userList[id];
    this.store();
  }

  /**
   * Check whether User exists or not.
   *
   * @param {string} id - ID of the User.
   *
   * @returns {boolean} - Exists or not.
   */
  checkUser (id) {
    return (!!this.userList.getUser(id));
  }

  /**
   * Get the User object.
   *
   * @param {string} id - ID of the User.
   *
   * @returns {object/null} - Object or null.
   */
  getUser (id) {
    return this.userList[id] || null;
  }

  /**
   * Get the array containing all the Users' IDs.
   *
   * @param {}
   *
   * @returns {[]} - List containing all the Users' IDs.
   */
  getUserIds () {
    return Object.keys(this.userList) || [];
  }

  /**
   * Get the array containing all the Users' objects.
   *
   * @param {}
   *
   * @returns {[]} - Array containing all the Users' objects.
   */
  getUsers () {
    const self = this;
    return this.getUserIds().map((id) => self.userList[id]) || [];
  }

  /**
   * Get the current user.
   *
   * @param {}
   *
   * @returns {object} - Object of the current User.
   */
  getCurrentUser () {
    return this.currentUser;
  }

  /**
   * Set the new current User.
   *
   * @param {object} user - User object to be set as new.
   *
   * @returns {}
   */
  setCurrentUser (user) {
    this.currentUser = user;
  }

  /**
   * Load the UserList.
   *
   * @param {}
   *
   * @callback
   */
  load (callback) {
    const self = this;
    fs.readFile(Config.USER_LIST_FILE, (err, data) => {
      if (err) {
        Config.Logger.error(err);
      } else {
        data = JSON.parse(data.toString());
        if (!_.isEmpty(data)) {
          const oldData = data;
          Object.keys(oldData.userList).map((item) => {
            const data = oldData.userList[item];
            self.userList[item] = new User(data.id, data.dir, data.store);
          });
        }
      }
      callback();
    });
  }

  /**
   * Store the UserList in file system.
   *
   * @param {}
   *
   * @returns {}
   */
  store () {
    const self = this;
    fs.writeFileSync(Config.USER_LIST_FILE, JSON.stringify(self));
  }
}

export default UserList;
