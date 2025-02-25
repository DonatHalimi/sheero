import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { LoadingOverlay } from '../../assets/CustomComponents';

/**
 * A wrapper component for protected routes that ensures only authenticated users
 * with the appropriate roles can access the wrapped component. It handles loading
 * states, redirects unauthenticated users to the login page, and restricts access
 * based on user roles.
 *
 * @param {React.ReactNode} children - The component to be rendered if access is granted.
 * @param {Array} allowedRoles - An array of roles permitted to access the route.
 *                                If not provided, all authenticated users can access.
 * @returns {React.ReactNode} The wrapped component if access is granted, otherwise a redirect.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <LoadingOverlay />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles) {
        if (!allowedRoles.includes(user?.role)) {
            return <Navigate to="/not-allowed" />;
        }
        return children;
    }

    return children;
};

export default ProtectedRoute;