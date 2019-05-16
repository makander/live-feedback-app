import React, { Component } from "react";
import { Link } from "react-router-dom";
import withAuth from "../hocs/withAuth";
import io from "socket.io-client";

class MySessions extends Component {
  constructor(props) {
    super(props);
    this.io = require("socket.io-client");
    this.socket = this.io(`${process.env.REACT_APP_SOCKET_CONNECTION}`);
  }

  componentWillMount() {
    this.socket.emit("loadSessions");
    this.socket.on("sendData", allRoomData => {
      console.log(allRoomData);
    });
  }

  render() {
    return (
      <div>
        <h2>List of Previous Sessions</h2>
        <ul>
          <li>Session Name: [username.customName]</li>
          <li>Session Name: [username.customName]</li>
        </ul>
        <button type="button">
          <Link
            to="/dashboard"
            style={{
              width: "140px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              textDecoration: "none"
            }}
          >
            Back
          </Link>
        </button>
      </div>
    );
  }
}

export default withAuth(MySessions);
