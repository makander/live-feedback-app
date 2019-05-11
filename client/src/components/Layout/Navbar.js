import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <Link className="nav-item nav-link text-white" to="/">
            Home
          </Link>
          <Link className="nav-item nav-link text-white" to="/register">
            Register
          </Link>
          <Link className="nav-item nav-link text-white" to="/login">
            Login
          </Link>
        </div>
      </div>
    </nav>
  </div>
);

export default Navbar;
