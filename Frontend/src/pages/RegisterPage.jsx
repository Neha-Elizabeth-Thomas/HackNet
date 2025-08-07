import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import api from '../services/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the registration logic when the form is submitted.
   * @param {object} credentials - The user's name, email, and password.
   */
  const handleRegister = async (credentials) => {
    setIsLoading(true);
    setError(''); // Clear previous errors

    // Basic password validation
    if (credentials.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
    }

    try {
      // Make a POST request to the backend's register endpoint
      const { data } = await api.post('/auth/register', credentials);
      
      // On success, store the new user's info (including the token) in local storage
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Redirect the user to the main dashboard
      navigate('/dashboard');
    } catch (err) {
      // If the API call fails, set an error message to display to the user
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      console.error('Registration failed:', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Create your account
        </h2>
        
        {/* Display error message if registration fails */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <AuthForm
          isRegister={true} // Tell the form to show the 'Name' field
          onSubmit={handleRegister}
          isLoading={isLoading}
        />
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Already a member?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
