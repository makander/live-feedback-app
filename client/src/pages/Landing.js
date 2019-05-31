import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
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
    <div className="d-flex justify-content-center pt-2">
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="col s12 center-align">
          <header>
            <h1 className="display-7 text-center">
              Feedback App - Team Impostrious BIG
            </h1>
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
