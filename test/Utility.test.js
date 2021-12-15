"use strict";

import Utility from "../src/Utility";

test("check subsequence", () => {
  expect(Utility.subsequence("Hello world", "eowo")).toBe(true);
  expect(Utility.subsequence("alkdsjasd.a.sda,.a/d,fasd.,.<></.,293874^*&^*$", "fa<>")).toBe(true);
});

test("remove duplicates from list", () => {
  expect(Utility.removeDuplicates([1, 2, 1, 4, 5, 6, 4]).length).toBe(5);
  expect(Utility.removeDuplicates([1, 1, 1, 1]).length).toBe(1);
});

test("get unique elements from two lists", () => {
  expect(Utility.disjunct([1, 2, 3, 4, 5], [1, 2, 3]).length).toBe(2);
  expect(Utility.disjunct([1, 1], [1]).length).toBe(0);
  expect(Utility.disjunct(["a", "b", "c"], ["d", "e", "f"]).length).toBe(6);
});

test("get unique elements from a list", () => {
  expect(Utility.getUnique([1, 2, 3, 4], [4, 5]).length).toBe(3);
  expect(Utility.getUnique([1, 5], [1])[0]).toBe(5);
});

test("search in list", () => {
  let list = [
    {"name": "ABC", "value": 18498, "email": "abc.cde@gmail.com"},
    {"name": "49.sdl", "value": 12918, "email": "49.sdl@gmail.com"},
    {"name": "Green Stone", "value": 1945588, "email": "49.sdl@gmail.com"},
    {"name": "Red98 90", "value": 90, "email": "49.sdl@gmail.com"},
    {"name": "Shallow Waters", "value": 9300283, "email": "49.sdl@gmail.com"},
  ];
  
  expect(Utility.search(list, 8, "value").length).toBe(4);
  expect(JSON.stringify(Utility.search(list, 90, "value"))).toBe(JSON.stringify([list[3], list[4]]));
});

test("check if the element is in list", () => {
  expect(Utility.isInList([1, 2, 3, 4], 4, true)).toBeTruthy();
  expect(Utility.isInList(["Hello", "world", "no"], "wORLD", false, true)).toBeFalsy();
  expect(Utility.isInList(["Hello", "world", "no"], "wORLD", false, false)).toBeTruthy();
});

test("get file size unit (kb, mb, ...) appended shorter numeral string", () => {
  expect(Utility.quantifyBytes(28398234)).toBe("28.398234 MB");
  expect(Utility.quantifyBytes(1384298498234)).toBe("1.384298498234 TB");
  expect(Utility.quantifyBytes(1323)).toBe("1.323 KB");
  expect(Utility.quantifyBytes(983)).toBe("983 B");
});

test("get the name part (prefixed) from the email", () => {
  expect(Utility.modifyEmailField("Atlas 390 [atlas.390@gmail.com]")).toBe("Atlas 390");
  expect(Utility.modifyEmailField("denim <denim@gmail.com>")).toBe("denim");
  expect(Utility.modifyEmailField("<abc@gmail.com>")).toBe("abc@gmail.com");
});

test("parse the email string", () => {
  expect(Utility.parseEmailField("<atlas.390@gmail.com>")).toBe("[atlas.390@gmail.com]");
  expect(Utility.parseEmailField("denim <denim@gmail.com>")).toBe("denim [denim@gmail.com]");
});

test("get email from the string", () => {
  expect(Utility.getEmailPart("Atlas 390 [atlas.390@gmail.com]")).toBe("atlas.390@gmail.com");
  expect(Utility.getEmailPart("sam98.al <sam98.al@gmail.com>")).toBe("sam98.al@gmail.com");
});

test("modify date", () => {
  let currentYear = new Date().getFullYear();
  expect(Utility.modifyDateField(`09/13/${currentYear}`)).toBe("13 Sep");
  expect(Utility.modifyDateField(`19 September ${currentYear} 23:34`)).toBe("19 Sep");
  expect(Utility.modifyDateField(`${new Date().toDateString()} 12:35`)).toBe("12:35");
});
