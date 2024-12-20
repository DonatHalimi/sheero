import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { LoadingOverlay } from '../../assets/CustomComponents';

/**
 * A wrapper component that checks if a user is authenticated and authorized to access the component.
 * If not authenticated, it redirects to the login page.
 * If authenticated but not authorized, it redirects to the not allowed page.
 * If authenticated and authorized, it renders the wrapped component.
 * @param {React.ReactNode} children The component to be wrapped
 * @param {boolean} adminOnly If true, only admins are authorized
 * @returns {React.ReactNode} The wrapped component if authorized, otherwise a redirect
 */
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