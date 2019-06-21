import React, { Component } from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";

export default class UserVoting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedItems: new Map()
    };
  }

  handleInputChange = e => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({
      checkedItems: prevState.checkedItems.set(item, isChecked)
    }));
  };

  handleVotingInput = e => {
    e.preventDefault();
    const { checkedItems } = this.state;
    const { roomId } = this.props;
    const checkedItemsArray = Array.from(checkedItems, ([key, value]) => {
      return value === true ? key : null;
    });
    const socket = io(process.env.REACT_APP_SOCKET_CONNECTION);
    socket.emit("votingInput", checkedItemsArray, roomId);
    e.target.querySelector(".vote-control").disabled = true;
  };

  render() {
    const { votingParams } = this.props;

    const votingOptions =
      votingParams !== undefined ? Object.values(votingParams.params[0]) : null;

    return (
      <div className="d-flex justify-content-center mt-5">
        <form onSubmit={e => this.handleVotingInput(e)}>
          <fieldset className="vote-control">
            <div className="form-group">
              {votingOptions.map(option => {
                return (
                  <div
                    key={`voting-key-${option}`}
                    className="form-check form-check-inline"
                  >
                    <label
                      id={`label-${option}`}
                      htmlFor={option}
                      className="form-check-label"
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name={option}
                        onChange={this.handleInputChange}
                      />
                      {option}
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-outline-primary btn vote-btn"
              >
                Vote
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}

UserVoting.propTypes = {
  roomId: PropTypes.string.isRequired,
  votingParams: PropTypes.object.isRequired
};
