import React from "react";
import { Link } from "react-router-dom";
import withAuth from "../hocs/withAuth";

function MySessions(props) {
  return (
    <div className="d-flex justify-content-center pt-2">
      <div
        className="border border-info px-5 pt-5"
        style={{ marginBottom: "8rem" }}
      >
        <div className="p-2">
          <h1 className="text-center">My sessions</h1>
          <ul className="list-unstyled py-2">
            <li>Session Name: [username.customName]</li>
            <li>Session Name: [username.customName]</li>
          </ul>
          <div className="d-flex justify-content-center pb-3">
            <Link
              to="/dashboard"
              role="button"
              className="btn btn-outline-secondary"
            >
              My Sessions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(MySessions);
