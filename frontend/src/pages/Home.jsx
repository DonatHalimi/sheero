import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Slideshow from '../components/Slideshow';

const Home = () => {
    return (
        <>
            <Navbar />

            <div className="mt-10 mb-40">
                <Slideshow />
            </div>

            <Footer />
        </>
    );
};

export default Home;
