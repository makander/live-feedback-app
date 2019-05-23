import React, { Component } from "react";
import { connect } from "react-redux";
import { joinedRoom } from "../actions/room";

import GuestFeedback from "../components/GuestFeedback";

class Guest extends Component {
  constructor(props) {
    super(props);
    this.io = require("socket.io-client");
    this.socket = this.io(`${process.env.REACT_APP_SOCKET_CONNECTION}`);
  }

  componentDidMount() {
    console.log(this.props.match.params.roomId);
    this.socket.emit(
      "connectToNewSession",
      this.props.match.params.roomId,
      false
    );
    this.socket.on("ping", () => {
      console.log("PONG Sent");
      this.socket.emit("pong");
    });
    this.socket.on("joinedRoom", userId => {
      this.props.joinedRoom(userId);
      localStorage.setItem("guest", userId);
    });
    this.socket.on("roomAverageValue", roomAverageValue => {
      document.title = roomAverageValue;
    });

    window.addEventListener("beforeunload", ev => {
      ev.preventDefault();
      this.socket.emit("feedbackSessionLeave", this.props.session_user_id);
    });
  }

  componentWillUnmount() {
    this.socket.emit("feedbackSessionLeave", this.props.session_user_id);
  }

  render() {
    const { roomId } = this.props.match.params;
    return (
      <div className="d-flex justify-content-center pt-2 container-fluid">
        {roomId !== undefined ? (
          <div
            className="border border-info px-5 pt-5"
            style={{ marginBottom: `${8}rem` }}
          >
            <div>
              <h1 className="text-center">Welcome To Room: {roomId.split("-")[1]}</h1>
              
              {this.props.isConnected ? (
                <div>
                <h3 className="text-center bg-primary">JOINED ROOM</h3>
                <p>
                  Pull the slider to get affect the score. For demo purposes it will be rendered in the document title. So keep track of your
                  tab.
                </p>
                </div>
              ) : (
                <div>
                <h3 className="text-center bg-danger">ROOM DOES NOT EXIST</h3>
                <p>
                  Maybe something went wrong on the other side or the link was just plain wrong. Either which way, this room does not exist.
                </p>
                </div>
              )}
            </div>
            {/* {this.props.lectureStarted ? ( */}
            <GuestFeedback room_id={roomId} />
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
  joinedRoom: userId => {
    joinedRoom(dispatch, userId);
  }
});

const mapStateToProps = state => ({
  isConnected: state.room.joined_room,
  session_user_id: state.room.session_user_id
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Guest);
