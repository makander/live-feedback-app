import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { toggleLiveSession } from "../actions/room";

// Components
import LiveSession from "../components/LiveSession";

/* ---------TODO--------- 

IMPLEMENT ROUTING ELEMENTS

--------------------------
  STORE VALUES REQUIRED
    SESSION_LIVE: false ----> Initial state needs to have this as false, trigger when pressing button
    CURRENT_ROOM: null ----> Which room is being monitored by user
    CURRENT_ROOM: null ----> Which room is being monitored by user
    CURRENT_ROOM_DATA: null ----> Input from the current room users that will be displayed and later sent to MONGODB
    AVERAGE_SCORE: null ----> The current calculated score from the users
---------------------  */ 



function NewSession(props) {
return (
  <div>
    <h1>Welcome to the New Session view</h1>
    <p>Session_State: {(props.session_live)?"on":"off"}</p>
    
    <button onClick={props.handleClickNewSession}>New Session</button>
      {(props.session_live) 
      ?<LiveSession />
      : null
      }
      <div style={{margin:"10px"}}>
      <button>
        <Link
            to="/dashboard"
            style={{
              width: "140px",
              borderRadius: "3px",
              letterSpacing: "1.5px"
            }}
          >
           Back
          </Link>
        </button>
      </div>
  </div>
)
} 

const mapDispatchToProps = dispatch => ({
  handleClickNewSession: () => toggleLiveSession(dispatch)
  }
);

const mapStateToProps = state => (
{
  session_live: state.room.session_live,
  current_room: {
    id: null,
    average_score: null
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NewSession));
