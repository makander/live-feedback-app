import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import PropTypes from "prop-types";
import { sliderInput } from "../actions/room";

function GuestFeedback(props) {
  const { sliderValue, handleSlider, session_user_id, room_id } = props;
  return (
    <div className="jumbotron bg-light">
      <h2>Feedback Component</h2>
      <p>Slider value: {sliderValue}</p>
      <form>
        <div className="form-group row" style={{ marginTop: "3rem" }}>
          <div className="col-sm-8 p-2 mx-auto d-flex">
            <div className="p-2 mx-2">0</div>
            <input
              name="feedback-slider"
              onChange={e => handleSlider(e, session_user_id, room_id)}
              id="feedback-slider"
              type="range"
              max="10"
              min="0"
              value={sliderValue}
              className="form-control"
            />
            <input
              type="hidden"
              name="socket_data"
              value={{ session_user_id, room_id }}
            />
            <div className="p-2 mx-2">10</div>
          </div>
        </div>
      </form>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  handleSlider: (e, session_user_id, room_id) => {
    const sliderValue = e.target.value;
    sliderInput(dispatch, sliderValue);
    const socket = io(process.env.REACT_APP_SOCKET_CONNECTION);
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
  room_id: PropTypes.string.isRequired
};

GuestFeedback.defaultProps = {
  sliderValue: "5",
  session_user_id: ""
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuestFeedback);
