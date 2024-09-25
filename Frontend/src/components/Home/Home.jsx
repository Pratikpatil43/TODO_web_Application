import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
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
        {/* Use Link styled as a button */}
        <Link to='/tasks' className="cta-button">Schedule Now</Link>
      </header>
    </div>
  );
};

export default Home;
