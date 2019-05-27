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
  console.log(props);
  const { session_data } = props;
  return (
    <div className="d-flex justify-content-center pt-2">
      <div
        className="border border-info px-5 pt-5"
        style={{ marginBottom: "8rem" }}
      >
        <div className="p-2">
          <h1 className="text-center">My sessions</h1>
          {session_data.session_data.length ? (
            <ul className="list-unstyled py-2">
              {session_data.session_data.map(data => {
                return (
                  <div>
                    <Link
                      to={`/my-sessions/${data.id}`}
                      role="button"
                      className="btn btn-outline-primary btn"
                    >
                      {data.id}
                    </Link>
                  </div>
                );
              })}
            </ul>
          ) : (
            <p>You have no saved sessions</p>
          )}
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

const mapDispatchToProps = dispatch => ({
  sessionDetails: () => {
    dispatch(sessionDetails());
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
