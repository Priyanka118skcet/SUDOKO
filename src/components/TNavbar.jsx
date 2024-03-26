// TNavbar.jsx
import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import '../styles/TNavstyle.css';

const TNavbar = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <nav className="navbar">

      <h3>SUDOKO SOLVER...!</h3>
      <div onClick={handleClick} className="nav-icon">
        {open ? <FiX /> : <FiMenu />}
      </div>
    
    </nav>
  );
};

export default TNavbar;
