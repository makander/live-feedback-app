import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav>
    <div>
      <Link
        to="/"
        style={{
          fontFamily: "monospace"
        }}
      >
        Impostrious
      </Link>
    </div>
  </nav>
);

export default Navbar;
