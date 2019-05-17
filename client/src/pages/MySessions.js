import React from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import {
  sessionStarted,
  sessionStopped,
  sessionDetails
} from "../actions/room";
import withAuth from "../hocs/withAuth";

function MySessions(props) {
  const { session_data } = props;
  return (
    <div>
      {console.log(session_data)}
      <h2>List of Previous Sessions</h2>
      {session_data.session_data.length ? (
        <ul>
          {session_data.session_data.map(data => {
            return (
              <li key={data.id} onClick={props.sessionDetails}>
                {data.id}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>You have no saved sessions</p>
      )}
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

const mapDispatchToProps = dispatch => ({
  sessionDetails: () => {
    sessionDetails(dispatch);
  }
});

const mapStateToProps = state => ({
  session_data: state.auth.user,
  session_details: state.room.session_details
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withAuth(MySessions)));
