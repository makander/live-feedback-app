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
    <div className="d-flex justify-content-center">
      <form>
        <div className="form-group" style={{ marginTop: "3rem" }}>
          <div className="">{roomConfig ? roomConfig.properties.min : 0}</div>
          <input
            name="slider"
            onChange={e => handleSlider(e, sessionUserId, roomId)}
            type="range"
            max={roomConfig ? roomConfig.properties.max : 100}
            min={roomConfig ? roomConfig.properties.min : 0}
            value={sliderValue}
            className="slider"
            step="10"
          />
          <input
            type="hidden"
            style={{ visible: "none" }}
            name="socket_data"
            value={{ sessionUserId, roomId }}
          />
          {roomConfig ? roomConfig.properties.max : 10}
        </div>
      </form>
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
  roomConfig: PropTypes.object
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
