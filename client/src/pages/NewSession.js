import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
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

  return (
    <div className="cotainer p-2">
      <h1>Welcome to the New Session view</h1>
      <p>Session_State: {props.session_live ? "on" : "off"}</p>
      <button onClick={() =>console.log(props)}>Check State</button>
      <p>{props.room_name}</p>
      {!props.session_live ? (
        <form onSubmit={props.handleClickNewSession}>
          <input type="text" onChange={props.handleInputChange} required />
          <button type="submit">New Session</button>
        </form>
      ) : null}
      {props.session_live ? <LiveSession  room_name={props.room_name} /> : null}
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  handleClickNewSession: e => {
    e.preventDefault();
    const roomName = e.target[0].value;
    const io = require("socket.io-client");
    const socket = io(process.env.REACT_APP_SOCKET_CONNECTION);
    socket.emit("connectToNewSession", roomName, true);
    socket.on("sessionCreated", (roomParticipants) => {
      createRoom(dispatch, roomParticipants);
    });

    toggleLiveSession(dispatch, roomName);
  }
});

const mapStateToProps = state => ({
  session_live: state.room.session_live,
  room_name: state.room.room_name,
  rooms: state.room.rooms
  });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NewSession));
