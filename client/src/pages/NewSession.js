/* eslint-disable camelcase */
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";
import PropTypes from "prop-types";
import withAuth from "../hocs/withAuth";
import { toggleLiveSession, createRoom } from "../actions/room";

// Components
import LiveSession from "../components/LiveSession";

/* ---------TODO--------- 

IMPLEMENT ROUTING ELEMENTS

--------------------------
  STORE VALUES REQUIRED
    SESSION_LIVE: false ----> Initial state needs to have this as false, trigger when pressing button
    CURRENT_ROOM: null ----> Which room is being monitored by user
    CURRENT_ROOM: null ----> Which room is being monitored by user
    CURRENT_ROOM_DATA: null ----> Input from the current room users that will be displayed and later sent to MONGODB
    AVERAGE_SCORE: null ----> The current calculated score from the users
---------------------  */

function NewSession(props) {
  const {
    session_live,
    room_name,
    handleClickNewSession,
    handleInputChange
  } = props;

  return (
    <div className="d-flex justify-content-center pt-2">
      <div
        className="border border-info px-5 pt-5"
        style={{ marginBottom: "8rem" }}
      >
        <div className="container p-2">
          <h1 className="text-center">Sessions</h1>
          <p>Session_State: {session_live ? "on" : "off"}</p>
          <button
            type="button"
            className="btn btn-primary btn"
            onClick={() => console.log(props)}
          >
            Check State
          </button>
          <p>{room_name}</p>
          <div className="d-flex justify-content-center p-4">
            {!session_live ? (
              <form className="form-inline" onSubmit={handleClickNewSession}>
                <div className="form-group">
                  <input
                    className="form-control form-control"
                    type="text"
                    placeholder="Please enter session name"
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-outline-primary btn mx-2"
                  >
                    New Session
                  </button>
                </div>
              </form>
            ) : null}
            {session_live ? <LiveSession room_name={room_name} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  handleClickNewSession: e => {
    e.preventDefault();
    const roomName = e.target[0].value;
    const socket = io(process.env.REACT_APP_SOCKET_CONNECTION);
    socket.emit("connectToNewSession", roomName, true);
    socket.on("sessionCreated", roomParticipants => {
      createRoom(dispatch, roomParticipants);
    });

    toggleLiveSession(dispatch, roomName);
  }
});

const mapStateToProps = state => ({
  session_live: state.room.session_live,
  room_name: state.room.room_name
});

NewSession.propTypes = {
  session_live: PropTypes.bool,
  room_name: PropTypes.string,
  handleClickNewSession: PropTypes.func,
  handleInputChange: PropTypes.func
};

NewSession.defaultProps = {
  session_live: false,
  room_name: "",
  handleClickNewSession: () => {
    return null;
  },
  handleInputChange: () => {
    return null;
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withAuth(NewSession)));
