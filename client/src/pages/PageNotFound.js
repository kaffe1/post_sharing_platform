import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="not-found-page">
      <h1>Page Not Found :/</h1>
      <h3>
        try this{" "}
        <Link className="text-link" to="/">
          Go Home
        </Link>
      </h3>
    </div>
  );
}

export default PageNotFound;
