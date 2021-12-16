/* eslint-disable brace-style */
"use strict";

const Utility = {

  /*
   * To show full name of the month instead of abbreviations
   * provided by getMonth() method.
   */
  MonthNames: [
    "January", "February", "March", "April",
    "May", "June", "July", "August", "September",
    "October", "November", "December"
  ],

  /**
   * Check if @param {string} val2 is a subsequence of
   * @param {string} val1.
   *
   * @param {string} val1 - String to be analyzed.
   * @param {string} val2 - Pattern to check for.
   *
   * @returns {boolean} - Whether a subsequence or not.
   */
  subsequence: (val1, val2) => {
    val1 = escape(val1.toString().toLowerCase());
    val2 = escape(val2.toString().toLowerCase());

    // Form the regex for val2. e.g., "gmail" --> /g.*m.*a.*i.*l.*/i
    const regex = new RegExp(
      val2.split("").map((ch) => `${ch}.*`).join(""),
      "i"
    );

    return (!!val1.match(regex));
  },

  /*
   * Remove duplicate elements from a list.
   *
   * @param {[]} list - List to be analyzed.
   *
   * @returns {[]} - new list with duplicates removed.
   */
  removeDuplicates: (list) => [...new Set(list)],

  /**
   * Get the unique elements from two given lists (arrays).
   *
   * @param {[]} listA - List first.
   * @param {[]} listB - List second.
   *
   * @returns {[]} - unique elements, if any.
   */
  disjunct: (listA, listB) => {
    return [
      ...listA.filter((item) => listB.indexOf(item) === -1),
      ...listB.filter((item) => listA.indexOf(item) === -1)
    ];
  },

  /**
   * Get the unique element from @param {[]} list.
   *
   * @param {[]} list - List to be analyzed.
   * @param {[]} excludedItems - Exclude these, if present.
   *
   * @returns {[]} - unique elements, if any.
   */
  getUnique: (list, excludedItems) => list.filter(
    (item) => excludedItems.indexOf(item) === -1
  ),

  /**
   * Search an array comprised of objects (JSON).
   * Search particular field @param {string} field in
   * the object in the @param {[]} list against
   * a @param {string} val value.
   *
   * @param {[]} list - Array containing objects.
   * @param {string} val - Value to search for.
   * @param {string} field - Field to search for in the object.
   *
   * @returns {[]} - List containing matching item.
   */
  search: (list, val, field) =>
    list.filter((item) => Utility.subsequence(item[field] || "", val)),

  /**
   * Check if the item is present in the list.
   *
   * @param {[]} list - List to be analyzed.
   * @param {[]} value - Item to check for.
   * @param {boolean} isNotString - For non-string values or list elements.
   * @param {boolean} isCaseSensitive - If the value to be checked is
   * case sensitive.
   *
   * @returns {boolean} - Whether item in list or not.
   */
  isInList: (list, value, isNotString, isCaseSensitive) => {
    if (isCaseSensitive || isNotString) {
      return (list.find(
        (item) => item === value) != null
      );
    } else {
      return (list.find(
        (item) => item.toLowerCase() === value.toLowerCase()) != null
      );
    }
  },

  /**
   * To shorten long byte notation.
   *
   * @param {number} - Bytes to be quantified.
   *
   * @returns {string} - Shorter notation.
   */
  quantifyBytes: (bytes) => {
    const len = bytes.toString().length;

    if (len < 4) { return bytes + " B"; }
    else if (len < 7) { return (bytes / 1000) + " KB"; }
    else if (len < 10) { return (bytes / 1000000) + " MB"; }
    else if (len < 13) { return (bytes / 1000000000) + " GB"; }
    else if (len < 16) { return (bytes / 1000000000000) + " TB"; }
  },

  /**
   * Check if the email field contains the name part
   * also, return it if present else return the modified string with
   * <> brackets replaced by [] brackets.
   *
   * @param {string} email - Email to modify.
   *
   * @return {string}
   */
  modifyEmailField: (email) => {
    if (!email) { return email; }

    // Remove <, >, [, ], " characters.
    email = email.toString().replace(/["]?[<]?[>]?[[]?[\]]?/g, "");

    const modifiedEmail = email.substr(0, email.lastIndexOf(" "));
    return (modifiedEmail.length < 1 ? email : modifiedEmail);
  },

  /**
   * Parse the string containing email, to replace angle brackets
   * with square ones. Email in between angle brackets sometimes
   * makes the application consider them as HTML tags.
   *
   * @param {string} email - Email to parse.
   *
   * @return {string} - Parsed string.
   */
  parseEmailField: (email) =>
    email.replace(/[<]/g, "[").replace(/[>]/g, "]") || email,

  /**
   * Email address in Gmail is comprised, generally, of a
   * name and email in the format 'name <email>' but can be
   * without name too. Fetch the name, if present.
   *
   * @param {string} email - String to parse.
   *
   * @returns {string} - Parsed string.
   */
  getName: (email) =>
    email.replace(/([[]|[<])(.*@.*)([\]]|[>])/g, "").trim(),

  /**
   * Parse the email part from a string.
   *
   * @param {string} email - String to parse.
   *
   * @returns {string} - Email part or return argument string back.
   */
  getEmailPart: (email) => {
    const match = email
      .toString()
      .match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);

    return (match ? match[0] : email);
  },

  /**
   * Format the email address to make it workable with the
   * Gmail API.
   *
   * @param {string} email - Email to format.
   *
   * @returns {string} - Modified email.
   */
  formatEmailForSending: (email) =>
    email.replace(/[[]/g, "<").replace(/[\]]/g, ">"),

  /**
   * Return a better representation of the date string.
   * If the date string is today's date, show only the time
   * (e.g., 14:12, 9:10, etc.).
   * If the date string has year matching current year, then
   * show the date and month only (e.g., 25 Aug, 5 Nov, etc.).
   * For all other cases, show the date, month and year
   * (e.g., 26 Nov 2018, 13 Mar 2019).
   *
   * @param {string} dateStr - Date string to modify.
   * @param {boolean} full - Show date and time both.
   *
   * @return {string} - Modified date and/or time.
   */
  modifyDateField (dateStr, full) {
    let messageDate;
    const date = new Date(dateStr) || new Date();

    if (full) {
      let temp = date.toUTCString().split(" ");
      messageDate = `${temp[1]} ${temp[2]} ${temp[3]} `;
      temp = date.toTimeString().split(":");
      messageDate += `${temp[0]}:${temp[1]}`
    } else {
      // If the date matches todays date, show the hours and minutes.
      if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
        const temp = date.toTimeString().split(":");
        messageDate = `${temp[0]}:${temp[1]}`;

      // If the date belongs to the current year, show only date and month.
      } else if (date.getUTCFullYear() === new Date().getUTCFullYear()) {
        messageDate = `${date.getDate()} ${Utility.MonthNames[date.getMonth()].substring(0, 3)}`;

      // For other dates, show date, month and year.
      } else {
        messageDate = `${date.getDate()} ${Utility.MonthNames[date.getMonth()].substring(0, 3)} ${date.getFullYear()}`;
      }
    }

    return messageDate;
  }
};

export default Utility;
