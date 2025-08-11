import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(() => {
        // Initialize auth user from localStorage but without the token
        const storedUser = localStorage.getItem('userInfo');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setAuthUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setAuthUser(null);
    };

    const value = {
        authUser,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
