import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BrownButton, OutlinedBrownButton } from '../assets/CustomComponents';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';
import CategoryNavbar from './CategoryNavbar';

const Navbar = () => {
    const { auth, isAdmin, logout } = useContext(AuthContext);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-[900] bg-white p-4">
                <div className="flex justify-between items-center mx-auto max-w-screen-xl">
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src={logo} alt="Logo" className="w-60 h-11" />
                    </a>
                    <div className="flex items-center space-x-4">
                        <ul className="flex items-center space-x-4">
                            <li>
                                <Link to="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-brown-700 md:p-0">Home</Link>
                            </li>
                        </ul>
                        <div className="flex items-center space-x-4">
                            {auth.accessToken ? (
                                <>
                                    {isAdmin() && (
                                        <Link to="/dashboard/users">
                                            <BrownButton variant="contained" color="primary">Dashboard</BrownButton>
                                        </Link>
                                    )}
                                    <BrownButton variant="contained" color="primary" onClick={logout}>Log Out</BrownButton>
                                </>
                            ) : (
                                <>
                                    <Link to='/login'>
                                        <BrownButton variant="contained" color="primary">Login</BrownButton>
                                    </Link>
                                    <Link to='/register'>
                                        <OutlinedBrownButton>Register</OutlinedBrownButton>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className='pt-20 bg-white'>
                <CategoryNavbar />
            </div>
        </>
    );
};

export default Navbar;