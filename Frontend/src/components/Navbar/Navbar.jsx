import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Navbar.css'; // Import the CSS file
import toast from 'react-hot-toast'; // Import toast for notifications
import Cookies from 'js-cookie'; // Import Cookies for cookie management

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage menu visibility
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = () => {
    Cookies.remove('token'); // Remove token from cookies
    toast.success('Logged out successfully!'); // Show toast message
    navigate('/'); // Redirect to home page after logout
  };

  // Check if token exists in cookies
  const token = Cookies.get('token');

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
        {!token && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/signup">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
        {token && (
          <>
            <li><Link to="/tasks">Tasks</Link></li>
            <li>
              <span onClick={handleLogout} className="logout-link">
                Logout
              </span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
