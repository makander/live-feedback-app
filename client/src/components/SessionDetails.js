import React, { Component } from "react";
import { connect } from "react-redux";
import { Line } from "react-chartjs-2";

class SessionDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { sessionData } = this.props;

    const xArray = [];
    const yArray = [];
    sessionData.map(data => {
      if (data.id === this.props.match.params.id) {
        return data.room_data.map(roomdata => {
          console.log("roomdata ", roomdata);
          xArray.push(roomdata.x)
          yArray.push(roomdata.y)
        });
      }
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
            Session: {this.props.match.params.id.split("-")[1]}
          </h1>
          <Line data={lineData.chartData} />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = () => ({});

const mapStateToProps = state => ({
  sessionData: state.auth.user.session_data
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionDetails);
