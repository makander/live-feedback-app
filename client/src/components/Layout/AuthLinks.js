import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/auth";

export class AuthLinks extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    const { logout } = this.props;
    logout();
  };

  render() {
    return (
      <div className="navbar-nav">
        <Link className="nav-item nav-link text-white" to="/">
          Dashboard
        </Link>
        <Link className="nav-item nav-link text-white" to="/my-sessions">
          My Session
        </Link>
        <Link className="nav-item nav-link text-white" to="/new-session">
          New Session
        </Link>
        <a
          className="nav-item nav-link text-white"
          href="#"
          onClick={this.onLogoutClick}
        >
          Logout
        </a>
      </div>
    );
  }
}

AuthLinks.propTypes = {
  logout: PropTypes.func.isRequired
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
)(AuthLinks);
