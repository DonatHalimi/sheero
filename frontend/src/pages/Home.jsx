import React from 'react';
import CategoriesList from '../components/CategoriesList';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Slideshow from '../components/Slideshow';

const Home = () => {
    return (
        <>
            <Navbar />

            <CategoriesList />

            <div className="mb-40">
                <Slideshow />
            </div>

            <Footer />
        </>
    );
};

export default Home;
