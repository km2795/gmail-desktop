"use strict";

import Path from "path";
import Config from "./Config";

class User {
  constructor (id, dir, store) {
    this.id = id;
    this.dir = dir || `user${new Date().getTime()}`;
    this.store = store || Path.join(Config.USER_STORE_DIR, `${this.dir}`);
  }

  /**
   * Return the ID of the user object.
   *
   * @param {}
   *
   * @returns {string} - ID of the User object.
   */
  getId () {
    return this.id;
  }

  /**
   * Set the ID of a User object.
   *
   * @param {string} id - ID of the User object.
   *
   * @returns {}
   */
  setId (id) {
    this.id = id;
  }

  /**
   * Get the User's storage directory.
   *
   * @param {}
   *
   * @returns {string} - User's storage directory.
   */
  getDir () {
    return this.dir;
  }

  /**
   * Set the User's storage directory.
   *
   * @param {string} dir - New directory.
   *
   * @returns
   */
  setDir (dir) {
    this.dir = dir;
  }

  /**
   * Get the User's storage location (complete).
   *
   * @param {}
   *
   * @returns {string} - User's storage location.
   */
  getStore () {
    return this.store;
  }

  /**
   * Set the User's storage location (complete).
   *
   * @param {string} store - User's storage directory.
   *
   * @returns
   */
  setStore (store) {
    this.store = store;
  }
}

export default User;
