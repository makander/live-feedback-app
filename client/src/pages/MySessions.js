import React from "react";
import { Link } from "react-router-dom";

export default function MySessions(props) {
  return (
    <div>
      <h2>List of Previous Sessions</h2>
      <ul>
        <li>Session Name: [username.customName]</li>
        <li>Session Name: [username.customName]</li>
      </ul>
      <button type="button">
        <Link
          to="/dashboard"
          style={{
            width: "140px",
            borderRadius: "3px",
            letterSpacing: "1.5px",
            textDecoration: "none"
          }}
        >
          Back
        </Link>
      </button>
    </div>
  );
}
