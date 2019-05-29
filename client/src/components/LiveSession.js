import React from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import { sessionStarted, sessionStopped } from "../actions/room";


const io = require("socket.io-client");

const socket = io(`${process.env.REACT_APP_SOCKET_CONNECTION}`);
let counter = null;

const timer = (active, user_id, roomId) => {
  if (!active) {
    counter = setInterval(
      () =>
        socket.emit("sendToDB", {
          roomId,
          user_id
        }),
      10000
    );
    return;
  }
  clearInterval(counter);
};

// This component should handle all of the rendering of real time lecture feedback
// Note-

function LiveSession(props) {
  const {room_name, roomId, user_id, session_active, startSession} = props;
  const roomIdNoSpaces = roomId.replace(' ', '_');
  return (
    <div className="text-center p-5">
      <h2>Session Active in Room {room_name}</h2>
      <p>Room ID: {roomIdNoSpaces}</p>
      <div className="container bg-success">
        
        <a className="text-light"
          rel="noopener noreferrer"
          
          href={encodeURI(`${process.env.REACT_APP_BASE_SHARE_LINK}/guest/${
            roomIdNoSpaces
          }`)}
          target="_blank"
        >{`${process.env.REACT_APP_BASE_SHARE_LINK}/guest/${roomIdNoSpaces}`}</a>
      
      </div>
      {session_active ? <p>Session Active</p> : <p>Session Inactive</p>}
      {!session_active ? (
        <button
          className="btn btn-outline-success m-2"
          type="button"
          onClick={e => {
            startSession(e);
            timer(session_active, user_id, roomId);
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
            timer(props.session_active);
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
    socket.emit("sessionStart", ownProps.roomId);
    dispatch(sessionStarted(ownProps.room_name));
  },
  stopSession: e => {
    e.preventDefault();
    socket.emit("sessionStop", ownProps.roomId);
    dispatch(sessionStopped(ownProps.room_name));
  }
});

LiveSession.propTypes = {
  session_active: PropTypes.bool,
  user_id: PropTypes.string.isRequired,
};

LiveSession.defaultProps = {
  session_active: false,

};

const mapStateToProps = state => ({
  session_active: state.room.session_active,
  user_id: state.auth.user.sub,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveSession);
