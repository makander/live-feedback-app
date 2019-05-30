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
    session_user_id,
    room_id,
    room_config
  } = props;
  return (
    <div className="d-flex justify-content-center">
      <form>
        <div className="form-group" style={{ marginTop: "3rem" }}>
          <div className="">{room_config ? room_config.properties.min : 0}</div>
          <input
            name="slider"
            onChange={e => handleSlider(e, session_user_id, room_id)}
            type="range"
            max={room_config ? room_config.properties.max : 7}
            min={room_config ? room_config.properties.min : 0}
            value={sliderValue}
            className="slider"
            step="10"
          />
          <input
            type="hidden"
            style={{ visible: "none" }}
            name="socket_data"
            value={{ session_user_id, room_id }}
          />
          {room_config ? room_config.properties.max : 10}
        </div>
      </form>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  handleSlider: (e, session_user_id, room_id) => {
    const sliderValue = e.target.value;
    dispatch(sliderInput(sliderValue));
    const socket = io(process.env.REACT_APP_SOCKET_CONNECTION);
    console.log(room_id);
    socket.emit("changeSlider", sliderValue, room_id, session_user_id);
  }
});

const mapStateToProps = state => ({
  sliderValue: state.room.slider_value,
  session_user_id: state.room.session_user_id
});

GuestFeedback.propTypes = {
  sliderValue: PropTypes.string,
  handleSlider: PropTypes.func.isRequired,
  session_user_id: PropTypes.string,
  room_id: PropTypes.string.isRequired,
  room_config: PropTypes.object.isRequired
};

GuestFeedback.defaultProps = {
  sliderValue: "50",
  session_user_id: ""
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuestFeedback);
