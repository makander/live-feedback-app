import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import io from "socket.io-client";
import withAuth from "../hocs/withAuth";
import {
  roomCreated,
  setSessionAverage,
  handleVotingInput,
  setVotingInput
} from "../actions/room";
import { GET_ERRORS, CLEAR_ERRORS } from "../actions/types";
// Components
import LiveSession from "../components/LiveSession";
import VotingChart from "../components/VotingChart";
import Voting from "../components/RoomTypes/Voting";
import BreakTime from "../components/RoomTypes/Break";

// Average calc - client side roomarray

class NewSession extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionName: "",
      yInput: "",
      xInput: "",
      voting: false,
      labels: false,
      breakTime: false
    };

    this.roomArray = [];

    // this.handleClickNewSession = this.handleClickNewSession.bind(this);
  }

  componentDidMount() {
    const socket = io(`${process.env.REACT_APP_SOCKET_CONNECTION}`);
    socket.on("newUserJoinedRoom", newUser => {
      this.roomArray.push(newUser);
    });
  }

  voting = () => {
    this.setState(prevState => ({
      voting: !prevState.voting
    }));
  };

  breakTime = () => {
    this.setState(prevState => ({
      breakTime: !prevState.breakTime
    }));
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleClickNewSession = e => {
    e.preventDefault();
    const {
      userId,
      createRoom,
      sessionAverageSetter,
      getErrors,
      clearErrors,
      votingInput,
      setVotingInputDispatch
    } = this.props;
    const { sessionName, xInput, yInput } = this.state;

    // TOKEN VERIFICATION ON BACKEND WHEN CONNECTING
    const token = localStorage.getItem("jwtToken").substring(4);

    const socket = io(process.env.REACT_APP_SOCKET_CONNECTION, {
      query: `auth_token=${token}`
    });

    const roomConfig = [];

    if (votingInput) {
      roomConfig.push({ type: "voting", params: [votingInput] });
      /* roomConfig.voting = { params: votingInput }; */
    }

    if (xInput) {
      roomConfig.push({ type: "lectureSpeed", xInput, yInput });
      /* roomConfig.lectureSpeed = { xInput, yInput }; */
    }

    const sessionNameNoSpaces = sessionName.replace(new RegExp(" ", "g"), "_");

    socket.on("error", err => {
      getErrors({ room: err });
    });

    axios
      .get(
        `${
          process.env.REACT_APP_API_BASE_URL
        }/api/my-sessions/${userId}-${sessionNameNoSpaces}`
      )
      .then(response => {
        if (response.data.data) {
          getErrors({ room: "Room Already Exists" });
        } else {
          socket.emit("connectToNewSession", {
            roomId: `${userId}-${sessionNameNoSpaces}`,
            userId,
            roomConfig
          });
        }
      })
      .catch(error => {
        getErrors(error);
      });

    socket.on("sessionCreationCheck", success => {
      if (success) {
        createRoom(sessionName);
        clearErrors();
      } else {
        getErrors({ room: "Failed to create room" });
      }
    });

    socket.on("userLeftRoom", data => {
      this.roomArray = this.roomArray.filter(user => user.userId !== data);
    });

    const { votingInputAverage } = this.props
    const newData = votingInputAverage

    // Recieves the emitted votinginput from a user
    socket.on("votingInputs", data => {
      newData.push(data)
      setVotingInputDispatch(newData);
      
    });

    socket.on("roomAverageValue", data => {
      const { sliderValue, userId: sliderUserId } = data;
      this.roomArray = this.roomArray.map(user => {
        if (user.userId === sliderUserId) {
          const loser = user;
          loser.value = sliderValue;
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
        sessionAverageSetter(roomAverageValue);
      }
    });

    socket.on("newUserJoinedRoom", newUser => {
      this.roomArray.push(newUser);
    });
  };

  render() {
    const { roomName, roomCreatedConditional, userId, error } = this.props;
    const { sessionName, xInput, yInput, voting, breakTime } = this.state;
    return (
      <div className="d-flex justify-content-center pt-2">
        <div
          className="border border-info px-5 pt-5"
          style={{ marginBottom: "3rem" }}
        >
          <div className="container p-2 justify-content-center ">
            <div className="d-flex justify-content-center p-4">
              {!roomCreatedConditional ? (
                <div>
                  <div className="mb-2">
                    <h1>Create your lecture by adding components below</h1>
                    <button type="button" onClick={this.voting}>
                      Voting
                    </button>
                    <button type="button" onClick={this.breakTime}>
                      Break
                    </button>
                    {voting ? (
                      <Voting handleVotingInput={handleVotingInput} />
                    ) : null}
                    {breakTime ? <BreakTime /> : null}
                    <h3 className="mx-auto">Create New Session</h3>
                    <span className="lead text-danger">{error.room}</span>
                  </div>
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
                  <VotingChart />
                  <LiveSession
                    roomId={`${userId}-${roomName}`}
                    roomName={roomName}
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
  sessionAverageSetter: roomAverageValue =>
    dispatch(setSessionAverage(roomAverageValue)),
  createRoom: sessionName => dispatch(roomCreated(sessionName)),
  getErrors: error =>
    dispatch({
      type: GET_ERRORS,
      payload: error
    }),
  clearErrors: () =>
    dispatch({
      type: CLEAR_ERRORS
    }),
  setVotingInputDispatch: data => dispatch(setVotingInput(data))
});

const mapStateToProps = state => ({
  session_live: state.room.session_live,
  roomCreatedConditional: state.room.room_created,
  roomName: state.room.room_name,
  // eslint-disable-next-line no-underscore-dangle
  userId: state.auth.user._id,
  error: state.errors,
  roomAverageValue: state.room.session_average,
  votingInput: state.room.voting_input,
  votingInputAverage: state.room.voting_input_average
});

NewSession.propTypes = {
  createRoom: PropTypes.func.isRequired,
  roomName: PropTypes.string,
  sessionAverageSetter: PropTypes.func.isRequired,
  roomCreatedConditional: PropTypes.bool,
  userId: PropTypes.string,
  getErrors: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  error: PropTypes.object,
  setVotingInputDispatch: PropTypes.func.isRequired,
  votingInput: PropTypes.object,
  votingInputAverage: PropTypes.object
};

NewSession.defaultProps = {
  userId: null,
  roomName: "",
  roomCreatedConditional: false,
  error: null,
  votingInput: null,
  votingInputAverage: null
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withAuth(NewSession)));
