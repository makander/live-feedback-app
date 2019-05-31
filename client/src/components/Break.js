import React, { Component } from "react";

const io = require("socket.io-client");

const socket = io(`${process.env.REACT_APP_SOCKET_CONNECTION}`);

export default class Break extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  break = () => {
    socket.emit("Break");
    document.getElementById("button").disabled = true;
  };

  render() {
    return (
      <div>
        <p>When you feel the need</p>
        <button onClick={this.break} id="button" type="button">
          Break{" "}
        </button>
      </div>
    );
  }
}
