import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const AdminRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    const { showToast } = useToast();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-axiom-bg">
                <div className="w-8 h-8 rounded-lg bg-axiom-brand animate-pulse" />
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        showToast('Access denied: Admin privileges required.', 'error');
        return <Navigate to="/chat" replace />;
    }

    return children ? children : <Outlet />;
};

export default AdminRoute;
