import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    if (auth.accessToken) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PublicRoute;