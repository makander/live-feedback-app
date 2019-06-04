import React from "react";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";

// SESSION DATA IS PASSED DOWN AS A LINK PROP
// IN MY SESSIONS


function SessionDetails(props) {
  const { location } = props;
  const xArray = [];
  const yArray = [];
  location.sessionData.room_data.forEach(coords => {
    xArray.push(coords.x);
    yArray.push(coords.y);
  });

  const options = {
    legend: {
      display: true,
      position: "bottom"
    }
  };

  const chartData = {
    labels: xArray,
    datasets: [
      {
        label: "Lecture Spped (50 being normal tempo)",
        data: yArray,
        borderColor: "CadetBlue",
        backgroundColor: "AliceBlue"
      }
    ]
  };

  return (
    <div className="d-flex justify-content-center pt-2">
      <div className="container">
        <div className="text-center">
          {location.sessionData.room_data.length === 0 ? (
            <h2 className="jumbotron bg-danger">
              No Data Recorded For This Session
            </h2>
          ) : (
            <Line data={chartData} options={options} />
          )}
        </div>

        <div className="d-flex justify-content-center pb-3">
          <Link
            to="/my-sessions"
            role="button"
            className="btn btn-outline-secondary"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

SessionDetails.propTypes = {
  location: PropTypes.object.isRequired
};

export default SessionDetails