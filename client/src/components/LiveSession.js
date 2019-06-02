import React from "react";
import { connect } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import PropTypes from "prop-types";
import ProgressBar from "./ProgressBar";
import { sessionStarted, sessionStopped, cancelSession } from "../actions/room";
import StopWatch from "./StopWatch";

const io = require("socket.io-client");

const socket = io(`${process.env.REACT_APP_SOCKET_CONNECTION}`);

class LiveSession extends React.Component {
  constructor(props) {
    super(props);
    this.counter = null;
  }

  componentWillUnmount() {
    const { unmountSession } = this.props;
    unmountSession();
    this.timer(true);
  }

  timerCallback = () => {
    const timeStamp = new Date().toLocaleTimeString();
    const { roomAverageValue, roomId } = this.props;
    const roomIdNoSpaces = roomId.replace(new RegExp(" ", "g"), "_");
    socket.emit("sendToDB", {
      roomId: roomIdNoSpaces,
      roomAverageValue,
      timeStamp
    });
  };

  timer = active => {
    if (!active) {
      this.counter = setInterval(this.timerCallback, 2000);
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
      stopSession,
      cancel
    } = this.props;
    const roomIdNoSpaces = roomId.replace(new RegExp(" ", "g"), "_");

    return (
      <div className="d-flex">
        <div className="text-center">
          <h2 className="pb-4">
            Welcome to session: <br /> {roomName}
          </h2>
          <ProgressBar />
          <div className="pt-2">
            <button
              className="btn btn-outline-warning m-1"
              type="button"
              onClick={e => {
                cancel(e);
                stopSession(e);
                this.timer(true);
              }}
            >
              Cancel
            </button>
            <CopyToClipboard
              text={`${
                process.env.REACT_APP_BASE_SHARE_LINK
              }/guest/${roomIdNoSpaces}`}
            >
              <button className="btn btn-outline-info m-1" type="button">
                Copy link
              </button>
            </CopyToClipboard>
            {!sessionActive ? (
              <button
                className="btn btn-outline-success"
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
                className="btn btn-outline-danger m-1"
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
          <StopWatch timerActive={sessionActive} />
        </div>
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
  },
  unmountSession: () => {
    socket.emit("sessionStop", ownProps.roomId);
    dispatch(sessionStopped(ownProps.room_name));
  },
  cancel: e => {
    e.preventDefault();
    dispatch(cancelSession());
  }
});

LiveSession.propTypes = {
  sessionActive: PropTypes.bool,
  roomAverageValue: PropTypes.string.isRequired,
  roomId: PropTypes.string.isRequired,
  roomName: PropTypes.string.isRequired,
  startSession: PropTypes.func.isRequired,
  stopSession: PropTypes.func.isRequired,
  unmountSession: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
};

LiveSession.defaultProps = {
  sessionActive: false
};

const mapStateToProps = state => ({
  sessionActive: state.room.session_live,
  roomAverageValue: state.room.session_average
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveSession);
