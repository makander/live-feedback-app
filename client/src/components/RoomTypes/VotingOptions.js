import React, { Component } from "react";
import { connect } from "react-redux";
import uuid from "uuid/v4";
import PropTypes from "prop-types";
import { handleVotingInput } from "../../actions/room";

class VotingOptions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfOptions: [],
      valuesToDisplay: []
    };
  }

  createForm = e => {
    e.preventDefault();
  };

  handleInputChange = e => {
    e.preventDefault();
    const { valuesToDisplay } = this.state;

    this.setState({
      valuesToDisplay: {
        ...valuesToDisplay,
        [e.target.name]: e.target.value
      }
    });
  };

  handleOnSubmitOptions = e => {
    e.preventDefault();

    if (e.target.options.value && e.target.options.value <= 5) {
      const options = Array(parseInt(e.target.options.value, 10)).fill(1);
      const uuidArray = [];

      options.forEach(() => {
        uuidArray.push(uuid());
      });

      this.setState({
        numberOfOptions: uuidArray
      });
    }
  };

  render() {
    const { numberOfOptions } = this.state;
    const { handleVotingInputDispatch } = this.props;

    return (
      <div>
        <p>Allow participants to vote for topics specified below</p>
        <form className="form-inline" onSubmit={e => this.handleOnSubmitOptions(e)}>
          <input className="form-control"type="number" name="options" min="1" max="5" />
          <button className="btn btn-outline-primary btn mx-2" type="submit">Number of options</button>
        </form>
        {numberOfOptions.length ? (
          <form
            className="form-inline"
            onSubmit={e => {
              handleVotingInputDispatch(e, this.state);
            }}
          >
            <div className="form-group">
              {numberOfOptions.map(optionKey => {
                const {
                  valuesToDisplay: { option }
                } = this.state;
                return (
                  <input
                    className="form-control form-control"
                    type="text"
                    name={optionKey}
                    value={option}
                    placeholder="Enter an option" 
                    onChange={this.handleInputChange}
                    key={optionKey}
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
  handleVotingInputDispatch: (e, state) => {
    e.preventDefault();
    const reducedArray = [...new Set(Object.values(state.valuesToDisplay))];
    dispatch(handleVotingInput(reducedArray));
  }
});

VotingOptions.propTypes = {
  handleVotingInputDispatch: PropTypes.func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(VotingOptions);
