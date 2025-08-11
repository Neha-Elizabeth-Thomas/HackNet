import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import api from '../services/api';
import { GraduationCap } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (credentials) => {
    setIsLoading(true);
    setError('');

    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.post('/auth/register', credentials);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      console.error('Registration failed:', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 font-sans">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full">
        
        {/* Left branding section */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 to-indigo-700 text-white w-1/2 p-10">
          <GraduationCap className="w-16 h-16 mb-4" />
          <h1 className="text-4xl font-bold mb-3">SyllabiQ</h1>
          <p className="text-lg text-indigo-100 text-center">
            Join our AI-powered platform to manage and track your course syllabus effortlessly.
          </p>
        </div>

        {/* Right register form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Create Your Account
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Sign up to start tracking and managing your courses
          </p>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <AuthForm
            isRegister={true}
            onSubmit={handleRegister}
            isLoading={isLoading}
          />

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
