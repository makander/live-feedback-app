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
      <div>
        <form className="form-inline" onSubmit={e => this.handleVotingInput(e)}>
          <div className="form-group">
            {/* <input type="text" name="question" /> */}
            {votingOptions.map(option => {
              return (
                <div key={option}>
                  <input
                    className="form-control form-control"
                    type="checkbox"
                    name={option}
                    placeholder={option}
                    onChange={this.handleInputChange}
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

UserVoting.propTypes = {
  roomId: PropTypes.string.isRequired,
  votingParams: PropTypes.object.isRequired
};
