// components/Navbar/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage menu visibility

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Logo</Link>
      </div>
      <div className="navbar-toggle" onClick={toggleMenu}>
        <div className={`bar ${isOpen ? 'active' : ''}`}></div>
        <div className={`bar ${isOpen ? 'active' : ''}`}></div>
        <div className={`bar ${isOpen ? 'active' : ''}`}></div>
      </div>
      <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/signup">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
