import React, { Component } from "react";
import { connect } from "react-redux";
import { Line, Scatter } from "react-chartjs-2";

class SessionDetails extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const { sessionData } = this.props;

    const scatterData = [];
    const session = sessionData.map(data => {
      if (data.id === this.props.match.params.id) {
        return data.room_data.map(roomdata => {
          console.log("roomdata ", roomdata);
          return <h1>{scatterData.push(roomdata)}</h1>;
        });
      }
    });

    const data = {
      datasets: [
        {
          label: "Value",
          backgroundColor: "rgba(255, 0, 225, 0.75)",
          data: scatterData,
          showLine: true,
          responsive: true
        }
      ]
    };

    return (
      <div className="d-flex justify-content-center pt-2">
        <div className="container">
          <h1 className="text-center">
            Session: {this.props.match.params.id.split("-")[1]}
          </h1>
          <Scatter data={data} />
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
