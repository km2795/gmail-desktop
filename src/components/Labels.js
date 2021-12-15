import React from "react";
import Label from "./Label";
import "../css/Labels.css";

const Labels = ({ threadLabels, LABEL_COLORS, LABELS }) => (
  <p className="message-labels">{
    threadLabels.map((label, i) => (
      (label !== "UNREAD")
        ? (<Label key={i++}
          color={
            LABEL_COLORS[label.toLowerCase()]
              ? LABEL_COLORS[label.toLowerCase()]
              : "white"
          }
          label={LABELS.get(label).name}
          userLabel={LABELS.get(label).type === "user"}
        />)
        : null
    ))
  }</p>
);

export default Labels;
