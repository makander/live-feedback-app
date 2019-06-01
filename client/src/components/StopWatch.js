import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";

export default function StopWatch({ timerActive }) {

  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  let timerInterval;

  useEffect(() => {
    if (timerActive === true && !timerInterval) {
      timerInterval = setInterval(() => {
        if (minutes <= 58) {
          setMinutes(minutes + 1);
        }
        if (minutes >= 59) {
          setMinutes(0);
          setHours(hours + 1);
        }
      }, 60000);
    };
  
    return(() => {
      clearInterval(timerInterval);
    });

  });

  return (
    <span className="timer badge badge-dark mt-4">{hours < 10 ? '0' : ''}{hours}<span className={timerActive ? 'blinking' : ''}>:</span>{minutes < 10 ? '0' : ''}{minutes}</span>
  )
}

StopWatch.propTypes = {
  timerActive: PropTypes.bool,
};

StopWatch.defaultProps = {
  timerActive: false,
};