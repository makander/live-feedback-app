import React from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import { sessionStarted, sessionStopped } from "../actions/room";

const io = require("socket.io-client");

const socket = io(`${process.env.REACT_APP_SOCKET_CONNECTION}`);

class LiveSession extends React.Component {
  constructor(props) {
    super(props);
    this.counter = null;
  }

  timerCallback = () => {
    const timeStamp = new Date().toLocaleTimeString();
    const { roomAverageValue, roomId } = this.props;
    const roomIdNoSpaces = roomId.replace(new RegExp(' ', 'g'), "_");
    console.log(roomIdNoSpaces);
    socket.emit("sendToDB", {
      roomId: roomIdNoSpaces,
      roomAverageValue,
      timeStamp
    });
  };

  timer = active => {
    if (!active) {
      this.counter = setInterval(this.timerCallback, 10000);
      return;
    }
    clearInterval(this.counter);
  };

  render() {
    const {
      roomName,
      roomId,
      roomAverageValue,
      sessionActive,
      startSession,
      stopSession
    } = this.props;
    const roomIdNoSpaces = roomId.replace(new RegExp(' ', 'g'), "_");
  
    return (
      <div className="text-center p-5">
        <h2>Session Active in Room {roomName}</h2>
        <p>Room ID: {roomIdNoSpaces}</p>
        <div className="container bg-success">
        <a
          className="text-light"
          rel="noopener noreferrer"
          href={`${process.env.REACT_APP_BASE_SHARE_LINK}/guest/${roomIdNoSpaces}`}
          target="_blank"
        >{`${process.env.REACT_APP_BASE_SHARE_LINK}/guest/${roomIdNoSpaces}`}</a>
        </div>
        {sessionActive ? <p>Session Active</p> : <p>Session Inactive</p>}
        {!sessionActive ? (
          <button
            className="btn btn-outline-success m-2"
            type="button"
            onClick={e => {
              startSession(e);
              this.timer(sessionActive, roomAverageValue, roomId);
            }}
          >
            Start Session
          </button>
        ) : (
          <button
            className="btn btn-outline-danger"
            type="button"
            onClick={e => {
              stopSession(e);
              this.timer(sessionActive);
            }}
          >
            Stop Session
          </button>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  startSession: e => {
    e.preventDefault();
    socket.emit("sessionStart", ownProps.roomId);
    dispatch(sessionStarted(ownProps.roomName));
  },
  stopSession: e => {
    e.preventDefault();
    socket.emit("sessionStop", ownProps.roomId);
    dispatch(sessionStopped(ownProps.roomName));
  }
});

LiveSession.propTypes = {
  sessionActive: PropTypes.bool,
  roomAverageValue: PropTypes.string.isRequired,
  roomId: PropTypes.string.isRequired,
  roomName: PropTypes.string.isRequired,
  startSession: PropTypes.func.isRequired,
  stopSession: PropTypes.func.isRequired
};

LiveSession.defaultProps = {
  sessionActive: false
};

const mapStateToProps = state => ({
  sessionActive: state.room.session_active,
  roomAverageValue: state.room.session_average
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveSession);
