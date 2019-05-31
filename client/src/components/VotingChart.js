import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class VotingChart extends Component {
  componentDidMount() {}

  componentDidUpdate() {
    const { votingInputs } = this.props;
    console.log(votingInputs);
  }

  render() {
    return (
      <div className="justify-content-center">
        {/*  <canvas
          id="averageCanvas"
          style={{ backgroundColor: "black", width: "100%", height: "100px" }}
        /> */}
        <h1>heeeej</h1>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  votingInputs: state.room.voting_input_average
});

export default connect(mapStateToProps)(VotingChart);
