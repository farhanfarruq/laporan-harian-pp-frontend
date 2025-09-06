import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const getUserFromStorage = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
};

const getTokenFromStorage = () => {
    return localStorage.getItem('token');
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getUserFromStorage());
    const [token, setToken] = useState(getTokenFromStorage());
    const [error, setError] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const navigate = useNavigate();

    const login = async (username, password) => {
        setIsLoggingIn(true);
        setError(null);
        try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login gagal');
            
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            setUser(data.user);
            setToken(data.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        navigate('/login', { replace: true });
    };

    const value = { user, token, error, login, logout, setError, isLoggingIn };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};