import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * A route component that conditionally renders its children based on authentication status.
 *
 * @param {object} children - The components to be rendered if the user is not authenticated.
 * @return {JSX.Element} The rendered children or a redirect to the root page.
 */
const PublicRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    if (auth.accessToken) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PublicRoute;