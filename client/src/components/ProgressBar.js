import React, { Component } from "react";
import { connect } from "react-redux";
import room from "../reducers/room";

class ProgressBar extends Component {
  componentDidMount() {}

  componentDidUpdate() {
    const canvas = document.getElementById("averageCanvas");
    const ctx = canvas.getContext("2d");
    const { roomAverageValue } = this.props;
    console.log(roomAverageValue);
    const x = roomAverageValue * 30;
    console.log(canvas.width);
    ctx.fillStyle = "green";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, x, 100);
  }

  render() {
    return (
      <div className="justify-content-center">
        <button type="button" onClick={() => console.log(this.props)}>
          Get Props
        </button>
        <canvas
          id="averageCanvas"
          ref="canvas"
          style={{ backgroundColor: "black", width: "100%", height: "100px" }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  roomAverageValue: state.room.session_average
});

export default connect(mapStateToProps)(ProgressBar);
