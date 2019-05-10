import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

function Landing(props) {
  const { auth, history } = props;

  useEffect(() => {
    if (auth.isAuthenticated) {
      history.push("/dashboard");
    }
  });

  return (
    <div style={{ height: "75vh" }} className="container valign-wrapper">
      <div className="row">
        <div className="col s12 center-align">
          <header>
            <h2>Feedback App - Team Impostrious BIG</h2>
          </header>
          <main>
            <section>
              <h3>A simple way to keep track of your lecture tempo</h3>
              <p>
                Feedback App aims to provide a solution for teachers that seek
                to better pace their lectures. We provide your students with a
                simple feedback interface that collects and presents their data
                in realtime. The data can also be archived and presented in a
                easy to read diagram.
              </p>
            </section>
          </main>
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
