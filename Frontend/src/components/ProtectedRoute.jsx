import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * A component that acts as a guard for private routes.
 * It checks for user authentication status in local storage.
 * If the user is authenticated, it renders the child routes (using <Outlet />).
 * If not, it redirects the user to the login page.
 */
const ProtectedRoute = () => {
  // Check for user info in local storage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // If user info and a token exist, the user is considered authenticated.
  // The <Outlet /> component will render the nested child route (e.g., DashboardPage).
  return userInfo && userInfo.token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
