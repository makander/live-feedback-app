import React, { Component } from "react";
import io from "socket.io-client";

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

    const { room_id } = this.props;
    console.log(e.target);
    const checkedItems = Array.from(this.state.checkedItems, ([key, value]) => {
      return value === true ? key : null;
    });
    console.log(checkedItems);
    const socket = io(process.env.REACT_APP_SOCKET_CONNECTION);
    socket.emit("votingInput", checkedItems, room_id);
  };

  handleInputChange = e => {
    /* this.setState({
      [e.target.name]: e.target.value
    });
    console.log("state", this.state); */
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({
      checkedItems: prevState.checkedItems.set(item, isChecked)
    }));
  };

  test = () => {
    console.log(this.state);
  };

  componentDidMount = () => {};

  render() {
    const voting_options =
      this.props.voting_params !== undefined
        ? Object.values(this.props.voting_params.params[0])
        : null;

    return (
      <div>
        {console.log(this.props)}
        {console.log("voting", voting_options)}
        {/* <h2>Vote for one or more topics that you didnt fully grasp</h2>
        
        <form onSubmit={this.handleVotingInput}>
          <button type="submit">submit</button>
        </form> */}
        <form className="form-inline" onSubmit={e => this.handleVotingInput(e)}>
          <button onClick={this.test}>state</button>
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
