import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import AuthLinks from "./AuthLinks";

export const Links = () => {
  return (
    <div className="fullwidth">
      <div className="navbar-nav">
        <Link className="nav-item nav-link text-dark" to="/">
          Home
        </Link>
        <Link className="nav-item nav-link text-dark" to="/register">
          Register
        </Link>
        <Link className="nav-item nav-link text-dark" to="/login">
          Login
        </Link>
      </div>
    </div>
  );
};

export function Navbar(props) {
  const { auth } = props;
  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          {auth.isAuthenticated ? <AuthLinks /> : <Links />}
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, null)(Navbar);
