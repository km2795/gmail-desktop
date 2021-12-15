import React from "react";
import "../css/ActionButtons.css";

const ActionButtons = ({ refreshUserStore, syncApp }) => (
  <div className="action-buttons-cont">
    <div
      className="btn btn-indigo action-button"
      onClick={() => refreshUserStore()}
    >Refresh</div>
    <div className="btn btn-unique action-button"
      onClick={() => syncApp()}
    >Sync</div>
  </div>
);

export default ActionButtons;
