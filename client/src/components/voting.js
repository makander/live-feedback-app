import React, { Component } from "react";

export default class voting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      voting_options: null
    };
  }

  handleVotingInput = e => {
    e.preventDefault();
  };

  componentDidMount = () => {
    console.log(this.props);

    /* const voting_options = null;
    this.props.voting_params
      ? (voting_options = Object.values(this.props.voting_params.params[0]))
      : null;
    this.setState({}); */
  };

  render() {
    const voting_options =
      this.props.voting_params !== undefined
        ? Object.values(this.props.voting_params.params[0])
        : null;

    return (
      <div>
        {console.log(this.props)}
        {console.log("voting", voting_options)}
        <h2>Vote for one or more topics that you didnt fully grasp</h2>
        <form
          className="form-inline"
          onSubmit={e => this.handleVotingInput(e, this.state)}
        >
          <div className="form-group">
            {/* <input type="text" name="question" /> */}
            {voting_options.map(option => {
              return (
                <div>
                  <input
                    className="form-control form-control"
                    type="checkbox"
                    name={option}
                    placeholder={option}
                    onChange={this.handleInputChange}
                    required
                  />{" "}
                  {option} <br />
                </div>
              );
            })}

            <button type="submit" className="btn btn-outline-primary btn mx-2">
              Vote
            </button>
          </div>
        </form>
      </div>
    );
  }
}
