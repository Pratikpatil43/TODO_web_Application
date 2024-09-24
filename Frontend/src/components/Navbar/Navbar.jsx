import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Navbar.css'; // Import the CSS file
import toast from 'react-hot-toast'; // Import toast for notifications

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage menu visibility
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Remove token
    toast.success('Logged out successfully!'); // Show toast message
    navigate('/login'); // Redirect to login page after logout
  };

  // Check if token exists in sessionStorage
  const token = sessionStorage.getItem('token');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Logo</Link> {/* Always display the Home/Logo */}
      </div>
      <div className="navbar-toggle" onClick={toggleMenu}>
        <div className={`bar ${isOpen ? 'active' : ''}`}></div>
        <div className={`bar ${isOpen ? 'active' : ''}`}></div>
        <div className={`bar ${isOpen ? 'active' : ''}`}></div>
      </div>
      <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <li><Link to="/">Home</Link></li> {/* Always show Home */}
        {!token && (
          <>
            <li><Link to="/signup">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
        {token && (
          <li>
            <span onClick={handleLogout} className="logout-link">
              Logout
            </span>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
