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
          <main>
            <section className="d-flex">
              <div>
                <h1>The easisest way to interact with your audience</h1>
                <p>
                  Feedback App is the solution that presenters seek to better
                  pace their lectures.
                </p>
                <p>
                  We provide your participants with an easy to use feedback
                  interface that collects and presents their data in realtime.
                  The data can also be archived and presented in a easy to read
                  diagram.
                </p>
              </div>

              <div>Image</div>
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
