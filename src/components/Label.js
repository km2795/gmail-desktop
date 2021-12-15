import React from "react";
import "../css/Label.css";

const Label = ({ color, label, userLabel }) => (
  <span className={`
    badge badge-${color}
    message-label-badge
    ${userLabel ? "user-label" : ""}`
  }>
    {label.replace("CATEGORY_", "")}
  </span>
);

export default Label;
