import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import withAuth from "../hocs/withAuth";
import { toggleLiveSession, createRoom } from "../actions/room";

// Components
import LiveSession from "../components/LiveSession";

class NewSession extends Component {
  constructor(props) {
    super(props);
    this.io = require("socket.io-client");
    this.socket = this.io(`${process.env.REACT_APP_SOCKET_CONNECTION}`);
  }

  handleAverage = () => {
    console.log("handle aaverage");
    this.socket.on("roomAverageValue", roomAverageValue => {
      console.log("socket on", roomAverageValue);
      document.title = roomAverageValue;
    });
  };

  render() {
    const {
      session_live,
      room_name,
      handleClickNewSession,
      handleInputChange,
      userId
    } = this.props;
    return (
      <div className="justify-content-center pt-2">
        <div
          className="border border-info p-5 mx-2"
          style={{ marginBottom: "8rem" }}
        >
          <button type="button" onClick={this.handleAverage} />
          <h1>Welcome to the New Session view</h1>
          <p>Session_State: {session_live ? "on" : "off"}</p>
          <p>{room_name}</p>
          {!session_live ? (
            <form onSubmit={e => handleClickNewSession(e, userId)}>
              <input type="text" onChange={handleInputChange} required />
              <button type="submit">New Session</button>
            </form>
          ) : null}
          {session_live ? (
            <LiveSession
              roomId={`${userId}-${room_name}`}
              room_name={room_name}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  handleClickNewSession: (e, userId) => {
    e.preventDefault();
    const room_name = e.target[0].value;
    const roomId = `${userId}-${room_name}`;
    // TOKEN VERIFICATION ON BACKEND WHEN CONNECTING
    const token = localStorage.getItem("jwtToken").substring(4);
    const io = require("socket.io-client");
    const socket = io(process.env.REACT_APP_SOCKET_CONNECTION, {
      query: `auth_token=${token}`
    });
    socket.on("error", err => {
      console.log(err);
    });
    socket.emit("connectToNewSession", roomId);
    socket.on("sessionCreated", roomParticipants => {
      createRoom(dispatch, roomParticipants);
    });

    toggleLiveSession(dispatch, room_name);
    console.log("handle aaverage");
    socket.on("roomAverageValue", roomAverageValue => {
      console.log("socket on", roomAverageValue);
      document.title = roomAverageValue;
    });
  }
});

const mapStateToProps = state => ({
  session_live: state.room.session_live,
  room_name: state.room.room_name,
  userId: state.auth.user._id
});

NewSession.propTypes = {
  session_live: PropTypes.bool,
  room_name: PropTypes.string,
  handleClickNewSession: PropTypes.func,
  handleInputChange: PropTypes.func,
  userId: PropTypes.string
};

NewSession.defaultProps = {
  userId: null,
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
