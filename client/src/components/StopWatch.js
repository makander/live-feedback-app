import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";

export default function StopWatch({ timerActive, startTime }) {

  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  let timerInterval;

  useEffect(() => {
    console.log("Effect used");
    if (timerActive === true && !timerInterval) {
      console.log("Timer if triggered");
      timerInterval = setInterval(() => {
        if (minutes <= 58) {
          console.log("Increase minutes")
          setMinutes(minutes + 1);
        }
        if (minutes >= 59) {
          console.log("Increase Hours");
          setMinutes(0);
          setHours(hours + 1);
        }
      }, 60000);
    };
  
    return(() => {
      console.log("Clear interval");
      clearInterval(timerInterval);
    });

  });

  return (
    <span className="timer badge badge-dark mt-4">{hours < 10 ? '0' : ''}{hours}<span className={timerActive ? 'blinking' : ''}>:</span>{minutes < 10 ? '0' : ''}{minutes}</span>
  )
}

StopWatch.propTypes = {
  timerActive: PropTypes.bool,
  startTime: PropTypes.object
};

StopWatch.defaultProps = {
  timerActive: false,
  startTime: new Date()
};