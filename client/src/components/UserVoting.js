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

  /*   handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(this.state);
  }; */

  handleVotingInput = e => {
    e.preventDefault();
    const { checkedItems } = this.state;
    const { roomId } = this.props;
    const checkedItemsArray = Array.from(checkedItems, ([key, value]) => {
      return value === true ? key : null;
    });
    const socket = io(process.env.REACT_APP_SOCKET_CONNECTION);
    socket.emit("votingInput", checkedItemsArray, roomId);
  };

  handleInputChange = e => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({
      checkedItems: prevState.checkedItems.set(item, isChecked)
    }));
  };

  componentDidMount = () => {};

  render() {
    const { votingParams } = this.props;

    const votingOptions =
      votingParams !== undefined ? Object.values(votingParams.params[0]) : null;

    return (
      <div className="d-flex justify-content-center mt-5">
        <form onSubmit={e => this.handleVotingInput(e)}>
          <div className="form-group">
            {/* <input type="text" name="question" /> */}
            {votingOptions.map(option => {
              return (
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name={option}
                    onChange={this.handleInputChange}
                  />
                  <label className="form-check-label">{option}</label>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-outline-primary btn">
              Vote
            </button>
          </div>
        </form>
      </div>
    );
  }
}

UserVoting.propTypes = {
  roomId: PropTypes.string.isRequired,
  votingParams: PropTypes.object.isRequired
};
