import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import withAuth from "../hocs/withAuth";
import { toggleLiveSession, setSessionAverage } from "../actions/room";

// Components
import LiveSession from "../components/LiveSession";
import ProgressBar from "../components/ProgressBar";

// Average calc - client side roomarray

class NewSession extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionName: "",
      yInput: "",
      xInput: ""
    };

    this.roomArray = [];

    // this.handleClickNewSession = this.handleClickNewSession.bind(this);
  }

  componentDidMount() {
    const io = require("socket.io-client");
    const socket = io(`${process.env.REACT_APP_SOCKET_CONNECTION}`);
    socket.on("newUserJoinedRoom", newUser => {
      this.roomArray.push(newUser);
      console.log("roomarray", this.roomArray);
    });
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleClickNewSession = e => {
    e.preventDefault();
    const { userId, toggleLiveSession, setSessionAverage } = this.props;
    const { sessionName, xInput, yInput } = this.state;

    // TOKEN VERIFICATION ON BACKEND WHEN CONNECTING
    const token = localStorage.getItem("jwtToken").substring(4);
    const io = require("socket.io-client");

    const socket = io(process.env.REACT_APP_SOCKET_CONNECTION, {
      query: `auth_token=${token}`
    });

    const sessionNameNoSpaces = sessionName.replace(new RegExp(' ', 'g'), "_");

    socket.on("error", err => {
      console.log(err);
    });

    socket.emit("connectToNewSession", {
      roomId: `${userId}-${sessionNameNoSpaces}`,
      userId,
      xInput,
      yInput
    });

    socket.on("sessionCreationCheck", (success, roomData) => {
      if (success) {
        toggleLiveSession(sessionName);
        console.log("creationCheck", roomData);
      } else {
        console.log("failed");
      }
    });

    socket.on("userLeftRoom", data => {
      console.log("userLeftRoom running", this.roomArray, "data", data);
      this.roomArray = this.roomArray.filter(user => user.userId !== data);

      console.log("userLeftRoom roomArray after filter", this.roomArray);
    });

    socket.on("roomAverageValue", data => {
      const { sliderValue, userId: sliderUserId } = data;
      this.roomArray = this.roomArray.map(user => {
        if (user.userId === sliderUserId) {
          const loser = user;
          loser.value = sliderValue;
          console.log(loser);
          return loser;
        }
        return user;
      });

      const arrayToSum = [];

      this.roomArray.forEach(user => {
        arrayToSum.push(parseInt(user.value, 10));
      });
      const userCount = arrayToSum.length;
      if (arrayToSum.length) {
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;
        const valueArrayTot = arrayToSum.reduce(reducer);
        const roomAverageValue = (valueArrayTot / userCount).toFixed(1);
        arrayToSum.splice(0);

        document.title = roomAverageValue;
        setSessionAverage(roomAverageValue);
      }
    });

    socket.on("newUserJoinedRoom", newUser => {
      this.roomArray.push(newUser);
      console.log(this.roomArray);
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
                    roomName={room_name}
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
