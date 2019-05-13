import React from "react";
import { connect } from "react-redux";
import { lectureStarted } from "../actions/room";

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
      {props.lectureStarted ? (
        <p>Lecture Started</p>
      ) : (
        <button
          type="button"
          onClick={e => {
            props.startLecture(e);
          }}
        >
          Start Lecture
        </button>
      )}
      <button type="button">Cancel Lecture</button>
    </div>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  startLecture: e => {
    e.preventDefault();
    const io = require("socket.io-client");
    const socket = io(`http://localhost:5000/`);
    socket.emit("startLecture");
    lectureStarted(dispatch, ownProps.room_name);
  }
});

const mapStateToProps = state => ({
  lectureStarted: state.room.lectureStarted
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveSession);
