import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';  // Import Toaster component
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Tasks from './components/Tasks/Tasks';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Register />} />
          <Route path='/login' element={<Login />} />

          {/* Protected route */}
          <Route 
            path='/tasks' 
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            } 
          />

          {/* Redirect any unknown route to Home */}
          <Route path='*' element={<Home />} />
        </Routes>
      </Router>
      
      {/* Include Toaster for toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;
