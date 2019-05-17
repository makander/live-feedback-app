import React from "react";
import { connect } from "react-redux";
import { sessionStarted, sessionStopped } from "../actions/room";

// This component should handle all of the rendering of real time lecture feedback
// Note-
function LiveSession(props) {
  return (
    <div className="text-center p-5">
      <h2>Session Active in Room {props.room_name}</h2>
      <p>Room ID: {props.roomId}</p>
      <p>
        Room Link:
        <a
          rel="noopener noreferrer"
          href={`${process.env.REACT_APP_BASE_SHARE_LINK}/guest/${
            props.roomId
          }`}
          target="_blank"
        >{`${process.env.REACT_APP_BASE_SHARE_LINK}/guest/${props.roomId}`}</a>
      </p>
      <p>Average Score: 5</p>
      <p>Timer: 00:00</p>
      {props.session_active ? <p>Session Active</p> : <p>Session Inactive</p>}
      {!props.session_active ? (
        <button
          className="btn btn-outline-success m-2"
          type="button"
          onClick={e => {
            props.startSession(e);
          }}
        >
          Start Session
        </button>
      ) : (
        <button
          className="btn btn-outline-danger"
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
    const socket = io(`${process.env.REACT_APP_SOCKET_CONNECTION}`);
    socket.emit("sessionStart", ownProps.roomId);
    sessionStarted(dispatch, ownProps.room_name);
  },
  stopSession: e => {
    e.preventDefault();
    const io = require("socket.io-client");
    const socket = io(`${process.env.REACT_APP_SOCKET_CONNECTION}`);
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
