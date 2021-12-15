import React from "react";
import renderer from "react-test-renderer";
import Config from "../src/Config";
import List from "../src/List";
import Labels from "../src/components/Labels";

const TEST_LABELS = new List({
  "CATEGORY_PERSONAL": {
    "id": "CATEGORY_PERSONAL",
    "name": "CATEGORY_PERSONAL",
    "type": "system"
  },
  "CATEGORY_SOCIAL": {
    "id": "CATEGORY_SOCIAL",
    "name": "CATEGORY_SOCIAL",
    "type": "system"
  },
  "Label_1": {
    "id": "Label_1",
    "name": "[Imap]/Trash",
    "type": "user"
  },
  "CATEGORY_FORUMS": {
    "id": "CATEGORY_FORUMS",
    "name": "CATEGORY_FORUMS",
    "type": "system"
  },
  "IMPORTANT": {
    "id": "IMPORTANT",
    "name": "IMPORTANT",
    "messageListVisibility": "hide",
    "labelListVisibility": "labelShow",
    "type": "system"
  },
  "CATEGORY_UPDATES": {
    "id": "CATEGORY_UPDATES",
    "name": "CATEGORY_UPDATES",
    "type": "system"
  },
  "CHAT": {
    "id": "CHAT",
    "name": "CHAT",
    "messageListVisibility": "hide",
    "labelListVisibility": "labelHide",
    "type": "system"
  },
  "SENT": {
    "id": "SENT",
    "name": "SENT",
    "messageListVisibility": "hide",
    "labelListVisibility": "labelShow",
    "type": "system"
  },
  "INBOX": {
    "id": "INBOX",
    "name": "INBOX",
    "messageListVisibility": "hide",
    "labelListVisibility": "labelShow",
    "type": "system"
  },
  "TRASH": {
    "id": "TRASH",
    "name": "TRASH",
    "messageListVisibility": "hide",
    "labelListVisibility": "labelHide",
    "type": "system"
  },
  "CATEGORY_PROMOTIONS": {
    "id": "CATEGORY_PROMOTIONS",
    "name": "CATEGORY_PROMOTIONS",
    "type": "system"
  },
  "DRAFT": {
    "id": "DRAFT",
    "name": "DRAFT",
    "messageListVisibility": "hide",
    "labelListVisibility": "labelShow",
    "type": "system"
  },
  "SPAM": {
    "id": "SPAM",
    "name": "SPAM",
    "messageListVisibility": "hide",
    "labelListVisibility": "labelHide",
    "type": "system"
  },
  "STARRED": {
    "id": "STARRED",
    "name": "STARRED",
    "messageListVisibility": "hide",
    "labelListVisibility": "labelShow",
    "type": "system"
  },
  "UNREAD": {
    "id": "UNREAD",
    "name": "UNREAD",
    "type": "system"
  },
  "Label_2222222222222222222": {
    "id": "Label_2222222222222222222",
    "name": "Archive_Payments",
    "type": "user"
  }
});

test("Should render labels of a thread", () => {
  const tree = renderer
    .create(<Labels 
      threadLabels={["CATEGORY_UPDATES", "INBOX", "CHAT", "Label_2222222222222222222"]}
      LABEL_COLORS={Config.LABEL_COLORS}
      LABELS={TEST_LABELS} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
