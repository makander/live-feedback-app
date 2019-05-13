import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { toggleLiveSession, createRoom } from "../actions/room";

// Components
import LiveSession from "../components/LiveSession";

function NewSession(props) {
  return (
    <div className="justify-content-center pt-2">
      <div
        className="border border-info p-5 mx-2"
        style={{ marginBottom: 8 + "rem" }}
      >
        <h1>Welcome to the New Session view</h1>
        <p>Session_State: {props.session_live ? "on" : "off"}</p>
        <button onClick={() => console.log(props)}>Check State</button>
        <p>{props.room_name}</p>
        {!props.session_live ? (
          <form onSubmit={e => props.handleClickNewSession(e, props.userId)}>
            <input type="text" onChange={props.handleInputChange} required />
            <button type="submit">New Session</button>
          </form>
        ) : null}
        {props.session_live ? (
          <LiveSession
            roomId={`${props.userId}-${props.room_name}`}
            room_name={props.room_name}
          />
        ) : null}
      </div>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  handleClickNewSession: (e, userId) => {
    e.preventDefault();
    const room_name = e.target[0].value;
    const roomId = `${userId}-${room_name}`;
    const io = require("socket.io-client");
    const socket = io(`http://192.168.99.100:5000/`);
    socket.emit("connectToNewSession", roomId, true);
    socket.on("newSessionCreated", roomParticipants => {
      createRoom(dispatch, roomParticipants);
    });
    toggleLiveSession(dispatch, room_name);
  }
});

const mapStateToProps = state => ({
  session_live: state.room.session_live,
  room_name: state.room.room_name,
  rooms: state.room.rooms,
  userId: state.auth.user._id
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NewSession));
