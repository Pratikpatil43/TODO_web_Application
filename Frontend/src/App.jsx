import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Tasks from './components/Tasks/Tasks';
import toast, { Toaster } from 'react-hot-toast'; // For toast notifications
import Cookies from 'js-cookie';

const App = () => {
  // Check if the user is authenticated (i.e., a token exists in sessionStorage)
  const token = Cookies.get('token');
  
  // Debugging: log the token to check its value
  // console.log('Token:', token); // Make sure this is a valid token string

  return (
    <>
      <Router>
        <Navbar />
        <Toaster /> {/* For showing toast notifications */}
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Register />} />
          <Route path='/login' element={<Login />} />

          {/* Protected route */}
          {token && token !== 'null' && token !== '' ? (
            <Route path='/tasks' element={<Tasks />} />
          ) : (
            <Route path='/tasks' element={<Navigate to='/login' replace />} />
          )}

          {/* Redirect any unknown route to Home */}
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
