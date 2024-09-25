import React, { useState } from 'react';
import './Register.css'; // Import the CSS file
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // Import Toaster here

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const payload = { email, username, password };

    setLoading(true); // Set loading to true before making the request

    axios.post('http://localhost:3000/user/register', payload)
      .then((res) => {
        toast.success("Registered Successfully!");
        // Optionally reset the form or redirect
        navigate('/login')
        setUsername('');
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "Something went wrong signing up.";
        toast.error(errorMessage);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after the request is completed
      });
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <div className="form-group mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div id="emailHelp" className="form-text">We'll never share your email and password with anyone else.</div>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-check mb-3">
          <input type="checkbox" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" htmlFor="exampleCheck1">Accept the terms and conditions</label>
        </div><br />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Please wait..." : "Register"}
        </button>
        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
      <Toaster /> {/* Add this for toast notifications */}
    </div>
  );
};

export default Register;
