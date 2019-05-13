/* eslint-disable camelcase */
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";
import PropTypes from "prop-types";
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
    <div className="cotainer p-2">
      <h1>Welcome to the New Session view</h1>
      <p>Session_State: {session_live ? "on" : "off"}</p>
      <button type="button" onClick={() => console.log(props)}>
        Check State
      </button>
      <p>{room_name}</p>
      {!session_live ? (
        <form onSubmit={handleClickNewSession}>
          <input type="text" onChange={handleInputChange} required />
          <button type="submit">New Session</button>
        </form>
      ) : null}
      {session_live ? <LiveSession room_name={room_name} /> : null}
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
)(withRouter(NewSession));
