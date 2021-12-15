import React from "react";
import "../css/LoadMoreButton.css";

const LoadMoreButton = ({ show, loadMore }) => (
  show
    ? (<div className="load-more-btn">
      <button className="btn" onClick={() => loadMore()}>
          Load More
      </button>
    </div>)
    : null
);

export default LoadMoreButton;
