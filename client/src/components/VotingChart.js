import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";

class VotingChart extends Component {
  constructor(props) {
    super(props);
    const { labels } = this.props;
    this.labels = labels;
    this.data = {
      data: {
        labels: labels || [],
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

    const result = Array(parseInt(labels.length, 10)).fill(0);
    labels.forEach(label => {
      values.forEach(valueStillArray => {
        valueStillArray.forEach(value => {
          if (value === label) {
            const index = labels.indexOf(label);
            // eslint-disable-next-line no-plusplus
            result[index]++;
          }
        });
      });
    });

    this.data = {
      data: {
        labels,
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
    if (this.data.data.labels.length) {
      return (
        <div className="justify-content-center">
          <Bar
            data={this.data.data}
            width={500}
            height={500}
            options={{
              maintainAspectRatio: false,
              scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
            }}
            redraw
          />
        </div>
      );
    }
    return null;
  }
}

VotingChart.propTypes = {
  labels: PropTypes.array,
  values: PropTypes.array
};

VotingChart.defaultProps = {
  values: null,
  labels: []
};

const mapStateToProps = state => ({
  labels: state.room.voting_input,
  values: state.room.voting_input_average
});

export default connect(mapStateToProps)(VotingChart);
