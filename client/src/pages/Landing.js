import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import iphone_50 from "../components/Layout/iphone_75.png";

function Landing(props) {
  const { auth, history } = props;

  useEffect(() => {
    if (auth.isAuthenticated) {
      history.push("/dashboard");
    }
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm offset-sm-1 mt-4">
          <h1 className="pb-2">Welcome to Tempo</h1>
          <h4 className="pb-2">
            <em>The easiest way to interact with your audience</em>
          </h4>
          <p className="pt-4">
            Tempo is <em>the</em> solution that presenters seek to better pace
            their lectures.
          </p>
          <p className="pt-2">
            We provide your participants with an easy to use feedback interface
            that collects and presents their data in realtime. The data can also
            be archived and presented in a easy to read diagram.
          </p>
        </div>

        <div className="col-sm mt-4 d-none d-md-block">
          <img src={iphone_50} className="hidden-md-down" />
        </div>
      </div>
    </div>
  );
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Landing));
