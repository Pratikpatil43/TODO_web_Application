import React from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie'; // Import js-cookie


const Home = () => {
  const navigate = useNavigate();

  const handleScheduleClick = () => {
    const token = Cookies.get('token'); // Check for JWT token in localStorage
    if (token) {
      navigate('/tasks'); // Navigate to tasks page if the token is present
    } else {
      toast.error('You need to log in to schedule tasks'); // Show alert if token is missing
      navigate('/login'); // Optionally navigate to the login page
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="main-heading">Stay organized. Stay productive.</h1>
        <p className="sub-heading">
          Plan your day effortlessly with our simple task scheduler.
        </p>
        <p className="description">
          Create tasks. Set deadlines. Stay on track.
        </p>
        <p className="action-message">
          Easy to use. Just create a task, set your time, and let us handle the rest. From deadlines to reminders, we help you focus on what matters most.
        </p>
        {/* Button with onClick handler to check for JWT */}
        <button onClick={handleScheduleClick} className="cta-button">
          Schedule Now
        </button>
      </header>
    </div>
  );
};

export default Home;
