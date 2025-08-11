import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpenText, Cpu } from 'lucide-react'; // Modern, minimal icons
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const { authUser, logout } = useAuth();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userName = userInfo ? userInfo.name : 'User';

  const handleLogout = async () => {
            try {
                await api.post('/auth/logout');
                logout(); // Clear user state from context
                navigate('/login');
            } catch (error) {
                console.error('Logout failed', error);
            }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <BookOpenText size={28} className="text-white" />
            <Cpu size={24} className="text-pink-200" />
            <span className="text-2xl font-bold tracking-tight text-white font-[Inter]">
              SyllabiQ
            </span>
          </Link>

          {/* User info + logout */}
          <div className="flex items-center space-x-4">
            <span className="text-white/90 font-medium">
              Welcome, <span className="text-white font-semibold">{userName}</span>
            </span>
            <button
              onClick={handleLogout}
              className="py-2 px-4 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300"
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
