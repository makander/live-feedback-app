import React, { Component } from "react";
import { connect } from "react-redux";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";

function SessionDetails (props) {

  const { sessionData } = props.location;

    const xArray = [];
    const yArray = [];
    sessionData.room_data.forEach(coords => {
          xArray.push(coords.x)
          yArray.push(coords.y)
      });
    
    const lineData = {
    chartData: {
      labels: xArray,
      datasets: [
        {
          label: "Score",
          data: yArray,
          borderColor: "CadetBlue",
          backgroundColor: "AliceBlue"
          
        }
      ]
    }
  }

    return (
      <div className="d-flex justify-content-center pt-2">
        <div className="container">
          <h1 className="text-center">
            {sessionData.room_data.length === 0 
            ? <h2 className="jumbotron bg-danger">No Data Recorded For This Session</h2> 
            : <Line data={lineData.chartData} />
           }
          </h1>

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

const mapStateToProps = state => ({
  sessionData: state.auth.user.session_data
});

export default connect(
  mapStateToProps,
  null
)(SessionDetails);
