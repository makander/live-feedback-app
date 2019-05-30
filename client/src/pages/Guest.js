import React, { Component } from "react";
import { connect } from "react-redux";
import { joinedRoom } from "../actions/room";

import GuestFeedback from "../components/GuestFeedback";

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

    // this.socket.on("ping", () => {
    //   console.log("PONG");
    //   this.socket.emit("pong");
    // });

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
  }

  render() {
    const { roomId } = this.props.match.params;
    const { session_room_config } = this.props;

    return (
      <div className="d-flex justify-content-center pt-2 container-fluid">
        {roomId !== undefined ? (
          <div className="border border-info py-5" style={{ width: "30rem" }}>
            <div>
              <h2 className="text-center px-2">
                Welcome To Room: <br /> {roomId.split("-")[1]}
              </h2>

              {this.props.isConnected ? (
                <div>
                  <p className="text-center">
                    Pull the slider to get affect the score.
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-center bg-danger">
                    Something went wrong!
                  </h3>
                  <p>
                    Maybe something went wrong on the other side or the link was
                    just plain wrong. Either which way, this room does not
                    exist.
                  </p>
                </div>
              )}
            </div>
            {/* {this.props.lectureStarted ? ( */}
            <GuestFeedback room_id={roomId} room_config={session_room_config} />
            {/*  ) : (
              <p>Lecture have not yet started</p>
            )} */}
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
