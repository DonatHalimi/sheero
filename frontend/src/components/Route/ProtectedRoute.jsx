import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingOverlay } from '../../assets/CustomComponents';
import { AuthContext } from '../../context/AuthContext';

/**
 * A protected route component that conditionally renders its children based on authentication status and admin privileges.
 *
 * @param {object} children - The components to be rendered if the user is authenticated and has the required privileges.
 * @param {boolean} adminOnly - A flag indicating whether the route requires admin privileges.
 * @return {JSX.Element} The rendered children or a redirect to the login or not-allowed page.
 */
const ProtectedRoute = ({ children, adminOnly }) => {
    const { auth, isAdmin, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <LoadingOverlay />
    }

    if (!auth.accessToken) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/not-allowed" />;
    }

    return children;
};

export default ProtectedRoute;