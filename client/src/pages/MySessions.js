import React, { Component } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";

class MySessions extends Component {
  constructor(props) {
    super(props);
    this.io = require("socket.io-client");
    this.socket = this.io(`http://192.168.99.100:5000/`);
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

export default MySessions;
