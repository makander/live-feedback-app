import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import withAuth from "../hocs/withAuth";
import {
  toggleLiveSession,
  setSessionAverage
} from "../actions/room";

// Components
import LiveSession from "../components/LiveSession";
import ProgressBar from "../components/ProgressBar";

class NewSession extends Component {
  constructor(props) {
    super(props);
    this.io = require("socket.io-client");
    this.socket = this.io(`${process.env.REACT_APP_SOCKET_CONNECTION}`);
    this.state = {
      sessionLive: false
    }
  }




  render() {
    const {
      session_live: SessionLive,
      room_name,
      handleClickNewSession,
      handleInputChange,
      userId,
      roomAverageValue
    } = this.props;

    console.log(this.props.session_live);

    return (
      <div className="d-flex justify-content-center pt-2">
        <div
          className="border border-info px-5 pt-5"
          style={{ marginBottom: "8rem" }}
        >
          <div className="container p-2 justify-content-center ">
            <ProgressBar />
            <p>{room_name}</p>
            <div className="d-flex justify-content-center p-4">
              {!this.props.session_live ? (
                <form
                  className="form-inline"
                  onSubmit={e => handleClickNewSession(e, userId)}
                >
                  <div className="form-group">
                    <input
                      className="form-control form-control"
                      type="text"
                      placeholder="Please enter session name"
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="submit"
                      className="btn btn-outline-primary btn mx-2"
                    >
                      New Session
                    </button>
                  </div>
                </form>
              ) : null}
              {this.props.session_live ? (
                <LiveSession
                  roomId={`${userId}-${room_name}`}
                  room_name={room_name}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setSessionAverage: roomAverageValue =>
    setSessionAverage(dispatch, roomAverageValue),
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
    socket.on("sessionCreationCheck", (success) => {
      if(success){
        toggleLiveSession(dispatch, room_name);
      } else {
        console.log("failed")
      } 
    });


    socket.on("roomAverageValue", inputRoomAverageValue => {
      console.log("socket on", inputRoomAverageValue);
      document.title = inputRoomAverageValue;
      setSessionAverage(dispatch, inputRoomAverageValue);
    });
  }
});

const mapStateToProps = state => ({
  session_live: state.room.session_live,
  room_name: state.room.room_name,
  userId: state.auth.user._id,
  roomAverageValue: state.room.session_average
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
