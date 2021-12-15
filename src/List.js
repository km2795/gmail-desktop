function List (buffer, delimiter) {
  // eslint-disable-next-line no-empty-pattern
  const self = {} = this;

  /*
   * If no parameter is passed.
   * Default constructor kind-of.
   */
  if (buffer == undefined) {
    return;
  }

  // Temporary.
  let list = [];

  // Check the type of object.
  switch (Object.prototype.toString.call(buffer)) {
    // JSON object.
    case "[object Object]":
      this.load(buffer);
      return;

    // Buffer.
    case "[object Uint8Array]":
      list = buffer.toString().split(delimiter);
      break;

    // Array.
    case "[object Array]":
      list = buffer;
      break;

    // String.
    case "[object String]":
      list = buffer.split(delimiter);
      break;
  }

  // Create JSON from array with numeric indices.
  list.map((item, i) => {
    self[i++] = item;
  });
}

List.prototype.load = function (obj) {
  const self = this;
  const keys = Object.keys(obj);
  keys.map((item) => {
    self.add(item, obj[item]);
  });
}

/**
 * Add key/value to the List.
 *
 * @param {string} key - Key of the entry.
 * @param {any} value - Value of the entry.
 *
 * @returns {}
 */
List.prototype.add = function (key, value) {
  this[key] = value;
};

/**
 * Remove entry from the List.
 *
 * @param {string} key - Key of the entry to be removed.
 *
 * @returns {}
 */
List.prototype.remove = function (key) {
  delete this[key];
};

/**
 * Get the object value from the List with the help of the ID.
 *
 * @param {string} key - Key of the entry whose value is to be retrieved.
 *
 * @returns {any} - Value.
 */
List.prototype.get = function (key) {
  return this[key];
};

/**
 * Return the number of key/value pairs in the List.
 *
 * @param {}
 *
 * @returns {number} - Size of the List.
 */
List.prototype.size = function () {
  return this.getKeys().length;
};

/**
 * Return a list containing all the keys of the List.
 *
 * @param {}
 *
 * @returns {[]} - List containing all the keys.
 */
List.prototype.getKeys = function () {
  return Object.keys(this);
};

/**
 * Returns a list containing all the values of the List.
 *
 * @param {}
 *
 * @returns {[]} - List containing all the values.
 */
List.prototype.getValues = function () {
  return this.getKeys().map((i) => this[i]);
};

export default List;
