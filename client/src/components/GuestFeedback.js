import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import PropTypes from "prop-types";
import { sliderInput } from "../actions/room";
/* import "./Layout/feedback-slider.css"; */

function GuestFeedback(props) {
  const {
    sliderValue,
    handleSlider,
    session_user_id,
    room_id,
    room_config
  } = props;
  console.log(room_config);
  return (
    <div className="d-flex justify-content-center">
      <form>
        <div className="form-group row" style={{ marginTop: "3rem" }}>
          <div className="col-sm-8 p-2 mx-auto d-flex">
            <div className="p-2 mx-2">
              {room_config[1].xInput ? room_config[1].xInput : 0}
            </div>
            <input
              name="feedback-slider"
              onChange={e => handleSlider(e, session_user_id, room_id)}
              id="feedback-slider"
              type="range"
              max={room_config[1].xInput ? room_config[1].xInput : 7}
              min={room_config[1].yInput ? room_config[1].yInput : 0}
              value={sliderValue}
              className="form-control"
            />
            <input
              type="hidden"
              name="socket_data"
              value={{ session_user_id, room_id }}
            />
            <div className="p-2 mx-2">
              {room_config[1].yInput ? room_config[1].yInput : 10}
            </div>
          </div>
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
