import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import api from '../services/api';
import { Brain } from 'lucide-react'; // modern icon

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      console.error('Login failed:', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 font-sans">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full">
        
        {/* Left side hero / branding */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 to-indigo-700 text-white w-1/2 p-10">
          <Brain className="w-16 h-16 mb-4" />
          <h1 className="text-4xl font-bold mb-3">SyllabiQ</h1>
          <p className="text-lg text-indigo-100 text-center">
            Smart AI-powered syllabus tracking for faculty. Stay organized, save time, and teach with confidence.
          </p>
        </div>

        {/* Right side login form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Sign in to continue to your dashboard
          </p>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <AuthForm onSubmit={handleLogin} isLoading={isLoading} />

          <p className="mt-6 text-center text-sm text-gray-600">
            Not a member yet?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
