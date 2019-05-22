import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

function Chart(props) {
  const { auth, history } = props;

  return (
    <div className="d-flex justify-content-center pt-2">
      <div className="border border-info p-5" style={{ marginBottom: "3rem" }}>
        <div>
          <div className="row">
            <div className="text-center">
              <div />
              <nav className="d-flex justify-content-around pt-5">
                <button type="button" className="btn btn-outline-danger">
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Chart.propTypes = {
  auth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Chart));
