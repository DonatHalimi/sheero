import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center'>
                <h1>Welcome to our application</h1>
            </div>
        </div>
    );
};

export default Home;