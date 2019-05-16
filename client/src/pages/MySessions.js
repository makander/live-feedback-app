import React from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import withAuth from "../hocs/withAuth";

function MySessions(props) {
  const { session_data } = props;
  return (
    <div>
      {console.log(session_data)}
      <h2>List of Previous Sessions</h2>
      <ul>
        {session_data.session_data.map(data => {
          return <li>{data.id}</li>;
        })}
        <p>hej</p>
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

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({
  session_data: state.auth.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withAuth(MySessions)));
