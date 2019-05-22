import React, { Component } from "react";
import { connect } from "react-redux";

class SessionDetails extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <h1>This is the session details</h1>
      </div>
    );
  }
}

const mapDispatchToProps = () => ({});

const mapStateToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionDetails);
