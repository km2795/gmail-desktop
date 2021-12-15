import React from "react";
import "../css/HeaderActionButton.css";

const HeaderActionButton = ({ name, color, actionHandler }) => (
  <button
    className={`app-action-btn btn btn-${color}`}
    onClick={() => actionHandler()}>{name}
  </button>
);

export default HeaderActionButton;
