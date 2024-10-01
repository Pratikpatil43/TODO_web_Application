import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token'); // Fetch the token from cookies

  // If no token exists, redirect to the login page
  if (!token || token === 'null') {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the child components (like the Tasks page)
  return children;
};

export default ProtectedRoute;
