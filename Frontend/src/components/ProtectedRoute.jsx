    import React from 'react';
    import { Navigate, Outlet } from 'react-router-dom';
    import { useAuth } from '../contexts/AuthContext';

    const ProtectedRoute = () => {
        const { authUser } = useAuth();
        // Check for user state in context instead of localStorage
        return authUser ? <Outlet /> : <Navigate to="/login" replace />;
    };

    export default ProtectedRoute;
    