import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";
import PropTypes from "prop-types";
import withAuth from "../hocs/withAuth";
import { toggleLiveSession, createRoom } from "../actions/room";

// Components
import LiveSession from "../components/LiveSession";

function NewSession(props) {
  const {
    session_live,
    room_name,
    handleClickNewSession,
    handleInputChange,
    userId
  } = props;

  return (
    <div className="justify-content-center pt-2">
      <div
        className="border border-info p-5 mx-2"
        style={{ marginBottom: 8 + "rem" }}
      >
        <h1>Welcome to the New Session view</h1>
        <p>Session_State: {session_live ? "on" : "off"}</p>
        <button type="button" onClick={() => console.log(props)}>
          Check State
        </button>
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

const mapDispatchToProps = dispatch => ({
  handleClickNewSession: (e, userId) => {
    e.preventDefault();
    const room_name = e.target[0].value;
    const roomId = `${userId}-${room_name}`;
    // TOKEN VERIFICATION ON BACKEND WHEN CONNECTING
    const token = localStorage.getItem("jwtToken");
    const socket = io(process.env.REACT_APP_SOCKET_CONNECTION, {query: `auth_token=${token}`});
    socket.on("error", function(err) {
      console.log(err);
    })
    socket.emit("connectToNewSession", roomId);
    socket.on("sessionCreated", roomParticipants => {
      createRoom(dispatch, roomParticipants);
    });

    toggleLiveSession(dispatch, room_name);
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
)(withRouter(withAuth(NewSession)));
