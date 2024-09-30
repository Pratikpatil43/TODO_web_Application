import React, { useState } from 'react';
import './Login.css'; // Import the CSS file
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie'; // Import js-cookie

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Used for redirecting after login

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true);

    const payload = {
      username,
      password,
    };

    try {
      const response = await axios.post('http://localhost:3000/user/login', payload);
      console.log(payload)

      if(response.status === 200){
        const { token } = response.data; // Assuming your backend returns { token }
        Cookies.set('token', token, { expires: 7 }); // Store token in cookies for 7 days
        navigate('/tasks');
        toast.success('Login successful!');

        // Redirect to a protected route after successful login


      } else {
        toast.error('Login failed! Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="register-container">
      <h2>Login</h2>
      <form className="register-form" onSubmit={handleLogin}>
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
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>
        <p className="login-link">
          Don't have an Account? <Link to="/signup">Register here</Link>
        </p>
      </form>
      <Toaster /> {/* Add this for toast notifications */}
    </div>
  );
};

export default Login;
