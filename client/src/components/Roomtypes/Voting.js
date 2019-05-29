import React, { Component } from "react";
import { connect } from "react-redux";

import { handleVotingInput } from "../../actions/room";

class Voting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfOptions: null
    };
  }

  createForm = e => {
    console.log(this.props);
    e.preventDefault();
  };

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log("state", this.state);
  };

  handleOnSubmitOptions = e => {
    e.preventDefault();
    const options = Array(parseInt(e.target.options.value, 10)).fill(1);
    this.setState({
      numberOfOptions: options
    });
  };

  render() {
    const { numberOfOptions } = this.state;
    const { handleVotingInput } = this.props;

    return (
      <div>
        <h1>Voting</h1>
        <p>Allow participants to vote for topics specified below</p>
        <form onSubmit={e => this.handleOnSubmitOptions(e)}>
          <input type="number" name="options" min="1" max="5" />
          <button type="submit">Number of options</button>
        </form>
        {numberOfOptions ? (
          <form
            className="form-inline"
            onSubmit={e => handleVotingInput(e, this.state)}
          >
            <div className="form-group">
              {console.log(numberOfOptions)}
              {/* <input type="text" name="question" /> */}
              {numberOfOptions.map((option, index) => {
                return (
                  <input
                    className="form-control form-control"
                    type="text"
                    name={`value${index}`}
                    placeholder={`#options${index}`}
                    onChange={this.handleInputChange}
                    required
                  />
                );
              })}
              <button
                type="submit"
                className="btn btn-outline-primary btn mx-2"
              >
                Allow voting
              </button>
            </div>
          </form>
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  handleVotingInput: (e, state) => {
    e.preventDefault();
    console.log(state);
    delete state.numberOfOptions;
    console.log(state);
    dispatch(handleVotingInput(state));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(Voting);
