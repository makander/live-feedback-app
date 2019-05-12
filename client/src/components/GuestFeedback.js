import React from 'react';

const handleSlider = e => {
  const sliderValue = e.target.value;
  console.log(sliderValue);
};

export default function GuestFeedback() {
  return (
    <div className="jumbotron bg-light">
    <h2>Feedback Component</h2>
    <form>
    <div className="form-group row" style={{ marginTop: 3 + "rem" }}>
          <div class="col-sm-8 p-2 mx-auto d-flex">
          <div className="p-2 mx-2">0</div>
            <input
              name="feedback-slider" 
              onChange={handleSlider}
              id="feedback-slider"
              type="range"
              max="10"
              min="0"
              className="form-control"
            />
            <div className="p-2 mx-2">10</div>
            </div>
            </div>
    </form>
    </div>
  )
}
