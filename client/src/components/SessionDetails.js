import React, { Component } from "react";
import { connect } from "react-redux";
import { Line } from "react-chartjs-2";

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
            ? <h2>No Data Recorded For This Session</h2> 
            : <Line data={lineData.chartData} />
           }
          </h1>
          
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
