import React, { Component } from "react";
import { connect } from "react-redux";
import { joinedRoom } from "../actions/room";

// Components
import GuestFeedback from "../components/GuestFeedback";
import Voting from "../components/voting";

class Guest extends Component {
  constructor(props) {
    super(props);
    this.io = require("socket.io-client");
    this.socket = this.io(`${process.env.REACT_APP_SOCKET_CONNECTION}`);
    this.roomArray = [];
    this.state = { userId: null };
  }

  componentDidMount() {
    this.socket.emit("connectToNewSession", {
      roomId: this.props.match.params.roomId,
      role: "guest"
    });

    this.socket.on("ping", () => {
      console.log("PONG Sent");
      this.socket.emit("pong");
    });

    this.socket.on("joinedRoom", (userId, roomConfig) => {
      console.log("user joined room");
      this.props.joinedRoom(userId, roomConfig);
    });

    window.addEventListener("beforeunload", ev => {
      ev.preventDefault();
      this.socket.emit("feedbackSessionLeave", {
        inputUserId: this.props.session_user_id,
        roomId: this.props.match.params.roomId
      });
    });
  }

  componentWillUnmount() {
    this.socket.emit("feedbackSessionLeave", {
      inputUserId: this.props.session_user_id,
      roomId: this.props.match.params.roomId
    });

    console.log("props", this.props);
  }

  render() {
    const { roomId } = this.props.match.params;
    const { session_room_config } = this.props;
    console.log(this.props.session_room_config);

    return (
      <div className="d-flex justify-content-center pt-2 container-fluid">
        {roomId !== undefined ? (
          <div
            className="border border-info px-5 pt-5"
            style={{ marginBottom: `${8}rem` }}
          >
            <div>
              <h1 className="text-center">
                Welcome To Room: {roomId.split("-")[1]}
              </h1>
              <h3>{this.props.session_user_id}</h3>

              {this.props.isConnected ? (
                <div>
                  <h3 className="text-center bg-primary">JOINED ROOM</h3>
                  <p>
                    Pull the slider to get affect the score. For demo purposes
                    it will be rendered in the document title. So keep track of
                    your tab.
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-center bg-danger">ROOM DOES NOT EXIST</h3>
                  <p>
                    Maybe something went wrong on the other side or the link was
                    just plain wrong. Either which way, this room does not
                    exist.
                  </p>
                </div>
              )}
            </div>

            {/* Conditional rendering of x- yInput config params */}
            {session_room_config ? (
              <GuestFeedback
                room_id={roomId}
                room_config={session_room_config}
              />
            ) : null}

            {/* Conditional rendering of voting config params */}
            {session_room_config ? (
              <Voting voting_params={session_room_config[0]} />
            ) : null}
          </div>
        ) : (
          <h1 className="jumbotron">URL parameters missing</h1>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  joinedRoom: (userId, roomConfig) => {
    console.log("roomConfig", roomConfig);
    dispatch(joinedRoom(userId, roomConfig));
  }
});

const mapStateToProps = state => ({
  isConnected: state.room.joined_room,
  session_user_id: state.room.session_user_id,
  session_room_config: state.room.session_room_config
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Guest);
