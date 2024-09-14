import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './Auth'; // Ensure you have this hook implemented correctly
import Navbar from './Navbar';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
