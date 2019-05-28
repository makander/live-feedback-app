import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class ProgressBar extends Component {
  componentDidMount() {}

  componentDidUpdate() {
    const { roomAverageValue } = this.props;    
    const canvas = document.getElementById("averageCanvas");
    const ctx = canvas.getContext("2d");
    const x = roomAverageValue/100;
    ctx.fillStyle = "green";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, (canvas.width*x), 100);
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
  roomAverageValue: "5"
};


const mapStateToProps = state => ({
  roomAverageValue: state.room.session_average
});

export default connect(mapStateToProps)(ProgressBar);
