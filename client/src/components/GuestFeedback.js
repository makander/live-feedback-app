import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import PropTypes from "prop-types";
import { sliderInput } from "../actions/room";
import "./Layout/feedback-slider.css";

function GuestFeedback(props) {
  const {
    sliderValue,
    handleSlider,
    sessionUserId,
    roomId,
    roomConfig
  } = props;
  return (
    <div>
      <div className="d-flex justify-content-center">
        {roomConfig[1].xInput ? roomConfig[1].xInput : 0}
      </div>
      <div className="d-flex justify-content-center">
        <form>
          <div className="form-group row" style={{ marginTop: "3rem" }}>
            <input
              name="feedback-slider"
              onChange={e => handleSlider(e, sessionUserId, roomId)}
              id="feedback-slider"
              type="range"
              max={roomConfig[1].xInput ? roomConfig[1].xInput : 100}
              min={roomConfig[1].yInput ? roomConfig[1].yInput : 0}
              value={sliderValue}
              className="slider"
              step="10"
            />
            <input
              type="hidden"
              name="socket_data"
              value={{ sessionUserId, roomId }}
            />
          </div>
        </form>
      </div>
      <div className="d-flex justify-content-center">
        {roomConfig[1].yInput ? roomConfig[1].yInput : 10}
      </div>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  handleSlider: (e, sessionUserId, roomId) => {
    const sliderValue = e.target.value;
    dispatch(sliderInput(sliderValue));
    const socket = io(process.env.REACT_APP_SOCKET_CONNECTION);
    socket.emit("changeSlider", sliderValue, roomId, sessionUserId);
  }
});

const mapStateToProps = state => ({
  sliderValue: state.room.slider_value,
  sessionUserId: state.room.session_user_id
});

GuestFeedback.propTypes = {
  sliderValue: PropTypes.string,
  handleSlider: PropTypes.func.isRequired,
  sessionUserId: PropTypes.string,
  roomId: PropTypes.string.isRequired,
  roomConfig: PropTypes.array
};

GuestFeedback.defaultProps = {
  sliderValue: "50",
  sessionUserId: "",
  roomConfig: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuestFeedback);
