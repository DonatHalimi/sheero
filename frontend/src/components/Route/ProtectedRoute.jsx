import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly }) => {
    const { auth, isAdmin } = useContext(AuthContext);

    if (!auth.accessToken) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/not-allowed" />;
    }

    return children;
};

export default ProtectedRoute;