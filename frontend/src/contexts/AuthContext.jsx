import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await apiClient.get('/auth/session');
                if (response.data.success) {
                    setUser(response.data.data.user);
                }
            } catch {

                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        if (response.data.success) {
            setUser(response.data.data.user);
        }
        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await apiClient.post('/auth/register', { name, email, password });
        if (response.data.success) {
            setUser(response.data.data.user);
        }
        return response.data;
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
