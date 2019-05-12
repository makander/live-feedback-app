import React from "react";

// This component should handle all of the rendering of real time lecture feedback
// Note- 
export default function LiveSession(props) {
  return (
  <div>
    <h2>Session Active in Room {props.room_name}</h2>
    <p>Room ID: {props.roomId}</p>
    <p>Room Link: <a rel="noopener noreferrer" href={`http://localhost:3000/guest/${props.roomId}`} target="_blank">{`http://localhost:3000/guest/${props.roomId}`}</a></p>
    <p>Average Score: 5</p>
    <p>Timer: 00:00</p>
    <button>Start Lecture</button>
    <button>Cancel Lecture</button>
  </div>
  )
}

