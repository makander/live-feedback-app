import React, { Component } from 'react'
import { connect } from "react-redux";
import { joinedRoom } from "../actions/room";

import GuestFeedback from "../components/GuestFeedback";


class Guest extends Component {
  constructor(props) {
    super(props);
    this.io = require("socket.io-client");
    this.socket = this.io("http://localhost:5000/");
  }

  componentWillMount() {
    this.socket.emit("connectToNewSession", this.props.match.params.roomId, false);
    this.socket.on("joinedRoom", this.props.joinedRoom);
    console.log(this.props);
    }

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
              {(this.props.isConnected) ? <h3>JOINED ROOM</h3> : <h3>ROOM DOES NOT EXIST</h3>}
              <p>We'll make a check here to see if the room is active. This means we'll check the roomId param prop via a io.emit event and listen for the response with a socket.on</p>
              <p>If the room is active we'll render the feedback UI component. The feedback slider currently just console.logs the slider value.</p>
              <ul>
                <li>Retrieve and display Room data from socket.on event. No need to implement store functionality yet</li>
              </ul>
            </div>
       <GuestFeedback />
      </div>)
      : <h1 className="jumbotron">URL parameters missing</h1>      
        } 
      </div>)
      }
}

const mapDispatchToProps = dispatch => ({
  joinedRoom: () => {
    joinedRoom(dispatch)
  }
});

const mapStateToProps = state => ({
  isConnected: state.room.joined_room
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Guest);