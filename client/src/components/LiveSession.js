import React from "react";

// This component should handle all of the rendering of real time lecture feedback
// Note- 
export default function LiveSession(props) {
  return (
  <div>
    <h2>Session Active in Room {props.room_name}</h2>
    <p>Average Score: 5</p>
    <p>Timer: 00:00</p>
    <button>Start Lecture</button>
    <button>Cancel Lecture</button>
  </div>
  )
}

