import React from "react";
import "../css/Spinner.css";

function Spinner ({ show, message }) {
  return (
    show
      ? (<div id="spinner-cont">
        <span className="spinner"></span>
        <span id="spinner-message">{message}</span>
      </div>)
      : null
  );
}

export default Spinner;
