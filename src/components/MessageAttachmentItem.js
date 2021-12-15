import fs from "fs";
import { remote } from "electron";
import React from "react";
import Config from "../Config";
import Utility from "../Utility";
import GmailApi from "../GmailApi";
import "../css/MessageAttachmentItem.css";

const dialog = remote.dialog;

const MessageAttachmentItem = ({ info, messageId, userInfo }) => {
  function saveAttachment (attachmentId, messageId) {
    dialog.showSaveDialog({ defaultPath: info.filename }, (filename) => {
      if (!filename) {
        console.log("No file selected.");
      } else {
        GmailApi.getAttachments(
          userInfo,
          attachmentId,
          messageId,
          (res) => {
            if (res.status) {
              /*
               * Gmail attachments come with '+' replaced
               * with '-' and '/' with '_', change them back
               * on decoding.
               */
              const parsedData = res.attachment.data
                .replace(/_/g, '/')
                .replace(/-/g, '+');

              // Convert the data from base64 to Buffer object.
              const finalData = Buffer.from(parsedData, 'base64');
              // Save the file.
              fs.writeFile(filename, finalData, (err) => {
                if (err) {
                  Config.Logger.error(err);
                } else {
                  console.log("Attachment saved successfully.");
                }
              });
            }
          }
        );
      }
    });
  }

  return (
    <div className="message-attachment-item">
      <span className="message-attachment-item-icon">
        <i className="fa fa-file"></i>
      </span>

      <span className="message-attachment-item-size">
        [{Utility.quantifyBytes(info.size)}]
      </span>

      <span className="message-attachment-item-name">
        {`${info.filename}  `}
      </span>

      <span
        className="message-attachment-item-download"
        onClick={() => saveAttachment(info.attachmentId, messageId)}
      >
        <i className="fa fa-download"></i>
      </span>
    </div>
  )
}

export default MessageAttachmentItem;
