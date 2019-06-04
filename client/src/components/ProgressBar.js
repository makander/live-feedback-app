import React, { Component } from "react";
import PropTypes from "prop-types";

class ProgressBar extends Component {

  componentDidUpdate() {
    const { roomAverageValue } = this.props;
    const canvas = document.getElementById("averageCanvas");
    const ctx = canvas.getContext("2d");
    const x = roomAverageValue / 100;
    ctx.fillStyle = "green";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width * x, canvas.height);
  }

  render() {
    return (
      <div className="justify-content-center">
        <canvas
          id="averageCanvas"
          style={{ backgroundColor: "black", width: "100%", height: "100px" }}
        />
      </div>
    );
  }
}

ProgressBar.propTypes = {
  roomAverageValue: PropTypes.string
};

ProgressBar.defaultProps = {
  roomAverageValue: "50"
};


export default ProgressBar;
