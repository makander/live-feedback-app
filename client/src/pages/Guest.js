import React, { Component } from 'react'


export default class Guest extends Component {
  constructor(props) {
    super(props);
  }
  

  handleSlider = e => {
    const sliderValue = e.target.value;
    console.log(sliderValue);
  };
  render() {
    const { roomId }  = this.props.match.params;
    return (<div className="d-flex justify-content-center pt-2"> 
          { (roomId !== undefined) 
           ? (<div
            className="border border-info px-5 pt-5"
            style={{ marginBottom: 8 + "rem" }}>
            <div>
              <h1 className="text-center">Welcome To Room: {roomId}</h1>
              <h2>Guest Page Todos</h2>
              <p>We'll make a check here to see if the room is active. This means we'll check the roomId param prop via a io.emit event and listen for the response with a socket.on</p>
              <p>If the room is active we'll render the feedback UI component. The feedback slider currently just console.logs the slider value.</p>
              <ul>
                <li>Retrieve and display Room data from socket.on event. No need to implement store functionality yet</li>
              </ul>
            </div>
        <form>
        <div className="form-group row jumbotron" style={{ marginTop: 3 + "rem" }}>
              <div class="col-sm-8 p-2 mx-auto">
                <input
                  name="feedback-slider" 
                  onChange={this.handleSlider}
                  id="feedback-slider"
                  type="range"
                  max="10"
                  min="0"
                  className="form-control"
                />
                </div>
                </div>
        </form>
      </div>)
      : <h1 className="jumbotron">URL parameters missing</h1>      
        } 
      </div>)
      }
}
