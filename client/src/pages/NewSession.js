import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import withAuth from "../hocs/withAuth";
import { toggleLiveSession, setSessionAverage } from "../actions/room";

// Components
import LiveSession from "../components/LiveSession";
import ProgressBar from "../components/ProgressBar";

class NewSession extends Component {
  constructor(props) {
    super(props);
    this.io = require("socket.io-client");
    this.socket = this.io(`${process.env.REACT_APP_SOCKET_CONNECTION}`);

    this.state = {
      sessionName: "",
      yInput: "",
      xInput: ""
    };

    // this.handleClickNewSession = this.handleClickNewSession.bind(this);
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleClickNewSession = e => {
    e.preventDefault();
    /* const room_name = e.target[0].value;
      const roomId = `${userId}-${room_name}`;
      // TOKEN VERIFICATION ON BACKEND WHEN CONNECTING
      const token = localStorage.getItem("jwtToken").substring(4);
      const io = require("socket.io-client");
      const socket = io.connect(process.env.REACT_APP_SOCKET_CONNECTION, {
        query: `auth_token=${token}`,
        transports: ["websocket"]
      });
      socket.on("error", err => {
        console.log(err);
      });
      socket.emit("connectToNewSession", { roomId, bajs: "bajs" });
      socket.on("sessionCreationCheck", success => {
        if (success) {
          console.log(room_name);
          toggleLiveSession(, room_name);
        } else {
          console.log("failed");
        }
      // }); */
    // const room_name = e.target[0].value;
    //  const roomId = e.target[0].value;
    // const user = `${userId}`;
    const { userId, toggleLiveSession, setSessionAverage } = this.props;
    const { sessionName, xInput, yInput } = this.state;

    // TOKEN VERIFICATION ON BACKEND WHEN CONNECTING
    const token = localStorage.getItem("jwtToken").substring(4);
    const io = require("socket.io-client");

    const socket = io(process.env.REACT_APP_SOCKET_CONNECTION, {
      query: `auth_token=${token}`
    });

    socket.on("error", err => {
      console.log(err);
    });

    socket.emit("connectToNewSession", {
      roomId: `${userId}-${sessionName}`,
      userId,
      xInput,
      yInput
    });

    socket.on("sessionCreationCheck", success => {
      if (success) {
        toggleLiveSession(sessionName);
      } else {
        console.log("failed");
      }
    });

    socket.on("roomAverageValue", inputRoomAverageValue => {
      document.title = inputRoomAverageValue;
      setSessionAverage(inputRoomAverageValue);
    });
  };

  render() {
    const {
      session_live: SessionLive,
      room_name,
      handleInputChange,
      userId,
      roomAverageValue
    } = this.props;

    const { sessionName, xInput, yInput } = this.state;

    return (
      <div className="d-flex justify-content-center pt-2">
        <div
          className="border border-info px-5 pt-5"
          style={{ marginBottom: "8rem" }}
        >
          <div className="container p-2 justify-content-center ">
            <div className="d-flex justify-content-center p-4">
              {!this.props.session_live ? (
                <div>
                  <h3 className="mx-auto">Create New Session</h3>
                  <form
                    className="form-inline"
                    onSubmit={e => this.handleClickNewSession(e)}
                  >
                    <div className="form-group">
                      <input
                        className="form-control form-control"
                        type="text"
                        name="sessionName"
                        placeholder="Enter session name"
                        onChange={this.handleInputChange}
                        value={sessionName}
                        required
                      />
                      <input
                        className="form-control form-control"
                        type="text"
                        name="xInput"
                        placeholder="xInput"
                        onChange={this.handleInputChange}
                        value={xInput}
                        required
                      />
                      <input
                        className="form-control form-control"
                        type="text"
                        name="yInput"
                        placeholder="yInput"
                        onChange={this.handleInputChange}
                        value={yInput}
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
                </div>
              ) : (
                <div>
                  <ProgressBar />
                  <LiveSession
                    roomId={`${userId}-${room_name}`}
                    room_name={room_name}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setSessionAverage: roomAverageValue =>
    dispatch(setSessionAverage(roomAverageValue)),
  toggleLiveSession: sessionName => dispatch(toggleLiveSession(sessionName))
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
  userId: PropTypes.string
};

NewSession.defaultProps = {
  userId: null,
  session_live: false,
  room_name: ""
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withAuth(NewSession)));
