/* eslint-disable no-undef */
"use strict";

import List from "../src/List";

test("Initialize list from an object with 2 entries", () => {
  const testData = {
    "CATEGORY_PERSONAL": {
      "id": "CATEGORY_PERSONAL",
      "name": "CATEGORY_PERSONAL",
      "type": "system"
    },
    "CATEGORY_SOCIAL": {
      "id": "CATEGORY_SOCIAL",
      "name": "CATEGORY_SOCIAL",
      "type": "system"
    }
  };

  const list = new List(testData);

  expect(list.size()).toBe(2);
  expect(list.get(`CATEGORY_SOCIAL`).type).toBe(`system`);
});

test("Initialize list from an object with no entries", () => {
  const testData = {};
  const list = new List(testData);

  expect(list.size()).toBe(0);
  expect(list.getValues().length).toBe(0);
});
