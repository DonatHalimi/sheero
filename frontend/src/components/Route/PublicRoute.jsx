import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * A wrapper component for public routes that redirects authenticated users
 * to the home page. If the user is not authenticated, it renders the wrapped
 * component.
 *
 * @param {React.ReactNode} children - The component to be rendered if the user is not authenticated.
 * @returns {React.ReactNode} The wrapped component if not authenticated, otherwise a redirect.
 */
const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PublicRoute;
