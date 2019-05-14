import React from "react";
import { connect } from "react-redux";
import { sessionStarted, sessionStopped } from "../actions/room";

// This component should handle all of the rendering of real time lecture feedback
// Note-
function LiveSession(props) {
  return (
    <div>
      <h2>Session Active in Room {props.room_name}</h2>
      <p>Room ID: {props.roomId}</p>
      <p>
        Room Link:
        <a
          rel="noopener noreferrer"
          href={`http://localhost:3000/guest/${props.roomId}`}
          target="_blank"
        >{`http://localhost:3000/guest/${props.roomId}`}</a>
      </p>
      <p>Average Score: 5</p>
      <p>Timer: 00:00</p>
      {props.session_active ? (<p>Session Active</p>) : (<p>Session Inactive</p>)}
      {!props.session_active ? (
        <button
          type="button"
          onClick={e => {
            props.startSession(e);
          }}
        >
          Start Session
        </button>
      ) : (
        <button
          type="button"
          onClick={e => {
            props.stopSession(e);
          }}
        >
          Stop Session
        </button>
      )}
    </div>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  startSession: e => {
    e.preventDefault();
    const io = require("socket.io-client");
    const socket = io(`http://localhost:5000/`);
    socket.emit("sessionStart", ownProps.roomId);
    sessionStarted(dispatch, ownProps.room_name);
  },
  stopSession: e => {
    e.preventDefault();
    const io = require("socket.io-client");
    const socket = io(`http://localhost:5000/`);
    socket.emit("sessionStop", ownProps.roomId);
    sessionStopped(dispatch, ownProps.room_name);
  }
});

const mapStateToProps = state => ({
  session_active: state.room.session_active
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveSession);
