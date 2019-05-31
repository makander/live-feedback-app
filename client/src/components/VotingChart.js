import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

class VotingChart extends Component {
  constructor(props) {
    super(props);
    const { labels } = this.props
    this.labels = labels
    this.data = {
      data: {
        labels: Object.values(labels),
        datasets: [
          {
            label: "Voting",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: []
          }
        ]
      }
    };
  }

  componentWillReceiveProps() {
    const { labels, values } = this.props;
    const labelArray = Object.values(labels);
    const result = Array(parseInt(Object.values(labelArray).length, 10)).fill(0);
    labelArray.forEach(label => {
      values.forEach(valueStillArray => {
        valueStillArray.forEach(value => {
          if (value === label) {
            const index = labelArray.indexOf(label);
            // eslint-disable-next-line no-plusplus
            result[index]++;
          }
        });
      });
    });

    this.data = {
      data: {
        labels: Object.values(labels),
        datasets: [
          {
            label: "Voting",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: result
          }
        ]
      }
    };
  }

  render() {
    return (
      <div className="justify-content-center">
        <Bar
          data={this.data.data}
          width="500px"
          height="500px"
          options={{
            maintainAspectRatio: false,
            scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
          }}
          redraw
        />
      </div>
    );
  }
}

VotingChart.propTypes = {
  labels: PropTypes.array.isRequired,
  values: PropTypes.array
};

VotingChart.defaultProps = {
  values: null
};

const mapStateToProps = state => ({
  labels: state.room.voting_input,
  values: state.room.voting_input_average
});

export default connect(mapStateToProps)(VotingChart);
