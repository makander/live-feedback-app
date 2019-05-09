import React from "react";
import { Link } from "react-router-dom";

const navbarContainerStyle = {
  background:"black",
  padding:"0",
  display:"flex",
}

const navlinkStyle = {
    fontFamily: "sans-serif",
    textDecoration: "none",
    color: "white",
    background:"#e14646",
    margin: "0",
    padding: "10px",
    width:"80px",
    borderRight:"1px solid black"
}

const Navbar = () => (
  <nav style={navbarContainerStyle}>
      <Link
        to="/"
        style={navlinkStyle}
      >
        Home
      </Link>
      <Link
        to="/register"
        style={navlinkStyle}
      >
        Register
      </Link>
      <Link
        to="/login"
        style={navlinkStyle}
      >
        Login
      </Link>
  </nav>
);

export default Navbar;
