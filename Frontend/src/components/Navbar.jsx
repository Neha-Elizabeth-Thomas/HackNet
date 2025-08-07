import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // Get user's name from local storage to display
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userName = userInfo ? userInfo.name : 'User';

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('userInfo');
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">
              AI Syllabus Tracker
            </Link>
          </div>
          <div className="flex items-center">
            <span className="text-gray-700 mr-4">Welcome, {userName}</span>
            <button
              onClick={handleLogout}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
