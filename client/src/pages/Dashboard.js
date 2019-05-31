import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../actions/auth";
import withAuth from "../hocs/withAuth";

class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    const { logout } = this.props;
    logout();
  };

  render() {
    const {
      auth: { user }
    } = this.props;

    return (
      <div className="d-flex justify-content-center pt-2">
        <div
          className="border border-info p-5 shadow-sm"
          style={{ marginBottom: "3rem" }}
        >
          <div>
            <div className="row">
              <div className="text-center">
                <h1>Welcome!</h1>
                <h4>
                  <b>Hey there,</b> {user.name.split(" ")[0]}
                  <p>
                    You are logged into Feedplx!
                    <span role="img" aria-label="clap-emoji">
                      👏
                    </span>
                  </p>
                </h4>
                <div />
                <nav className="d-flex justify-content-around pt-5">
                  <Link
                    to="/new-session"
                    role="button"
                    className="btn btn-outline-primary btn"
                  >
                    New Session
                  </Link>

                  <Link
                    to="/my-sessions"
                    role="button"
                    className="btn btn-outline-secondary"
                  >
                    My Sessions
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logoutUser())
});

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(Dashboard));
