import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { LoadingOverlay } from '../../assets/CustomComponents';

const ProtectedRoute = ({ children, adminOnly }) => {
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <LoadingOverlay />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/not-allowed" />;
    }

    return children;
};

export default ProtectedRoute;