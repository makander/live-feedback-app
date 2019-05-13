import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";

import { sliderInput } from "../actions/room";

function GuestFeedback(props) {
  return (
    <div className="jumbotron bg-light">
      <h2>Feedback Component</h2>
      <p>Slider value: {props.sliderValue}</p>
      <form>
        <div className="form-group row" style={{ marginTop: 3 + "rem" }}>
          <div class="col-sm-8 p-2 mx-auto d-flex">
            <div className="p-2 mx-2">0</div>
            <input
              name="feedback-slider"
              onChange={props.handleSlider}
              id="feedback-slider"
              type="range"
              max="10"
              min="0"
              value={props.sliderValue}
              className="form-control"
            />
            <div className="p-2 mx-2">10</div>
          </div>
        </div>
      </form>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  handleSlider: e => {
    const sliderValue = e.target.value;
    sliderInput(dispatch, sliderValue);
    const socket = io(process.env.REACT_APP_SOCKET_CONNECTION);
    socket.emit("changeSlider", sliderValue);
  }
});

const mapStateToProps = state => ({
  sliderValue: state.room.slider_value
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuestFeedback);
